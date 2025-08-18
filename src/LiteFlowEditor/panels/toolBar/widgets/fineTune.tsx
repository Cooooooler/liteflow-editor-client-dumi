import { Switch, Tooltip } from 'antd';
import GraphContext from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import React, { useContext } from 'react';

export const FineTune: React.FC = () => {
  const context = useContext(GraphContext);
  return (
    <Tooltip title="智能微调，自动调整节点位置，使节点之间距离更合理">
      <Switch
        checkedChildren="智能"
        unCheckedChildren="手动"
        size="small"
        checked={context.isFineTune}
        onChange={(checked) => context.setIsFineTune(checked)}
      />
    </Tooltip>
  );
};
