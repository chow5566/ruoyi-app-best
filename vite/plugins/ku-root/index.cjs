'use strict';

const process = require('node:process');
const node_path = require('node:path');
const vite = require('vite');
const chokidar = require('chokidar');
const node_fs = require('node:fs');
const jsoncParser = require('jsonc-parser');
const compilerSfc = require('vue/compiler-sfc');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const process__default = /*#__PURE__*/_interopDefaultCompat(process);
const chokidar__default = /*#__PURE__*/_interopDefaultCompat(chokidar);

async function parseSFC(code) {
  try {
    return compilerSfc.parse(code, { pad: "space" }).descriptor || compilerSfc.parse({ source: code });
  } catch {
    throw new Error(
      "[@uni-ku/root] Vue's version must be 3.2.13 or higher."
    );
  }
}
function formatPagePath(root, path) {
  return vite.normalizePath(`${node_path.join(root, path)}.vue`);
}
function loadPagesJson(path, rootPath) {
  const pagesJsonRaw = node_fs.readFileSync(path, "utf-8");
  const { pages = [], subPackages = [] } = jsoncParser.parse(pagesJsonRaw);
  return [
    ...pages.map((page) => formatPagePath(rootPath, page.path)),
    ...subPackages.map(({ pages: pages2 = {}, root = "" }) => {
      return pages2.map((page) => formatPagePath(node_path.join(rootPath, root), page.path));
    }).flat()
  ];
}
function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").toLowerCase();
}
function toPascalCase(str) {
  return str.replace(/(^\w|-+\w)/g, (match) => match.toUpperCase().replace(/-/g, ""));
}
function findNode(sfc, rawTagName) {
  const templateSource = sfc.template?.content;
  if (!templateSource)
    return;
  let tagName = "";
  if (templateSource.includes(`<${toKebabCase(rawTagName)}`)) {
    tagName = toKebabCase(rawTagName);
  } else if (templateSource.includes(`<${toPascalCase(rawTagName)}`)) {
    tagName = toPascalCase(rawTagName);
  }
  if (!tagName)
    return;
  const nodeAst = sfc.template?.ast;
  if (!nodeAst)
    return;
  return nodeAst.children.find((node) => node.type === 1 && node.tag === tagName);
}

async function registerKuApp(code) {
  const ms = new compilerSfc.MagicString(code);
  const importCode = `import UniKuAppRoot from "./App.ku.vue";`;
  const vueUseComponentCode = `app.component("uni-ku-app-root", UniKuAppRoot);`;
  ms.prepend(`${importCode}
`).replace(
    /(createApp[\s\S]*?)(return\s\{\s*app)/,
    `$1${vueUseComponentCode}
$2`
  );
  return ms;
}
async function rebuildKuApp(path) {
  const rootTagNameRE = /<(KuRootView|ku-root-view)\s*\/>/;
  const code = await node_fs.promises.readFile(path, "utf-8");
  const ms = new compilerSfc.MagicString(code).replace(rootTagNameRE, "<slot />");
  return ms;
}

async function transformPage(code, enabledGlobalRef = false) {
  const sfc = await parseSFC(code);
  const ms = new compilerSfc.MagicString(code);
  const pageTempStart = sfc.template?.loc.start.offset;
  const pageTempEnd = sfc.template?.loc.end.offset;
  let pageMetaSource = "";
  const pageMetaNode = findNode(sfc, "PageMeta");
  if (pageMetaNode) {
    pageMetaSource = pageMetaNode.loc.source;
    const metaTempStart = pageMetaNode.loc.start.offset;
    const metaTempEnd = pageMetaNode.loc.end.offset;
    ms.remove(metaTempStart, metaTempEnd);
  }
  const pageTempAttrs = sfc.template?.attrs;
  let pageRootRefSource = enabledGlobalRef ? 'ref="uniKuRoot"' : "";
  if (pageTempAttrs && pageTempAttrs.root) {
    pageRootRefSource = `ref="${pageTempAttrs.root}"`;
  }
  if (pageTempStart && pageTempEnd) {
    ms.appendLeft(pageTempStart, `
${pageMetaSource}
<uni-ku-app-root ${pageRootRefSource}>`);
    ms.appendRight(pageTempEnd, `</uni-ku-app-root>
`);
  }
  return ms;
}

function UniKuRoot(options = {}) {
  const rootPath = process__default.env.UNI_INPUT_DIR || `${process__default.env.INIT_CWD}\\src`;
  const appKuPath = node_path.resolve(rootPath, "App.ku.vue");
  const pagesPath = node_path.resolve(rootPath, "pages.json");
  let pagesJson = loadPagesJson(pagesPath, rootPath);
  let isPro;
  let watcher = null;
  return {
    name: "vite-plugin-uni-root",
    enforce: "pre",
    config(config, { mode }) {
      isPro = mode === "production";
    },
    buildStart() {
      watcher = chokidar__default.watch(pagesPath).on("all", (event) => {
        if (["add", "change"].includes(event)) {
          pagesJson = loadPagesJson(pagesPath, rootPath);
        }
      });
    },
    buildEnd() {
      if (isPro) {
        watcher && watcher.close();
      }
    },
    async transform(code, id) {
      let ms = null;
      const filterMain = vite.createFilter(`${rootPath}/main.(ts|js)`);
      if (filterMain(id))
        ms = await registerKuApp(code);
      const filterKuRoot = vite.createFilter(`${rootPath}/App.ku.vue`);
      if (filterKuRoot(id))
        ms = await rebuildKuApp(appKuPath);
      const filterPage = vite.createFilter(pagesJson);
      if (filterPage(id)) {
        ms = await transformPage(code, options.enabledGlobalRef);
      }
      if (ms) {
        return {
          code: ms.toString(),
          map: ms.generateMap({ hires: true })
        };
      }
    }
  };
}

module.exports = UniKuRoot;
