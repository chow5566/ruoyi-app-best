<template>
  <wd-config-provider
    :theme="themeStore.theme"
    :theme-vars="themeStore.themeVars"
  >
    <!-- 添加根组件 -->
    <KuRootView />
    <!-- 全局添加toast组件2 -->
    <wd-toast />
    <!-- 全局添加message-box组件 -->
    <wd-message-box></wd-message-box>
  </wd-config-provider>
</template>

<script setup>
import { useThemeStore } from './store/modules/theme';

const themeStore = useThemeStore();
</script>
