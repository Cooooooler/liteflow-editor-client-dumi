import { GraphContext } from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import { useContext } from 'react';

export const useGraphWrapper = () => {
  const { graphWrapper } = useContext(GraphContext);
  return graphWrapper;
};
