/**
 * title: 基础使用
 * description: 指定高度即可开始使用，`api` 接口可以直接剥离。
 */

import { LiteFlowEditor, setGlobalLogLevel } from 'liteflow-editor-client';
import { LiteFlowEditorRef } from 'liteflow-editor-client/LiteFlowEditor';
import {
  ConditionTypeList,
  NodeTypeList,
} from 'liteflow-editor-client/LiteFlowEditor/constant';
import { Chain, state } from 'liteflow-editor-client/LiteFlowEditor/moduls';
import React, { FC, useRef } from 'react';
import { extend } from 'umi-request';

const requestController = extend({
  timeout: 10000,
  prefix: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  errorHandler: (error) => {
    const { response } = error;

    if (response && response.status) {
    } else if (!response) {
    }

    return Promise.reject(error);
  },
});

requestController.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('authToken');

  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', token);
  }

  return { url, options };
});

requestController.interceptors.response.use((response) => {
  return response;
});

const Demo: FC = () => {
  // 设置日志级别，5 为最详细，0 为最不详细
  setGlobalLogLevel(5);

  const ref = useRef<LiteFlowEditorRef>(null);

  const getChainPage = async (data: undefined) => {
    try {
      const res = await requestController('/getLiteflowChain', {
        method: 'GET',
        data: data ?? {},
      });

      if (res.data && ref.current) {
        const { data: chains = [] } = res.data;
        state.chains = chains;
        state.status = 'success';
        return res.data;
      }
    } catch (error) {
      state.status = 'error';
    }
  };

  const getNodeList = async (params: {
    nodeType: ConditionTypeList | NodeTypeList;
  }) => {
    try {
      const res = await requestController('/getNode', {
        method: 'GET',
        params,
      });
      if (res.data) {
        const { data: nodeList = [] } = res.data;
        state.nodeList = nodeList;
      }
    } catch (error) {
      state.status = 'error';
    }
  };

  const addChain = async (data: { chainName: string; chainDesc: string }) => {
    const res = await requestController('/addLiteflowChain', {
      method: 'POST',
      data: data,
    });
    if (res) {
      return true;
    } else {
      return false;
    }
  };

  const updateChain = async (data: Chain) => {
    const res = await requestController('/updateLiteflowChain', {
      method: 'POST',
      data: data ?? {},
    });
    if (res) {
      return true;
    } else {
      return false;
    }
  };

  const deleteChain = async (data?: { chainId: string; id: string }) => {
    const res = await requestController('/deleteLiteflowChain', {
      method: 'POST',
      data: data ?? {},
    });
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
      getNodeList={getNodeList}
      getChainPage={getChainPage}
      addChain={addChain}
      updateChain={updateChain}
      deleteChain={deleteChain}
    />
  );
};

export default Demo;
