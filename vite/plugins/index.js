import uni from '@dcloudio/vite-plugin-uni';
import uniTailwind from '@uni-helper/vite-plugin-uni-tailwind';
import createAutoImport from './auto-import';
import createSetupExtend from './setup-extend';
import UniKuRoot from './ku-root/index.mjs';
import miniProgramAutomator from './mini-program-automator';

export default function createVitePlugins() {
  const vitePlugins = [
    // 若存在改变 pages.json 的插件，请将 UniKuRoot 放置其后
    UniKuRoot({
      enabledGlobalRef: true
    }),
    uni(),
    // 引入uni-tailwind插件
    uniTailwind(),
    // 微信开发者工具自动化脚本插件
    miniProgramAutomator()
  ];
  vitePlugins.push(createSetupExtend());
  vitePlugins.push(...createAutoImport());
  return vitePlugins;
}
