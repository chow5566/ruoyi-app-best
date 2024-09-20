<template>
  <view class="content">
    <view class="bg-white px-[16px] py-[20px]">
      <view class="primary-color text-lg mb-[10px]">Ruoyi App Best</view>
      <view class="text-gray-500 text-sm"
        >Ruoyi App Best 是最好的 Ruoyi 系统移动端 Uniapp 开发框架，由 uniapp +
        Vue3 + Vite4 + TailwindCSS + uni插件 +
        wot-ui构建，集成了多种工具和技术，使用了最新的前端技术栈，无需依靠
        HBuilderX，通过命令行方式即可运行 web、小程序 和 App</view
      >
    </view>
    <image
      z-perms="['aaa']"
      src="https://img.yzcdn.cn/public_files/2021/08/17/f7a7d9d5c7d5d5.png"
      v-if="123"
      mode="widthFix"
    />
    <view
      z-perms="['ccc']"
      z-roles="['admin1']"
      class="px-[16px] py-[20px]"
      v-if="123"
      >{{ $zx.moment().format('YYYY-MM-DD HH:mm:ss') }}123</view
    >
    <view
      v-if="123"
      z-perms="['dssd']"
      z-roles="['admin1']"
      class="px-[16px] py-[20px]"
      >{{ $zx.moment().format('dddd, MMMM Do YYYY, h:mm:ss a') }}</view
    >
    <view class="mt-5 px-[16px]">
      <view
        class="flex bg-white py-5 px-3 rounded-[8px] items-center mb-[10px]"
        hover-class="bg-gray-100"
        @click="$zx.route('/pages/example/theme')"
      >
        <view class="flex-1 text-gray-700 text-md">切换主题</view>
        <wd-icon name="arrow-right" size="18px" color="#666"></wd-icon>
      </view>
      <view
        class="flex bg-white py-5 px-3 rounded-[8px] items-center mb-[10px]"
        hover-class="bg-gray-100"
        @click="$zx.route('/pages/login/index')"
      >
        <view class="flex-1 text-gray-700 text-md">登录示例</view>
        <wd-icon name="arrow-right" size="18px" color="#666"></wd-icon>
      </view>
      <view
        class="flex bg-white py-5 px-3 rounded-[8px] items-center mb-[10px]"
        hover-class="bg-gray-100"
        @click="$zx.route('/pages/example/request')"
      >
        <view class="flex-1 text-gray-700 text-md">请求示例</view>
        <wd-icon name="arrow-right" size="18px" color="#666"></wd-icon>
      </view>
      <view
        class="flex bg-white py-5 px-3 rounded-[8px] items-center mb-[10px]"
        hover-class="bg-gray-100"
        @click="$zx.route('/pages/example/dict')"
      >
        <view class="flex-1 text-gray-700 text-md">字典示例</view>
        <wd-icon name="arrow-right" size="18px" color="#666"></wd-icon>
      </view>
      <view
        class="flex bg-white py-5 px-3 rounded-[8px] items-center mb-[10px]"
        hover-class="bg-gray-100"
        @click="$zx.route('/pages/example/paging')"
      >
        <view class="flex-1 text-gray-700 text-md">z-paging示例</view>
        <wd-icon name="arrow-right" size="18px" color="#666"></wd-icon>
      </view>
      <view
        class="flex bg-white py-5 px-3 rounded-[8px] items-center mb-[10px]"
        hover-class="bg-gray-100"
        @click="$zx.route('/pages-charts/index')"
      >
        <view class="flex-1 text-gray-700 text-md">分包/图表测试</view>
        <wd-icon name="arrow-right" size="18px" color="#666"></wd-icon>
      </view>
    </view>
  </view>
</template>

<script setup></script>

<style></style>
