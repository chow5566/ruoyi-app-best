<template>
  <view>
    <ZxPaging ref="zPaging" v-model="pageList" @query="getList">
      <template #top>
        <wd-search
          v-model="queryForm.title"
          hide-cancel
          @blur="handleQuery"
          @search="handleQuery"
          @clear="handleQuery"
          maxlength="10"
        />
      </template>
      <view class="p-[10px]">
        <view
          v-for="item in pageList"
          :key="item.dictId"
          class="bg-white p-[10px] rounded-[4px] mt-[10px]"
        >
          <view class="flex w-full">
            <view class="flex-1">{{ item.operId }}：{{ item.title }}</view>
            <DictView
              :options="dict.sys_oper_type"
              :value="item.businessType"
            />
            <DictView :options="dict.sys_common_status" :value="item.status" />
          </view>
          <view>
            <view>{{ item.operName || '未知用户' }}</view>
          </view>
        </view>
      </view>
    </ZxPaging>
  </view>
</template>

<script setup>
import { useDict } from '../../composables/dict';
import { operlogList } from '../../api/test';

// 分页组件
const zPaging = ref(null);
// 搜索条件
const queryForm = ref({
  title: '' // 系统模块
});
// 列表数据
const pageList = ref([]);
// 查询列表
const getList = (pageNum, pageSize) => {
  operlogList({
    ...queryForm.value,
    pageNum,
    pageSize
  }).then((res) => {
    zPaging.value.complete(res.rows);
  });
};

const handleQuery = () => {
  zPaging.value.reload(true);
};

const dict = useDict(['sys_common_status', 'sys_oper_type']);
</script>

<style scoped lang="scss"></style>
