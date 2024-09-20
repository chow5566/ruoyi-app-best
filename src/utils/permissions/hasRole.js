import { useUserStore } from '../../store/modules/user';

/**
 * 判断用户是否有角色
 * @param {Array} value 权限列表
 * @returns {boolean}
 */
export const isHasRole = (value) => {
  console.log('value', value);
  // 角色为空，则默认无角色
  if (!value || !Array.isArray(value)) {
    return false;
  }
  // 获取用户角色
  const userStore = useUserStore();
  const roles = userStore.roles || [];
  if (!roles.length) {
    return false;
  }
  // 所有超级管理员角色
  const all_role = 'admin';
  // 角色标识符
  const roleFlag = value;
  // 判断用户是否有权限
  return roles.some((role) => {
    return all_role === role || roleFlag.includes(role);
  });
};
