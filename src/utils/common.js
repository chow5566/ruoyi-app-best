import { useThemeStore } from '../store/modules/theme';

const _options = (options) => {
  return {
    confirmColor: useThemeStore().themeVars.colorTheme,
    ...(options || {})
  };
};

export const message = {
  /**
   * 弹出确认框
   * @param content
   * @param title
   * @param options
   * @returns {Promise<unknown>}
   */
  confirm: (content, title = '提示', options = {}) => {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: title || '提示',
        content: content || '确认执行该操作吗？',
        showCancel: true,
        ..._options(options),
        success: (res) => {
          if (res.confirm) {
            resolve();
          }
          reject();
        },
        fail: (res) => {
          reject(res);
        }
      });
    });
  },

  /**
   * 弹出提示框
   * @param content
   * @param title
   * @param options
   * @returns {Promise<*>}
   */
  alert: function (content, title = '提示', options = {}) {
    options = _options(options);
    return this.confirm(content, title, {
      confirmText: '我知道了',
      ...options,
      showCancel: false
    });
  },

  /**
   * 弹出toast提示
   * @param message
   * @returns {Promise<unknown>}
   */
  toast: (message) => {
    return uni.showToast({
      title: message || '',
      icon: 'none'
    });
  }
};
