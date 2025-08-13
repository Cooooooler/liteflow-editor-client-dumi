/**
 * title: 基础使用
 * description: 指定高度即可开始使用，`api` 接口可以直接剥离。
 */

import {
  Chain,
  LiteFlowEditor,
  LiteFlowEditorRef,
  setGlobalLogLevel,
} from 'liteflow-editor-client';
import {
  ConditionTypeList,
  NodeTypeList,
} from 'liteflow-editor-client/LiteFlowEditor/constant';
import { safeParse } from 'liteflow-editor-client/LiteFlowEditor/utils';
import React, { FC, useRef } from 'react';
import { extend } from 'umi-request';

const requestController = extend({
  timeout: 10000,
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

  const Authorization = 'token:8d2cd444d2124a668d1d23109ce6b06c';

  const getChainPage = async (data: undefined) => {
    try {
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
    } catch (error) {
      if (ref.current) {
        ref.current.state.status = 'error';
      }
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
