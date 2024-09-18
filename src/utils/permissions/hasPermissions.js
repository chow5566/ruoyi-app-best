import { useUserStore } from '../../store/modules/user';

/**
 * 判断用户是否有权限
 * @param {Array} value 权限列表
 * @returns {boolean}
 */
export const isHasPermission = (value) => {
  console.log(value, 'value');
  // 权限为空，则默认无权限
  if (!value || !Array.isArray(value) || value.length === 0) {
    return false;
  }
  // 获取用户权限
  const userStore = useUserStore();
  const permissions = userStore.permissions || [];
  if (!permissions || permissions.length === 0) {
    return false;
  }
  // 所有权限标识符
  const all_permission = '*:*:*';
  // 权限标识符
  const permissionFlag = value;
  // 判断用户是否有权限
  return permissions.some((permission) => {
    return all_permission === permission || permissionFlag.includes(permission);
  });
};
