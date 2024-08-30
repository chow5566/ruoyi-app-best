import { defineStore } from 'pinia';

/**
 * 主题模块
 */
export const useThemeStore = defineStore('theme', {
  state: () => ({
    // 主题风格，设置为 dark 来开启深色模式，全局生效
    theme: 'light',
    // 自定义主题变量，全局生效
    themeVars: {
      colorTheme: '#6C63FF',
      colorSuccess: '#34d19d',
      colorWarning: '#f0883a',
      colorDanger: '#fa4350',
      colorPurple: '#8268de',
      colorYellow: '#f0cd1d',
      colorBlue: '#2bb3ed',
      colorInfo: '#909399',
      buttonRadius: '6px',
      buttonLargeRadius: '8px',
      buttonLargeHeight: '48px'
    }
  }),
  getters: {},
  actions: {},
  persist: true // persist the state in local storage
});
