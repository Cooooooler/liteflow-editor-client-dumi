/**
 * title: 基础使用
 * description: 指定高度即可开始使用，`api` 接口可以直接剥离。
 */

import {
  LiteFlowEditor,
  LiteFlowEditorRef,
  requestController,
} from 'liteflow-editor-client';
import React, { FC, useRef } from 'react';

const Demo: FC = () => {
  const ref = useRef<LiteFlowEditorRef>(null);

  const Authorization = 'token:8d2cd444d2124a668d1d23109ce6b06c';

  const getChainPage = async (data?: any) => {
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
