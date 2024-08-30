import route from '../utils/route';
import { message } from '@/utils/common';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入本地化语言

dayjs.locale('zh-cn'); // 使用本地化语言

/**
 * @description 插件对象
 * @type {{route: ((function({}=, {}=): Promise<void>)|*)}}
 */
const $zx = {
  route,
  message,
  moment: dayjs.default
};

export default {
  install: (app, options) => {
    // 将$zx对象分别挂载到uni及Vue实例上
    uni.$zx = $zx;
    app.config.globalProperties.$zx = $zx;
    // 挂载分页配置
    uni.$zp = {
      config: {
        //配置分页默认pageSize为15
        'default-page-size': '15',
        //配置空数据图默认描述文字为：空空如也~~
        'empty-view-text': '空空如也~~'
        //...
      }
    };
  }
};
