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
import {
  Chain,
  LiteFlowEditor,
  LiteFlowEditorRef,
} from 'liteflow-editor-client';
import {
  ConditionTypeList,
  NodeTypeList,
} from 'liteflow-editor-client/LiteFlowEditor/constant';
import { safeParse } from 'liteflow-editor-client/LiteFlowEditor/utils';
import React, { FC, useRef } from 'react';

// request_controller.ts
import { message } from 'antd';
import { extend } from 'umi-request';

message.config({
  maxCount: 1,
  rtl: true,
});

const statusMapHandle = new Map([
  [200, () => {}],
  [400, () => {}],
  [401, () => {}],
  [
    403,
    () => {
      message.error('登录超时, 请重新登录');
    },
  ],
  [404, () => {}],
  [500, () => {}],
  [502, () => {}],
  [503, () => {}],
  [504, () => {}],
]);

// 创建一个 umi-request 实例
const requestController = extend({
  // prefix: 'api', // 统一的请求前缀
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
  errorHandler: (error) => {
    // 统一的错误处理
    const { response } = error;

    if (response && response.status) {
    } else if (!response) {
    }

    return Promise.reject(error);
  },
});

// 添加请求拦截器
requestController.interceptors.request.use((url, options) => {
  // 可以在这里添加统一的请求头，例如 token
  const token = localStorage.getItem('authToken');

  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', token);
  }

  return { url, options };
});

// 添加响应拦截器
requestController.interceptors.response.use((response) => {
  // 可以在这里处理统一的响应，例如错误提示
  statusMapHandle.get(response.status)?.();
  return response;
});

const Demo: FC = () => {
  const ref = useRef<LiteFlowEditorRef>(null);

  const Authorization = 'token:8d2cd444d2124a668d1d23109ce6b06c';

  const getChainPage = async (data: undefined) => {
    const res = await requestController(
      '/lon/api/v2/aiqa/mgr/liteflowChain/getPage',
      {
        method: 'POST',
        data: data ?? {},
        headers: {
          Authorization,
        },
      },
    );

    if (res.data && ref.current) {
      const { data: chains = [] } = res.data;
      ref.current.state.chains = chains;
      ref.current.state.status = 'success';
    }
  };

  const getCmpList = async (params: {
    type: ConditionTypeList | NodeTypeList;
  }) => {
    const res = await requestController(
      '/lon/api/v2/aiqa/chat/cmpManager/getCmpList',
      {
        method: 'GET',
        params,
        headers: {
          Authorization,
        },
      },
    );

    if (res.data && ref.current) {
      const { data: cmpList = [] } = res;
      ref.current.state.cmpList = cmpList;
    }
  };

  const getChainById = async (data?: { id: number }) => {
    const res = await requestController(
      '/lon/api/v2/aiqa/mgr/liteflowChain/getLiteflowChain',
      {
        method: 'POST',
        data: data ?? {},
        headers: {
          Authorization,
        },
      },
    );
    if (res.data?.chainDsl) {
      // 安全的处理JSON字符串
      return safeParse(res.data?.chainDsl);
    } else {
      return {};
    }
  };

  const addChain = async (data: { chainName: string; chainDesc: string }) => {
    const res = await requestController(
      '/lon/api/v2/aiqa/mgr/liteflowChain/addLiteflowChain',
      {
        method: 'POST',
        data: data,
        headers: {
          Authorization,
        },
      },
    );
    if (res) {
      return true;
    } else {
      return false;
    }
  };

  const updateChain = async (
    data: Chain | { chainDsl: string; elData: string },
  ) => {
    const res = await requestController(
      '/lon/api/v2/aiqa/mgr/liteflowChain/updateLiteflowChain',
      {
        method: 'POST',
        data: data ?? {},
        headers: {
          Authorization,
        },
      },
    );
    if (res) {
      return true;
    } else {
      return false;
    }
  };

  const deleteChain = async (data?: { ids: number[] }) => {
    const res = await requestController(
      '/lon/api/v2/aiqa/mgr/liteflowChain/deleteLiteflowChain',
      {
        method: 'POST',
        data: data ?? {},
        headers: {
          Authorization,
        },
      },
    );
    if (res) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <LiteFlowEditor
      ref={ref}
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
};

export default Demo;
```

---

## ⚙️ Props 说明

| Prop           | 类型                                                                     | 必填 | 描述                       |
| -------------- | ------------------------------------------------------------------------ | ---- | -------------------------- |
| `style`        | `CSSProperties`                                                          | 否   | 编辑器容器的样式           |
| `className`    | `string`                                                                 | 否   | 编辑器容器的样式           |
| `getCmpList`   | `(data: undefined) => Promise<void>`                                     | 否   | 获取标签列表的接口         |
| `getChainPage` | `(params: {type: ConditionTypeList \| NodeTypeList}) => Promise<void>`   | 否   | 获取链路分页数据的接口     |
| `getChainById` | `(data?: {id: number}) => Promise<any>`                                  | 否   | 根据 ID 获取链路详情的接口 |
| `addChain`     | `(data: {chainName: string;chainDesc: string}) => Promise<boolean>`      | 否   | 添加链路的接口             |
| `updateChain`  | `(data: Chain \| {chainDsl: string;elData: string}) => Promise<boolean>` | 否   | 更新链路的接口             |
| `deleteChain`  | `(data?: {ids: number[]}) => Promise<boolean>`                           | 否   | 删除链路的接口             |

## ⚙️ ref 说明

`LiteFlowEditor` 组件支持通过 `ref` 获取内部方法和状态，引用类型为 `LiteFlowEditorRef`：

| 属性名               | 类型                                                  | 描述                                     |
| -------------------- | ----------------------------------------------------- | ---------------------------------------- |
| `getGraphInstance()` | `() => Graph \| undefined`                            | 获取内部 X6 图实例，用于操作流程图       |
| `toJSON()`           | `() => Record<string, any>`                           | 获取当前编辑器的 JSON 表达形式           |
| `fromJSON(data)`     | `(data: Record<string, any>) => void`                 | 将 JSON 数据导入为当前编辑器状态         |
| `messageApi`         | `MessageInstance`                                     | Ant Design 的消息通知实例                |
| `state`              | `{status: Status;chains: Chain[];cmpList: CmpList[]}` | 编辑器内部的运行状态对象，包含链路等信息 |

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
