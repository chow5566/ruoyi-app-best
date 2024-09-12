import { useUserStore } from '../store/modules/user';

/**
 * 页面跳转验证拦截器
 */
const createRouteInterceptor = () => {
  const userStore = useUserStore();

  // 登录页面
  const loginPage = '/pages/login/index';

  // 页面白名单
  const whitePages = [loginPage];

  // 检查地址白名单
  function checkWhite(url) {
    const path = url.split('?')[0];
    return whitePages.indexOf(path) !== -1;
  }

  // 页面跳转验证拦截器
  let list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];

  list.forEach((item) => {
    uni.addInterceptor(item, {
      invoke(to) {
        if (userStore.token) {
          if (to.path === loginPage) {
            uni.reLaunch({ url: '/' });
          }
          return true;
        } else {
          if (checkWhite(to.url)) {
            return true;
          }
          uni.reLaunch({ url: loginPage });
          return false;
        }
      },
      fail(err) {
        console.error(err);
      }
    });
  });
};

export const routeInterceptor = {
  install() {
    createRouteInterceptor();
  }
};
