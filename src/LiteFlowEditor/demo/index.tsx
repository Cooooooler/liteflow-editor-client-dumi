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

const Demo: FC = () => (
  <LiteFlowEditor
    style={{
      height: '800px',
    }}
    getCmpList={getCmpList}
    getChainPage={getChainPage}
  />
);

export default Demo;
