import { GraphContext } from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import { useContext } from 'react';

export const useGraph = () => {
  const { graph } = useContext(GraphContext);
  return graph;
};
