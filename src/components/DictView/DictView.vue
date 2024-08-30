<template>
  <view>
    <view
      v-for="item in dictOptions"
      :key="item.value"
      class="flex items-center"
    >
      <template v-if="values.includes(item.value)">
        <text
          v-if="item.raw.listClass === 'default' || item.raw.listClass === ''"
          :class="item.raw.cssClass"
          >{{ item.label }}</text
        >
        <wd-tag
          v-else
          mark
          :type="item.raw.listClass === 'info' ? 'default' : item.raw.listClass"
          :class="item.raw.cssClass"
          >{{ item.label }}</wd-tag
        >
      </template>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  // 接收的值
  value: {
    type: [String, Number, Array],
    default: ''
  },
  // 选项列表
  options: {
    type: Array,
    default: () => []
  }
});

const values = computed(() => {
  if (props.value !== null && typeof props.value !== 'undefined') {
    return Array.isArray(props.value) ? props.value : [String(props.value)];
  } else {
    return [];
  }
});

const dictOptions = computed(() => {
  return props.options || [];
});
</script>

<style scoped lang="scss"></style>
