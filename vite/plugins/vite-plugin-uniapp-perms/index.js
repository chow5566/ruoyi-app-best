import { createFilter } from 'vite';
import { MagicString } from '@vue/compiler-sfc';

export default function zPermsPlugin(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'vite-plugin-z-perms',

    transform(code, id) {
      // 仅处理 .vue 文件
      if (!filter(id) || !id.endsWith('.vue')) {
        return null;
      }

      // 没有template标签，则不处理
      if (!code.includes('<template>')) {
        return null;
      }

      const magicString = new MagicString(code);
      const regex = /<([a-zA-Z-]+)([^>]*)\s*z-perms="([^"]*)"/g;
      let match;

      while ((match = regex.exec(code)) !== null) {
        const fullMatch = match[0]; // 完整的标签
        const tagName = match[1]; // 标签名
        const attributes = match[2]; // 标签属性
        const zPermsValue = match[3]; // z-perms 属性值

        // 查找 v-if 属性
        const vIfRegex = /v-if="([^"]*)"/;
        const hasVIf = vIfRegex.test(attributes);
        let newAttributes;

        if (hasVIf) {
          // 合并 z-perms 和 v-if
          newAttributes = attributes.replace(
            vIfRegex,
            (vIfMatch, vIfCondition) => {
              return `v-if="${vIfCondition} && $zx.isHasPermission(${zPermsValue})"`;
            }
          );
        } else {
          // 转换 z-perms 为 v-if
          newAttributes = attributes.trim()
            ? attributes + `v-if="$zx.isHasPermission(${zPermsValue})"`
            : ` v-if="$zx.isHasPermission(${zPermsValue})"`;
        }

        // 替换标签内的内容
        const updatedTag = `<${tagName}${newAttributes}`;
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
