import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';


export default [
  { files: ['**/*.{js,mjs,cjs,vue,ts,tsx}'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        $t: true,
        uni: true,
        UniApp: true,
        wx: true,
        WechatMiniprogram: true,
        getCurrentPages: true,
        UniHelper: true,
        Page: true,
        App: true,
        NodeJS: true,
      }
    }
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
  ...pluginVue.configs['flat/essential'],
  eslintConfigPrettier,
  {
    rules: {
      // 开启 prettier 自动修复的功能
      'prettier/prettier': 'error',
      // turn on errors for missing imports
      'import/no-unresolved': 'off',
      // 只允许1个默认导出，关闭，否则不能随意export xxx
      'import/prefer-default-export': ['off'],
      'no-console': ['off'],
      // 'no-unused-vars': ['off'],
      // '@typescript-eslint/no-unused-vars': ['off'],
      // 解决vite.config.ts报错问题
      'import/no-extraneous-dependencies': 'off',
      'no-plusplus': 'off',
      'no-shadow': 'off',
      'vue/multi-word-component-names': 'off',
      'no-underscore-dangle': 'off',
      'no-use-before-define': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-param-reassign': 'off',
      // 避免 `eslint` 对于 `typescript` 函数重载的误报
      'no-redeclare': 'off',
      'vue/no-use-v-if-with-v-for': 'off',
    },
  }
];
