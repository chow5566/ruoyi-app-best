import '@/assets/styles/index.scss';
import { createSSRApp } from 'vue';
import App from './App.vue';

import store from './store';
import plugins from './plugins';

export function createApp() {
  const app = createSSRApp(App);

  app.use(store);
  app.use(plugins);

  return {
    app
  };
}
