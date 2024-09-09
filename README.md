# RuoyiAppBest是什么？

RuoyiAppBest是基于[若依管理系统](https://ruoyi.vip/)最好的[uniapp](https://zh.uniapp.dcloud.io)开发框架。

由`uniapp` + `Vue3` + `Vite4` + `Tailwind CSS` + [`Wot Design Uni`](https://wot-design-uni.pages.dev/)
构建，集成了多种工具和技术，使用了最新的前端技术栈，无需依靠`HBuilderX`，
通过命令行方式即可运行`web`、`小程序` 和 `App`（注：`App`还是需要 `HBuilderX`）。

RuoyiAppBest内置了请求封装、Tailwind CSS、字典翻译、ECharts图表等基础功能，提供了代码提示、
自动格式化、统一配置等辅助功能，让你编写若依移动端拥有best体验（RuoyiAppBest的由来）。

## 文档
[查看文档](https://chow5566.github.io/ruoyi-app-best-doc)

## 预览H5效果

[H5预览效果](https://chow5566.github.io/ruoyi-app-best)

## 生成过程

RuoyiAppBest 由最初始的官方 cli 脚手架模板生成，执行的命令如下：
``` js
npx degit dcloudio/uni-preset-vue#vite my-vue3-project
```
uniapp 官方链接：[点击跳转 - quickstart-cli](https://uniapp.dcloud.net.cn/quickstart-cli.html)

在官方生成的项目基础上，增加了如下内容：

- 集成 `Wot Design Uni` 组件库，提供丰富的基础组件和功能组件
- 集成 `Tailwind CSS` 样式库，提供统一的样式风格
- 集成 `pinia` + `pinia-plugin-persistedstate`，实现状态管理
- 集成 `ECharts` 图表库，提供丰富的图表组件
- 请求封装，统一管理请求接口
- 封装字典翻译，统一管理字典数据

还有更多功能，不再一一列举。
