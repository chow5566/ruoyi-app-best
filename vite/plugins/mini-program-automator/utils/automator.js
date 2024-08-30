import * as automator from 'miniprogram-automator';

export const startAutomator = async (config) => {
  try {
    console.log('\x1b[44m%s\x1b[0m', '编译完成，正在启动微信开发者工具...');
    await automator.launch({
      // 工具 cli 位置，如果你没有更改过默认安装位置，可以忽略此项
      cliPath: config.viteEnv.VITE_API_WECHAT_IDEA_CLI_PATH,
      // 项目文件地址
      projectPath:
        config.viteEnv.VITE_USER_NODE_ENV === 'development'
          ? config.viteEnv.VITE_API_WECHAT_DEV_APP_PATH
          : config.viteEnv.VITE_API_WECHAT_BUILD_APP_PATH
    });
    console.log(
      '\x1b[42m%s\x1b[0m',
      '微信开发者工具启动成功，请前往微信开发者工具中查看。'
    );
  } catch (error) {
    console.log(
      '\x1b[43m%s\x1b[0m',
      '微信开发者工具启动失败，请确保在.env 文件中配置了正确的微信开发者工具路径、项目路径。\n' +
        '错误详情：' +
        error
    );
  }
};
