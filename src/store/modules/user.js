import { defineStore } from 'pinia';
import { getInfo, login, logout } from '../../api/login';
import route from '@/utils/route';
import { useDictStore } from './dict';

/**
 * User store
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    // 登录用户token
    token: null,
    // 登录用户信息
    userInfo: null,
    // 用户权限列表
    permissions: [],
    // 用户角色列表
    roles: []
  }),
  getters: {},
  actions: {
    /** 密码登录 */
    pwdLogin(params) {
      const { username, password, code, uuid } = params;
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid)
          .then(async (res) => {
            this.token = res.token;
            await this.getUserInfo();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    /** 获取用户信息 */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            this.userInfo = res.user || null; // 用户信息
            this.permissions = res.permissions || []; // 用户权限列表
            this.roles = res.roles || []; // 用户角色列表
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    /**
     * 退出登录
     * @param init 是否需要调用接口清除用户信息
     */
    logout(init = false) {
      return new Promise((resolve, reject) => {
        const clear = () => {
          this.token = null;
          this.userInfo = null;
          this.permissions = [];
          this.roles = [];
          const dictStore = useDictStore();
          dictStore.$reset();
          route({
            url: '/pages/login/index',
            type: 'reLaunch'
          })
            .then(() => {
              resolve();
            })
            .finally(() => {
              reject();
            });
        };
        if (init) {
          logout().finally(() => {
            clear();
          });
        } else {
          clear();
        }
      });
    }
  },
  persist: true // persist the state in local storage
});
