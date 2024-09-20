import { createFilter } from 'vite';
import { MagicString } from '@vue/compiler-sfc';

export default function zPermsPlugin(options = {}) {
  const filter = createFilter(options.include, options.exclude);
  const replaceAttrName = options.replaceAttrName || 'z-perms';
  return {
    name: 'vite-plugin-z-perms',

    transform(code, id) {
      // 仅处理 .vue 文件
      if (!filter(id) || !id.endsWith('.vue')) {
        return null;
      }

      const magicString = new MagicString(code);
      const regex = new RegExp(
        `<([a-zA-Z-]+)([^>]*)\\s*${replaceAttrName}="([^"]*)"([^>]*)>`,
        'g'
      );
      let match;

      while ((match = regex.exec(code)) !== null) {
        const fullMatch = match[0]; // 完整的标签
        const tagName = match[1]; // 标签名
        const zPermsValue = match[3]; // z-perms 属性值
        const preAttr = match[2]; // z-perms前边attributes
        const afterAttr = match[4]; // z-perms后边attributes
        const attributes = preAttr + afterAttr; // 标签内的所有attributes

        // 查找 v-if 属性
        const vIfRegex = /v-if="([^"]*)"/g;
        let newAttributes;

        if (vIfRegex.test(attributes)) {
          // 如果有 v-if 属性，合并 z-perms 和 v-if
          newAttributes = attributes.replace(
            vIfRegex,
            (vIfMatch, vIfCondition) => {
              return `v-if="${vIfCondition} && $zx.isHasPermission(${zPermsValue})"`;
            }
          );
        } else {
          // 如果没有 v-if，直接添加 z-perms 权限检查
          newAttributes = attributes.trim()
            ? `${attributes.trim()} v-if="$zx.isHasPermission(${zPermsValue})"`
            : ` v-if="$zx.isHasPermission(${zPermsValue})"`;
        }

        // 替换标签内的内容
        const updatedTag = `<${tagName}${newAttributes}>`; // 确保最后有关闭符号
        magicString.overwrite(
          match.index,
          match.index + fullMatch.length,
          updatedTag
        );
      }
      // 如果没有任何改变，则返回 null
      if (magicString.hasChanged()) {
        return {
          code: magicString.toString(),
          map: magicString.generateMap({ hires: true }) // 生成 source map
        };
      }
      return null;
    }
  };
}
