<template>
  <view>
    <wd-select-picker
      label="基本用法"
      type="radio"
      v-model="status"
      :columns="dict.sys_common_status"
    ></wd-select-picker>
    <wd-input
      label="普通翻译"
      v-model="useSelectDictLabel('sys_common_status', status).value"
      readonly
    ></wd-input>
    <wd-input
      label="动态翻译"
      v-model="dynamicTranslation"
      readonly
      placeholder="请选择上方一个选项"
    ></wd-input>
    <wd-input label="字典标签" readonly placeholder="">
      <template #suffix>
        <DictView :options="dict.sys_common_status" :value="status"></DictView>
      </template>
    </wd-input>
    <wd-input label="字典标签多个" readonly placeholder="">
      <template #suffix>
        <view class="w-full">
          <DictView
            :options="dict.sys_common_status"
            :value="['0', '1']"
          ></DictView>
        </view>
      </template>
    </wd-input>
  </view>
</template>

<script setup>
import { useDict, useSelectDictLabel } from '../../composables/dict';

const status = ref('');
const dict = useDict(['sys_common_status', 'sys_common_status']);
const dynamicTranslation = useSelectDictLabel('sys_common_status', status);
</script>

<style scoped lang="scss"></style>
