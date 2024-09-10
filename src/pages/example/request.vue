<template>
  <view>
    <view class="flex px-[10px] pt-[20px] justify-center items-center">
      <wd-button type="primary" :loading="loading" @click="getUserInfo"
        >获取用户数据</wd-button
      >
    </view>

    <view class="mt-5 p-[10px] bg-white" v-if="userInfo">{{ userInfo }}</view>
  </view>
</template>

<script setup>
import { getInfo } from '../../api/login';

const userInfo = ref(null);
const loading = ref(false);

const getUserInfo = () => {
  userInfo.value = null;
  loading.value = true;
  getInfo()
    .then((res) => {
      userInfo.value = res.user;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped lang="scss"></style>
