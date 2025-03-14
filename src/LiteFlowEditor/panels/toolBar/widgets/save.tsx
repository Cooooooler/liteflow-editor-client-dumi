import React from 'react';

import { SaveOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import { shortcuts } from 'liteflow-editor-client/LiteFlowEditor/common/shortcuts';
import makeBtnWidget from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/common/makeBtnWidget';

interface IProps {
  flowGraph: Graph;
}

const Save: React.FC<IProps> = makeBtnWidget({
  tooltip: '保存',
  handler: shortcuts.save.handler,
  getIcon() {
    return <SaveOutlined />;
  },
});

export default Save;
