<template>
  <view>
    <view>点击下方色块切换主题</view>
    <view class="flex justify-between p-[30px]">
      <view
        class="theme-box"
        v-for="color in colors"
        :key="color"
        :style="{ backgroundColor: color }"
        @click="changeTheme(color)"
      >
      </view>
    </view>
    <wd-button type="primary">示例</wd-button>
  </view>
</template>

<script setup>
import { useThemeStore } from '../../store/modules/theme';

const colors = ['#8268de', '#34d19d', '#2bb3ed'];
const themeStore = useThemeStore();
const changeTheme = (color) => {
  themeStore.themeVars.colorTheme = color;
};
</script>

<style scoped lang="scss">
.theme-box {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
