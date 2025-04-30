/**
 * title: 基础使用
 * description: 指定高度即可开始使用，`api` 接口可以直接剥离。
 */

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
