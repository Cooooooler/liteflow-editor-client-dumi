import ELNode from 'liteflow-editor-client/LiteFlowEditor/model/node';

let model: ELNode;

export const setModel = (_newModel: ELNode) => {
  model = _newModel;
};

export const getModel = () => {
  return model;
};
