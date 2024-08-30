import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const pinia = createPinia();

/**
 * Use the createPersistedState plugin to persist the state in the local storage
 * of the uni-app.
 */
pinia.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync
    }
  })
);

export default pinia;
