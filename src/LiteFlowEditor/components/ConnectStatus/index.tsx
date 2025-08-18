import { Tag } from 'antd';
import { state } from 'liteflow-editor-client/LiteFlowEditor/moduls';
import React from 'react';
import { useSnapshot } from 'valtio';

enum Status {
  success = '服务器连接成功',
  error = '服务器连接失败',
  pending = '服务器连接中',
}

const ConnectStatus: React.FC = () => {
  const snap = useSnapshot(state);

  return <Tag color={snap.status}>{Status[snap.status]}</Tag>;
};

export default ConnectStatus;
