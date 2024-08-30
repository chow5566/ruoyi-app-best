import errorCode from './errorCode';
import { useUserStore } from '../store/modules/user';
import { message } from './common';
import { queryParams } from './libs/function';

// 超时时间
let timeout = 10000;
// 是否显示未登录提示
let canIShowNoLoginTip = true;

/**
 * 配置根域名，小程序无需代理，H5及其他则要代理
 * @returns String
 */
export const getBaseUrl = () => {
  let baseUrl = import.meta.env.VITE_PROXY_PREFIX;
  // #ifdef MP
  // 小程序环境下，使用真实的API地址
  baseUrl = import.meta.env.VITE_API_BASE_URL;
  // #endif
  // 生产环境下，使用真实的API地址
  if (import.meta.env.PROD) {
    baseUrl = import.meta.env.VITE_API_BASE_URL;
  }
  return baseUrl;
};

/**
 * 请求方法
 * @param config
 * @returns {Promise<unknown>}
 */
export const request = (config) => {
  if (!canIShowNoLoginTip) {
    return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
  }

  config.header = config.header || {};
  const userStore = useUserStore();

  // 添加 token 请求头标识
  if (userStore.token) {
    config.header['Authorization'] = 'Bearer ' + userStore.token;
  }
  // 处理请求参数
  if (config.params) {
    config.url = config.url + queryParams(config.params);
  }
  // 处理自定义参数
  const customize = {
    showError: true, // 是否显示错误信息
    ...config.customize
  };

  return new Promise((resolve, reject) => {
    uni
      .request({
        method: config.method || 'get',
        timeout: config.timeout || timeout,
        url: config.baseUrl || getBaseUrl() + config.url,
        data: config.data,
        header: config.header,
        dataType: 'json'
      })
      .then((response) => {
        let { statusCode, data } = response;
        if (statusCode !== 200) {
          customize.showError && message.toast('后端接口连接异常');
          reject('后端接口连接异常');
          return;
        }
        const code = data.code || 200;
        const msg = errorCode[code] || data.msg || errorCode['default'];
        if (code === 401) {
          if (canIShowNoLoginTip) {
            canIShowNoLoginTip = false;
            message.alert('当前登录状态已失效，请重新登录。').finally(() => {
              userStore.logout().finally(() => {
                canIShowNoLoginTip = true;
              });
            });
            reject('无效的会话，或者会话已过期，请重新登录。');
          }
          reject('无效的会话，或者会话已过期，请重新登录。');
        } else if (code === 500) {
          customize.showError && message.toast(msg);
          reject('500');
        } else if (code !== 200) {
          customize.showError && message.toast(msg);
          reject(code);
        }
        resolve(data);
      })
      .catch((error) => {
        let { message: msg } = error;
        if (msg === 'Network Error') {
          msg = '后端接口连接异常';
        } else if (msg.includes('timeout')) {
          msg = '系统接口请求超时';
        } else if (msg.includes('Request failed with status code')) {
          msg = '系统接口' + msg.substr(msg.length - 3) + '异常';
        }
        customize.showError && message.toast(msg);
        reject(error);
      });
  });
};

export default request;
