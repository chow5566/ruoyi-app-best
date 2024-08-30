<template>
  <view style="width: 750rpx; height: 750rpx"
    ><LChart ref="chartRef"></LChart
  ></view>
</template>

<script setup>
import LChart from './components/l-echart/l-echart.vue';
import { getEcharts } from './utils';

const chartRef = ref(null);
const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    confine: true
  },
  legend: {
    data: ['热度', '正面', '负面']
  },
  grid: {
    left: 20,
    right: 20,
    bottom: 15,
    top: 40,
    containLabel: true
  },
  xAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#999999'
        }
      },
      axisLabel: {
        color: '#666666'
      }
    }
  ],
  yAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: [
        '汽车之家',
        '今日头条',
        '百度贴吧',
        '一点资讯',
        '微信',
        '微博',
        '知乎'
      ],
      axisLine: {
        lineStyle: {
          color: '#999999'
        }
      },
      axisLabel: {
        color: '#666666'
      }
    }
  ],
  series: [
    {
      name: '热度',
      type: 'bar',
      label: {
        show: true,
        position: 'inside'
      },
      data: [300, 270, 340, 344, 300, 320, 310]
    },
    {
      name: '正面',
      type: 'bar',
      stack: '总量',
      label: {
        show: true
      },
      data: [120, 102, 141, 174, 190, 250, 220]
    },
    {
      name: '负面',
      type: 'bar',
      stack: '总量',
      label: {
        show: true,
        position: 'left'
      },
      data: [-20, -32, -21, -34, -90, -130, -110]
    }
  ]
};

onMounted(() => {
  // 组件能被调用必须是组件的节点已经被渲染到页面上
  setTimeout(() => {
    if (!chartRef.value) return;
    chartRef.value.init(getEcharts(), (c) => {
      c.setOption(option);
    });
  }, 300);
});
</script>
