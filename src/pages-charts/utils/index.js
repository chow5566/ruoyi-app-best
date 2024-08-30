// #ifndef MP
import * as echartsForH5 from 'echarts';
// #endif

/**
 * 获取 echarts 对象
 * @description 由于微信小程序不支持动态导入，因此这里直接使用 require 导入 echarts.min.js
 * @mark 小程序echarts.min.js文件不是全量的，如果需要使用完整的echarts功能，
 * 请自行到echarts官网下载完整的echarts.min.js文件并放到分包的static目录下
 * @returns echarts 对象
 */
export const getEcharts = () => {
  let echarts;
  // #ifndef MP
  echarts = echartsForH5;
  // #endif
  // #ifdef MP
  echarts = require('../static/echarts.min.js');
  // #endif
  return echarts;
};
