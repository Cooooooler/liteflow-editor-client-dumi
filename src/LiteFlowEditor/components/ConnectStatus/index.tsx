import { useAsyncEffect } from 'ahooks';
import { Tag } from 'antd';
import GraphContext from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import { getDefChainPage } from 'liteflow-editor-client/LiteFlowEditor/services/api';
import React, { useCallback, useContext, useState } from 'react';

enum Status {
  connected = 'success',
  disconnected = 'error',
  pending = 'processing',
}

const ConnectStatus: React.FC = () => {
  const [status, setStatus] = useState<Status>(Status.pending);

  const { getChainPage } = useContext(GraphContext);
  const getChainPageApi = getChainPage ?? getDefChainPage;
  const syncServer = useCallback(async () => {
    const res = await getChainPageApi().catch(() => {
      setStatus(Status.disconnected);
    });
    if (res?.data?.data && res?.data?.data.length) {
      setStatus(Status.connected);
    } else {
      setStatus(Status.disconnected);
    }
  }, [setStatus]);

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
  return <Tag color={status}>{tagText}</Tag>;
};

export default ConnectStatus;
