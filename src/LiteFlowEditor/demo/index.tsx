import { LiteFlowEditor } from 'liteflow-editor-client';
import React, { FC } from 'react';
import requestController from '../services/request_controller';

const getChainPage = (data?: any) => {
  return requestController('/lon/api/v2/aiqa/mgr/liteflowChain/getPage', {
    method: 'POST',
    data: data ?? {},
  });
};

const Demo: FC = () => (
  <LiteFlowEditor
    style={{
      height: '800px',
    }}
    getChainPage={getChainPage}
  />
);

export default Demo;
