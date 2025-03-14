import React from 'react';

import { LayoutOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import { MIN_ZOOM } from 'liteflow-editor-client/LiteFlowEditor/constant';
import makeBtnWidget from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/common/makeBtnWidget';

interface IProps {
  flowGraph: Graph;
}

const FitWindow: React.FC<IProps> = makeBtnWidget({
  tooltip: '适配窗口',
  getIcon() {
    return <LayoutOutlined />;
  },
  handler(flowGraph: Graph) {
    flowGraph.zoomToFit({ minScale: MIN_ZOOM, maxScale: 1 });
  },
});

export default FitWindow;
