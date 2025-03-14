import requestController from 'liteflow-editor-client/LiteFlowEditor/services/request_controller';

export const getCmpList = (params?: any) => {
  return requestController('/lon/api/v2/aiqa/chat/cmpManager/getCmpList', {
    method: 'GET',
    params,
  });
};

export const getChainPage = (data?: any) => {
  return requestController('/lon/api/v2/aiqa/mgr/liteflowChain/getPage', {
    method: 'POST',
    data: data ?? {},
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
