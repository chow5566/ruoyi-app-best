import { printBanner } from './utils/common';
import { loadEnv } from 'vite';
import { startAutomator } from './utils/automator';

/**
 * @file 微信小程序自动化插件
 * @author Chow5566
 * @type {import('vite').Plugin}
 */
export default () => {
  let config;
  let isStarted = false;
  return {
    name: 'vite-plugin-mini-program-automator',
    version: '1.0.0',
    config(config, { mode }) {
      // 打印 Banner
      printBanner();
      // 加载环境变量
      config.viteEnv = loadEnv(mode, process.cwd() + '/env');
      config.isMpWeixin = process.argv.includes('mp-weixin');
    },
    configResolved(resolvedConfig) {
      // 存储最终解析的配置
      config = resolvedConfig;
    },
    buildStart() {},
    // 可用于清理可能正在运行的任何外部服务。Rollup 的 CLI 将确保在每次运行后调用此钩子，但是
    // JavaScript API 的用户有责任在生成产物后手动调用 bundle.close()。因此，任何依赖此功能的
    // 插件都应在其文档中仔细提到这一点。
    buildEnd() {
      if (config.isMpWeixin && !isStarted) {
        // 启动微信开发者工具
        startAutomator(config);
        isStarted = true;
      }
    }
  };
};
