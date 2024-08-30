import autoImport from 'unplugin-auto-import/vite';

export default function createAutoImport() {
  return [
    autoImport({
      imports: ['vue', 'pinia', 'uni-app'],
      dirs: ['src/hooks'], // 自动导入 hooks
      dts: false, // 生成类型声明文件的路径
      vueTemplate: true, // default false
      eslintrc: {
        enabled: false
      }
    })
  ];
}
