import React from 'react';

import { RedoOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import { shortcuts } from 'liteflow-editor-client/LiteFlowEditor/common/shortcuts';
import { history } from 'liteflow-editor-client/LiteFlowEditor/hooks/useHistory';
import makeBtnWidget from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/common/makeBtnWidget';

interface IProps {
  flowGraph: Graph;
}

const Save: React.FC<IProps> = makeBtnWidget({
  tooltip: '重做',
  handler: shortcuts.redo.handler,
  getIcon() {
    return <RedoOutlined />;
  },
  disabled() {
    return !history.canRedo();
  },
});

export default Save;
