import process from 'node:process';
import { join, resolve } from 'node:path';
import { normalizePath, createFilter } from 'vite';
import chokidar from 'chokidar';
import { readFileSync, promises } from 'node:fs';
import { parse } from 'jsonc-parser';
import { parse as parse$1, MagicString } from 'vue/compiler-sfc';

async function parseSFC(code) {
  try {
    return parse$1(code, { pad: "space" }).descriptor || parse$1({ source: code });
  } catch {
    throw new Error(
      "[@uni-ku/root] Vue's version must be 3.2.13 or higher."
    );
  }
}
function formatPagePath(root, path) {
  return normalizePath(`${join(root, path)}.vue`);
}
function loadPagesJson(path, rootPath) {
  const pagesJsonRaw = readFileSync(path, "utf-8");
  const { pages = [], subPackages = [] } = parse(pagesJsonRaw);
  return [
    ...pages.map((page) => formatPagePath(rootPath, page.path)),
    ...subPackages.map(({ pages: pages2 = {}, root = "" }) => {
      return pages2.map((page) => formatPagePath(join(rootPath, root), page.path));
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
  const ms = new MagicString(code);
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
  const code = await promises.readFile(path, "utf-8");
  const ms = new MagicString(code).replace(rootTagNameRE, "<slot />");
  return ms;
}

async function transformPage(code, enabledGlobalRef = false) {
  const sfc = await parseSFC(code);
  const ms = new MagicString(code);
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
  const rootPath = process.env.UNI_INPUT_DIR || `${process.env.INIT_CWD}\\src`;
  const appKuPath = resolve(rootPath, "App.ku.vue");
  const pagesPath = resolve(rootPath, "pages.json");
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
      watcher = chokidar.watch(pagesPath).on("all", (event) => {
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
      const filterMain = createFilter(`${rootPath}/main.(ts|js)`);
      if (filterMain(id))
        ms = await registerKuApp(code);
      const filterKuRoot = createFilter(`${rootPath}/App.ku.vue`);
      if (filterKuRoot(id))
        ms = await rebuildKuApp(appKuPath);
      const filterPage = createFilter(pagesJson);
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

export { UniKuRoot as default };
