import { Graph, Rectangle } from '@antv/x6';
import { getSelectedEdges } from 'liteflow-editor-client/LiteFlowEditor/utils/flowChartUtils';

export function findViewsFromPoint(flowGraph: Graph, x: number, y: number) {
  return flowGraph
    .getCells()
    .map((cell) => flowGraph.findViewByCell(cell))
    .filter((view) => {
      if (view !== null) {
        let bBox = view.getBBox(view.container as any);
        if (bBox.height < 16) {
          bBox = Rectangle.create({
            x: bBox.x,
            y: bBox.y - 8 + bBox.height / 2,
            width: bBox.width,
            height: 16,
          });
        }
        return bBox.containsPoint({ x, y });
      }
      return false;
    }) as any[];
}

const registerEvents = (flowGraph: Graph): void => {
  flowGraph.on('selection:changed', () => {
    flowGraph.trigger('toolBar:forceUpdate');
    flowGraph.trigger('settingBar:forceUpdate');
  });
  flowGraph.on('edge:selected', (args) => {
    args.edge.attr('line/stroke', '#feb663', { ignore: true });
  });
  flowGraph.on('edge:unselected', (args) => {
    args.edge.attr('line/stroke', '#c1c1c1', { ignore: true });
  });
  flowGraph.on('edge:mouseover', (args) => {
    args.edge.attr('line/stroke', '#feb663', { ignore: true });
  });
  flowGraph.on('edge:mouseleave', (args) => {
    const { edge } = args;
    const selectedEdges = getSelectedEdges(flowGraph);
    if (selectedEdges[0] !== edge) {
      args.edge.attr('line/stroke', '#c1c1c1', { ignore: true });
    }
  });
  flowGraph.on('node:dblclick', () => {
    flowGraph.trigger('graph:editNode');
  });
  flowGraph.on('blank:contextmenu', () => {
    flowGraph.cleanSelection();
    flowGraph.trigger('graph:showContextMenu', 'blank');
  });
  flowGraph.on('node:contextmenu', (args) => {
    const { node } = args;
    // NOTE: if the clicked node is not in the selected nodes, then clear selection
    if (!flowGraph.getSelectedCells().includes(node)) {
      flowGraph.cleanSelection();
      flowGraph.select(node);
    }
    flowGraph.trigger('graph:showContextMenu', 'node');
  });
  flowGraph.on('blank:mousedown', () => {
    flowGraph.cleanSelection();
  });
};

export default registerEvents;
