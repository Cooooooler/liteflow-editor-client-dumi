import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import { shortcuts } from 'liteflow-editor-client/LiteFlowEditor/common/shortcuts';
import {
  MAX_ZOOM,
  MIN_ZOOM,
} from 'liteflow-editor-client/LiteFlowEditor/constant';
import { useGraph } from 'liteflow-editor-client/LiteFlowEditor/hooks';
import makeBtnWidget from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/common/makeBtnWidget';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, { useEffect, useState } from 'react';

interface IProps {
  flowGraph: Graph;
}

const useStyles = createStyles(({ css }) => {
  return {
    zoomContainer: css`
      display: flex;
      align-items: center;
    `,
    zoomText: css`
      width: 45px;
      text-align: center;
    `,
  };
});
const ZoomOut: React.FC<IProps> = makeBtnWidget({
  tooltip: '缩小',
  handler: shortcuts.zoomOut.handler,
  getIcon() {
    return <ZoomOutOutlined />;
  },
  disabled(flowGraph: Graph) {
    return flowGraph.zoom() <= MIN_ZOOM;
  },
});

const ZoomIn: React.FC<IProps> = makeBtnWidget({
  tooltip: '放大',
  handler: shortcuts.zoomIn.handler,
  getIcon() {
    return <ZoomInOutlined />;
  },
  disabled(flowGraph: Graph) {
    return flowGraph.zoom() >= MAX_ZOOM;
  },
});

const Helper = {
  scaleFormatter(scale: number): string {
    return (scale * 100).toFixed(0) + '%';
  },
};

const Zoom: React.FC<IProps> = (props) => {
  const { styles } = useStyles();
  const flowGraph = useGraph();
  const [scale, setScale] = useState<number>(flowGraph.zoom());
  useEffect(() => {
    const handleScale = () => {
      setScale(flowGraph.zoom());
    };
    flowGraph.on('scale', handleScale);
    return () => {
      flowGraph.off('scale', handleScale);
    };
  }, [flowGraph]);
  return (
    <div className={styles.zoomContainer}>
      <ZoomOut {...props} />
      <span className={styles.zoomText}>{Helper.scaleFormatter(scale)}</span>
      <ZoomIn {...props} />
    </div>
  );
};

export default Zoom;
