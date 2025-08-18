import { Switch, Tooltip } from 'antd';
import { buttonStatus } from 'liteflow-editor-client/LiteFlowEditor/moduls';
import React from 'react';
import { useSnapshot } from 'valtio';

export const FineTune: React.FC = () => {
  const snap = useSnapshot(buttonStatus);
  return (
    <Tooltip title="智能微调，自动调整节点位置，使节点之间距离更合理">
      <Switch
        checkedChildren="智能"
        unCheckedChildren="手动"
        size="small"
        checked={snap.isFineTune}
        onChange={(checked) => (buttonStatus.isFineTune = checked)}
      />
    </Tooltip>
  );
};
