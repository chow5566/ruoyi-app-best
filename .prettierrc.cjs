module.exports = {
  printWidth: 80, // 一行最多80个字符
  tabWidth: 2, // 设置工具每一个水平缩进的空格数
  useTabs: false, //不使用缩进,而使用空格
  semi: true, // 句末是否加分号
  vueIndentScriptAndStyle: false, //Vue文件中＜script＞和＜style＞是否缩进
  singleQuote: true, // 用单引号
  trailingComma: 'none', // 最后一个对象元素符加逗号
  bracketSpacing: true, // 箭头函数,只有一个参数的时候,也需要括号
  arrowParens: 'always', // 不需要写文件开头的 @prettier
  insertPragma: false, // 不需要自动在文件开头加入 @prettier
  endOfLine: 'auto' // 换行符使用 auto
};
