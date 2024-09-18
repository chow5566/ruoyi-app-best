import { createFilter } from 'vite';
import { MagicString, parse } from '@vue/compiler-sfc';

export default function transformDirectivePlugin(options = {}) {
  const directivePermissionName = 'z-perms'; // 定义指令名称
  // 创建文件过滤器
  const filter = createFilter(
    options.include || ['src/**/*.vue'],
    options.exclude || [/node_modules/, /uni_modules/]
  );

  return {
    name: 'vite-plugin-transform-directives',

    async transform(code, id) {
      // 过滤掉非.vue 文件
      if (!filter(id)) return;

      const ms = new MagicString(code); // 创建 MagicString 实例
      const msStr = ms.toString(); // 获取 MagicString 字符串
      // 从 MagicString 中检查模板内容是否存在
      const templateMatch = msStr.match(/<template>([\s\S]*?)<\/template>/);
      if (!templateMatch) return; // 如果没有找到模板内容，直接返回

      // 定义用于匹配 权限数组 的正则表达式
      const directiveRegex = new RegExp(
        `${directivePermissionName}="(.*?)"`,
        'g'
      );
      const ifRegex = /v-if="(.*?)"/g; // 定义用于匹配 v-if 的正则表达式

      let match;
      while ((match = directiveRegex.exec(msStr)) !== null) {
        const permissionList = match[1]; // 获取权限数组
        const directiveStart = match.index; // 获取 权限标识符 的开始位置
        const directiveEnd = directiveRegex.lastIndex; // 获取 权限标识符 的结束位置

        // 获取当前元素的 v-if 条件
        ifRegex.lastIndex = 0; // 重置 ifRegex 的 lastIndex
        const vIfMatch = ifRegex.exec(msStr);

        const vIfCondition = vIfMatch ? vIfMatch[1] : 'true'; // 如果找到 v-if 条件，使用它，否则默认为 true
        const vIfStart = vIfMatch ? vIfMatch.index : -1; // v-if 条件开始位置
        const vIfEnd = vIfMatch ? vIfStart + vIfMatch[0].length : -1; // v-if 条件结束位置

        // 合并权限条件与 v-if 条件
        const combinedCondition = `$zx.isHasPermission(${permissionList}) && (${vIfCondition})`;

        // 移除原先的 v-if （如果存在）
        if (vIfStart !== -1) {
          ms.remove(vIfStart, vIfEnd);
        }

        // 更新 MagicString 对象，将新的 v-if 插入
        ms.update(directiveStart, directiveEnd, `v-if="${combinedCondition}"`);
      }
      // 返回处理后的代码
      return {
        code: ms.toString(),
        map: ms.generateMap({ hires: true }) // 生成源映射
      };
    }
  };
}
