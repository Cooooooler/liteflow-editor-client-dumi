import React from 'react';

import { DeleteOutlined } from '@ant-design/icons';

import { shortcuts } from 'liteflow-editor-client/LiteFlowEditor/common/shortcuts';

const nodeMenuConfig = [
  {
    key: 'delete',
    title: '删除',
    icon: <DeleteOutlined />,
    handler: shortcuts.delete.handler,
  },
];

export default nodeMenuConfig;
