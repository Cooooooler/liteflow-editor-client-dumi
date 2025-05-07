# liteflow-editor-client

[![NPM version](https://img.shields.io/npm/v/liteflow-editor-client.svg?style=flat)](https://npmjs.org/package/liteflow-editor-client)
[![NPM downloads](http://img.shields.io/npm/dm/liteflow-editor-client.svg?style=flat)](https://npmjs.org/package/liteflow-editor-client)

🎨 **liteflow-editor-client** 是一款用于可视化编辑 LiteFlow EL 表达式的组件库，帮助你更直观地设计、配置和管理工作流规则。

---

## ✨ 特性

- 🧩 拖拽式表达式编辑体验，所见即所得
- ⚙️ 支持复杂嵌套逻辑、变量引用、函数调用等表达式配置
- 📦 组件封装灵活，易于集成到任意 React 项目中
- 🔌 支持扩展插件机制，定制你的表达式构建逻辑

---

## 📦 安装

使用 npm，yarn 或者 pnpm 安装：

```bash
npm install liteflow-editor-client
yarn add liteflow-editor-client
# 或者
pnpm i liteflow-editor-client
```

---

## 🚀 快速开始

```tsx
import { LiteFlowEditor, requestController } from 'liteflow-editor-client';
import React, { FC } from 'react';

const Authorization = 'token:8f6dd867e9434612bbeda04b53cc290f';

const getChainPage = (data?: any) => {
  return requestController('/lon/api/v2/aiqa/mgr/liteflowChain/getPage', {
    method: 'POST',
    data: data ?? {},
    headers: {
      Authorization,
    },
  });
};

const getCmpList = (params?: any) => {
  return requestController('/lon/api/v2/aiqa/chat/cmpManager/getCmpList', {
    method: 'GET',
    params,
    headers: {
      Authorization,
    },
  });
};

const getChainById = (data?: any) => {
  return requestController(
    '/lon/api/v2/aiqa/mgr/liteflowChain/getLiteflowChain',
    {
      method: 'POST',
      data: data ?? {},
      headers: {
        Authorization,
      },
    },
  );
};

const addChain = (data?: any) => {
  return requestController(
    '/lon/api/v2/aiqa/mgr/liteflowChain/addLiteflowChain',
    {
      method: 'POST',
      data: data ?? {},
      headers: {
        Authorization,
      },
    },
  );
};

const updateChain = (data?: any) => {
  return requestController(
    '/lon/api/v2/aiqa/mgr/liteflowChain/updateLiteflowChain',
    {
      method: 'POST',
      data: data ?? {},
      headers: {
        Authorization,
      },
    },
  );
};

const deleteChain = (data?: any) => {
  return requestController(
    '/lon/api/v2/aiqa/mgr/liteflowChain/deleteLiteflowChain',
    {
      method: 'POST',
      data: data ?? {},
      headers: {
        Authorization,
      },
    },
  );
};

const Demo: FC = () => (
  <LiteFlowEditor
    style={{
      height: '800px',
    }}
    getCmpList={getCmpList}
    getChainPage={getChainPage}
    getChainById={getChainById}
    addChain={addChain}
    updateChain={updateChain}
    deleteChain={deleteChain}
  />
);

export default Demo;
```

---

## ⚙️ Props 说明

| Prop           | 类型                             | 必填 | 描述                       |
| -------------- | -------------------------------- | ---- | -------------------------- |
| `style`        | `CSSProperties`                  | 否   | 编辑器容器的样式           |
| `className`    | `string`                         | 否   | 编辑器容器的样式           |
| `getCmpList`   | `(params?: any) => Promise<any>` | 否   | 获取标签列表的接口         |
| `getChainPage` | `(data?: any) => Promise<any>`   | 否   | 获取链路分页数据的接口     |
| `getChainById` | `(data?: any) => Promise<any>`   | 否   | 根据 ID 获取链路详情的接口 |
| `addChain`     | `(data?: any) => Promise<any>`   | 否   | 添加链路的接口             |
| `updateChain`  | `(data?: any) => Promise<any>`   | 否   | 更新链路的接口             |
| `deleteChain`  | `(data?: any) => Promise<any>`   | 否   | 删除链路的接口             |

## 特别注意 ⚠️

必须在样式中指定高度

## 📚 示例与文档

更多用法和在线示例，请查看文档站点：[📘 查看文档](https://github.com/Cooooooler/liteflow-editor-client-dumi/blob/master/docs/guide.md)

---

## 🛠 本地开发

```bash
# 克隆项目
git clone https://github.com/Cooooooler/liteflow-editor-client-dumi.git
cd liteflow-editor-client-dumi

# 安装依赖
pnpm install

# 启动开发环境
pnpm dev
```

---

## 📄 License

[MIT](./LICENSE)

---

## 🙌 致谢

由于原项目有性能问题，接口深度融合问题以及依赖版本较老并没有升级，本项目解决了这些问题并优化了操作。
[项目来源](https://gitee.com/imwangshijiang/liteflow-editor-client)
本项目受到 [X6](https://x6.antv.antgroup.com/) 和 [Monaco Editor](https://microsoft.github.io/monaco-editor/) 的启发和支持。
