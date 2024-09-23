import { createFilter } from 'vite';
import { MagicString } from '@vue/compiler-sfc';

// 定义权限、角色 attribute 名称
let permsAttrName, rolesAttrName;

/**
 * 获取正则表达式
 * @param type {string} 权限类型，perms、roles、vIf
 * @returns {RegExp}
 */
const getRegex = (type = 'perms') => {
  // 权限正则
  const permsRegex = new RegExp(
    `<([a-zA-Z-]+)([^>]*)\\s*${permsAttrName}="([^"]*)"([^>]*)>`,
    'g'
  );

  // 角色正则
  const rolesRegex = new RegExp(
    `<([a-zA-Z-]+)([^>]*)\\s*${rolesAttrName}="([^"]*)"([^>]*)>`,
    'g'
  );

  // v-if正则
  const vIfRegex = /v-if="([^"]*)"/g;

  // 根据类型返回正则表达式
  let regex = permsRegex;
  if (type === 'roles') {
    regex = rolesRegex;
  } else if (type === 'vIf') {
    regex = vIfRegex;
  }
  return regex;
};

/**
 * 获取执行权限/角色方法名称
 * @param type {string} 权限类型，perms、roles
 * @returns {string}
 */
const getExecMethodName = (type) => {
  return type === 'perms' ? '$zx.isHasPermission' : '$zx.isHasRole';
};

const transformCode = (type, code) => {
  // 实例化 MagicString
  const MS = new MagicString(code);
  // 权限/角色正则
  const attrRegex = getRegex(type);
  // v-if 正则
  const vIfRegex = getRegex('vIf');
  // 执行权限/角色方法名称
  const execMethodName = getExecMethodName(type);
  // 遍历匹配到的所有属性
  let match;
  while ((match = attrRegex.exec(code)) !== null) {
    const fullMatch = match[0]; // 完整的标签
    const tagName = match[1]; // 标签名
    const zPermsValue = match[3]; // z-perms 属性值
    const preAttr = match[2]; // z-perms前边attributes
    const afterAttr = match[4]; // z-perms后边attributes
    const attributes = preAttr + afterAttr; // 标签内的所有attributes

    let newAttributes;

    if (vIfRegex.test(attributes)) {
      // 如果有 v-if 属性，合并 z-perms 和 v-if
      newAttributes = attributes.replace(vIfRegex, (vIfMatch, vIfCondition) => {
        return `v-if="(${vIfCondition}) && (${execMethodName}(${zPermsValue}))"`;
      });
    } else {
      // 如果没有 v-if，直接添加 z-perms 权限检查
      newAttributes = attributes.trim()
        ? `${attributes.trim()} v-if="${execMethodName}(${zPermsValue})"`
        : ` v-if="${execMethodName}(${zPermsValue})"`;
    }

    // 替换标签内的内容
    const updatedTag = `<${tagName}${newAttributes}>`; // 确保最后有关闭符号
    MS.update(match.index, match.index + fullMatch.length, updatedTag);
  }
  // 返回处理后的代码
  return MS.toString();
};

/**
 * vite 插件
 * @description 处理 uniapp 权限、角色属性，添加权限/角色检查
 * @param options
 * @returns {{transform(*, *): (null|{code: *, map: *}), name: string}|{code: string, map: *}|null}
 */
export default function vitePluginUniappPerms(options = {}) {
  // 过滤器，只处理指定目录下的文件
  const filter = createFilter(
    options.include || [/src/],
    options.exclude || [/node_modules/]
  );
  // 权限、角色 attribute 名称
  permsAttrName = options.permsAttrName || 'z-perms';
  rolesAttrName = options.rolesAttrName || 'z-roles';

  return {
    name: 'vite-plugin-uniapp-perms',
    transform(code, id) {
      // 仅处理 .vue 文件
      if (!filter(id) || !id.endsWith('.vue')) {
        return null;
      }
      // 没有模板，直接返回
      if (!code.includes('<template>')) {
        return null;
      }
      // 处理权限、角色属性
      const MS = new MagicString(code);
      const newPermsCode = transformCode('perms', code);
      const newRolesCode = transformCode('roles', newPermsCode);
      // 替换代码
      MS.replace(MS.toString(), newRolesCode);
      // 如果没有任何改变，则返回 null
      if (MS.hasChanged()) {
        return {
          code: MS.toString(),
          map: MS.generateMap({ hires: true }) // 生成 source map
        };
      }
      return null;
    }
  };
}
