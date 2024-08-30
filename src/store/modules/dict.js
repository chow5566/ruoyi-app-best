import { defineStore } from 'pinia';

export const useDictStore = defineStore('dict', {
  state: () => ({
    dictObject: {}
  }),
  getters: {
    // 从 state 中获取字典数据
    getDict(state) {
      return (key) => {
        return state.dictObject[key] || [];
      };
    },
    // 判断字典数据是否已加载
    isDictLoaded(state) {
      return (key) => {
        return Object.prototype.hasOwnProperty.call(state.dictObject, key);
      };
    }
  },
  actions: {
    /**
     * 设置字典数据
     * @param key
     * @param list
     */
    setDict(key, list) {
      if (key && list && Array.isArray(list) && list.length) {
        this.dictObject[key] = list.map((item) => ({
          label: item.dictLabel,
          value: item.dictValue,
          raw: item // 原始数据
        }));
      }
    }
  },
  persist: false
});
