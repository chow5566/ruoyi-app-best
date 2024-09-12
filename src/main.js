import '@/assets/styles/index.scss';
import { createSSRApp } from 'vue';
import App from './App.vue';

import store from './store';
import plugins from './plugins';
import { routeInterceptor } from './interceptors/route';

export function createApp() {
  const app = createSSRApp(App);

  // 注册 store
  app.use(store);
  // 注册插件
  app.use(plugins);
  // 注册路由拦截器
  app.use(routeInterceptor);

  return {
    app
  };
}
