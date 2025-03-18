import requestController from 'liteflow-editor-client/LiteFlowEditor/services/request_controller';

export const getDefCmpList = (params?: any) => {
  return requestController('/lon/api/v2/aiqa/chat/cmpManager/getCmpList', {
    method: 'GET',
    params,
  });
};

export const getDefChainPage = (data?: any) => {
  return requestController('/lon/api/v2/aiqa/mgr/liteflowChain/getPage', {
    method: 'POST',
    data: data ?? {},
  });
};

export const getDefChainById = (data?: any) => {
  return requestController(
    '/lon/api/v2/aiqa/mgr/liteflowChain/getLiteflowChain',
    {
      method: 'POST',
      data: data ?? {},
    },
  );
};

export const addDefChain = (data?: any) => {
  return requestController(
    '/lon/api/v2/aiqa/mgr/liteflowChain/addLiteflowChain',
    {
      method: 'POST',
      data: data ?? {},
    },
  );
};

export const updateDefChain = (data?: any) => {
  return requestController(
    '/lon/api/v2/aiqa/mgr/liteflowChain/updateLiteflowChain',
    {
      method: 'POST',
      data: data ?? {},
    },
  );
};

export const deleteDefChain = (data?: any) => {
  return requestController(
    '/lon/api/v2/aiqa/mgr/liteflowChain/deleteLiteflowChain',
    {
      method: 'POST',
      data: data ?? {},
    },
  );
};
