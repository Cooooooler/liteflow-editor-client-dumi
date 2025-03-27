import { Graph } from '@antv/x6';
import { Button, Tooltip } from 'antd';
import { useGraph } from 'liteflow-editor-client/LiteFlowEditor/hooks';
import React, { ReactElement } from 'react';

interface IOptions {
  tooltip: string;
  getIcon: (flowGraph: Graph) => ReactElement;
  handler: (flowGraph: Graph, props?: any) => void;
  disabled?: ((flowGraph: Graph) => boolean) | boolean;
  selected?: ((flowGraph: Graph) => boolean) | boolean;
}

interface IBtnWidgetProps {
  flowGraph: Graph;
}

const makeBtnWidget = (options: IOptions) => {
  const Widget: React.FC<IBtnWidgetProps> = (props) => {
    const flowGraph = useGraph();
    const { tooltip, getIcon, handler } = options;
    const { disabled, selected } = options;
    const disabledData =
      typeof disabled === 'function' ? disabled(flowGraph) : !!disabled;
    const selectedData =
      typeof selected === 'function' ? selected(flowGraph) : !!selected;
    const onClick = (): void => {
      if (disabledData) return;
      handler(flowGraph, props);
      flowGraph.trigger('toolBar:forceUpdate');
    };

    return (
      <Tooltip title={tooltip}>
        <Button
          color={selectedData ? 'primary' : 'default'}
          variant={selectedData ? 'filled' : 'text'}
          disabled={disabledData}
          size="small"
          onClick={onClick}
        >
          {getIcon(flowGraph)}
        </Button>
      </Tooltip>
    );
  };
  return Widget;
};

export default makeBtnWidget;
