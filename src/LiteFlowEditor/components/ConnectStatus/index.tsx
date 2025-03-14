import { useAsyncEffect } from 'ahooks';
import { Tag } from 'antd';
import { getChainPage } from 'liteflow-editor-client/LiteFlowEditor/services/api';
import React, { useCallback, useState } from 'react';
import './index.less';

enum Status {
  connected = 'success',
  disconnected = 'error',
  pending = 'processing',
}

const ConnectStatus: React.FC = () => {
  const [status, setStatus] = useState<Status>(Status.pending);

  // @ts-ignore
  const syncServer = useCallback(async () => {
    const res = await getChainPage().catch(() => {
      setStatus(Status.disconnected);
    });
    if (res?.data?.data && res?.data?.data.length) {
      setStatus(Status.connected);
    } else {
      setStatus(Status.disconnected);
    }
  }, [setStatus]);

  // @ts-ignore
  useAsyncEffect(async () => {
    await syncServer();
  }, []);

  let tagText = '服务器连接失败';
  if (status === Status.connected) {
    tagText = '服务器连接成功';
  }
  if (status === Status.pending) {
    tagText = '服务器连接中';
  }
  return (
    <span className="connect-status-container">
      <Tag color={status}>{tagText}</Tag>
    </span>
  );
};

export default ConnectStatus;
