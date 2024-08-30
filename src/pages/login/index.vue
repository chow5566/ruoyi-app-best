<template>
  <view>
    <view class="login-form px-5 mt-10">
      <wd-form ref="loginFormRef" :model="loginForm" :rules="rules">
        <view class="mb-[16px]">
          <wd-input
            prop="username"
            v-model="loginForm.username"
            size="large"
            placeholder="用户名"
            no-border
            prefix-icon="user"
          ></wd-input>
        </view>
        <view class="mb-[16px]">
          <wd-input
            prop="password"
            v-model="loginForm.password"
            placeholder="密码"
            size="large"
            show-password
            no-border
            prefix-icon="lock-on"
          ></wd-input>
        </view>
        <view class="mb-[16px]" v-if="captchaEnabled">
          <wd-input
            prop="code"
            class="code-input"
            v-model="loginForm.code"
            placeholder="验证码"
            size="large"
            no-border
            :use-suffix-slot="true"
            prefix-icon="chat1"
          >
            <template #suffix>
              <view class="h-[40px] cursor-pointer overflow-hidden">
                <image
                  :src="codeUrl"
                  @click="getCode"
                  class="h-full"
                  mode="heightFix"
                ></image>
              </view>
            </template>
          </wd-input>
        </view>
        <view class="pt-8">
          <wd-button
            type="primary"
            size="large"
            block
            :round="false"
            :loading="btnLoading"
            @click="handleLogin"
            >登录
          </wd-button>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<script setup>
import { getCodeImg } from '../../api/login';
import { message } from '../../utils/common';
import { useUserStore } from '../../store/modules/user';

const captchaEnabled = ref(true); // 验证码开关
const codeUrl = ref(''); // 验证码地址
const loginFormRef = ref(null); // 登录表单ref
const btnLoading = ref(false); // 登录按钮loading

// 登录表单
const loginForm = ref({
  username: 'admin',
  password: 'admin123',
  code: '',
  uuid: ''
});

// 表单验证规则
const rules = ref({
  username: [
    {
      required: true,
      message: '请输入用户名'
    }
  ]
});

// 获取图形验证码
const getCode = () => {
  getCodeImg().then((res) => {
    captchaEnabled.value =
      res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = 'data:image/gif;base64,' + res.img;
      loginForm.value.uuid = res.uuid;
    }
  });
};

// 登录
const handleLogin = () => {
  loginFormRef.value.validate().then(({ valid, errors }) => {
    if (valid) {
      btnLoading.value = true;
      useUserStore()
        .pwdLogin(loginForm.value)
        .then(() => {
          message.toast('登录成功');
          uni.$zx.route('/pages/index/index', {
            type: 'reLaunch'
          });
        })
        .finally(() => {
          btnLoading.value = false;
        });
    } else {
      message.toast(errors[0].message);
    }
  });
};

getCode();
</script>
<style scoped lang="scss">
page {
  background-color: #fff;
}
:deep(.login-form) {
  .wd-input {
    background-color: #f8f8f8;
    border-radius: var(--wot-button-large-radius);
  }
  .code-input {
    padding: 4px 12px;
  }
  .wd-input__error-message {
    display: none !important;
  }
}
</style>
