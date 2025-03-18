import { LiteFlowEditor } from 'liteflow-editor-client';
import React, { FC } from 'react';
import requestController from '../services/request_controller';

const getChainPage = (data?: any) => {
  return requestController('/lon/api/v2/aiqa/mgr/liteflowChain/getPage', {
    method: 'POST',
    data: data ?? {},
  });
};

export const getCmpList = (params?: any) => {
  return requestController('/lon/api/v2/aiqa/chat/cmpManager/getCmpList', {
    method: 'GET',
    params,
  });
};

export const getChainById = (data?: any) => {
  return requestController(
    '/lon/api/v2/aiqa/mgr/liteflowChain/getLiteflowChain',
    {
      method: 'POST',
      data: data ?? {},
    },
  );
};

export const addChain = (data?: any) => {
  return requestController(
    '/lon/api/v2/aiqa/mgr/liteflowChain/addLiteflowChain',
    {
      method: 'POST',
      data: data ?? {},
    },
  );
};

export const updateChain = (data?: any) => {
  return requestController(
    '/lon/api/v2/aiqa/mgr/liteflowChain/updateLiteflowChain',
    {
      method: 'POST',
      data: data ?? {},
    },
  );
};

export const deleteChain = (data?: any) => {
  return requestController(
    '/lon/api/v2/aiqa/mgr/liteflowChain/deleteLiteflowChain',
    {
      method: 'POST',
      data: data ?? {},
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
