import React from 'react';

import { GatewayOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import makeBtnWidget from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/common/makeBtnWidget';

interface IProps {
  flowGraph: Graph;
}

const ToggleSelection: React.FC<IProps> = makeBtnWidget({
  tooltip: '框选节点',
  getIcon() {
    return <GatewayOutlined />;
  },
  handler(flowGraph: Graph) {
    const needEnableRubberBand: boolean = !flowGraph.isRubberbandEnabled();
    if (needEnableRubberBand) {
      flowGraph.disablePanning();
      flowGraph.enableRubberband();
    } else {
      flowGraph.enablePanning();
      flowGraph.disableRubberband();
    }
  },
  selected(flowGraph: Graph) {
    return flowGraph.isRubberbandEnabled();
  },
});

export default ToggleSelection;
