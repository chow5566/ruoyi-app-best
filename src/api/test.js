import request from '@/utils/request';

// 操作日志
export function operlogList(params) {
  return request({
    url: '/monitor/operlog/list',
    method: 'get',
    params
  });
}
