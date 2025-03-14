import { UndoOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import { shortcuts } from 'liteflow-editor-client/LiteFlowEditor/common/shortcuts';
import { history } from 'liteflow-editor-client/LiteFlowEditor/hooks/useHistory';
import makeBtnWidget from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/common/makeBtnWidget';
import React from 'react';

interface IProps {
  flowGraph: Graph;
}

const Save: React.FC<IProps> = makeBtnWidget({
  tooltip: '撤销',
  handler: shortcuts.undo.handler,
  getIcon() {
    return <UndoOutlined />;
  },
  disabled() {
    return !history.canUndo();
  },
});

export default Save;
