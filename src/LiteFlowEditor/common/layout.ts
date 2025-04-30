import { DagreLayout, DagreLayoutOptions } from '@antv/layout';
import { Graph, Node } from '@antv/x6';
import {
  ConditionTypeEnum,
  NODE_SEP,
  NODE_WIDTH,
  RANK_SEP,
} from 'liteflow-editor-client/LiteFlowEditor/constant';

const rankdir: DagreLayoutOptions['rankdir'] = 'LR';
const align: DagreLayoutOptions['align'] = undefined;
const nodeSize: number = NODE_WIDTH;
const ranksep: number = RANK_SEP;
const nodesep: number = NODE_SEP;
const controlPoints: DagreLayoutOptions['controlPoints'] = false;
const begin: [number, number] = [40, 40];

/**
 * Batch adjustments node position to reduce duplicate calculations
 * @param flowGraph 图实例
 * @param startNode 起始节点
 * @param deltaY Y轴偏移量
 * @param direction 遍历方向
 */
function adjustNodePosition(
  flowGraph: Graph,
  node: Node,
  deltaY: number,
  direction: 'incoming' | 'outgoing',
) {
  // 使用Set来避免重复处理节点
  const visited = new Set<string>();
  let queue = [node];

  while (queue.length) {
    const nextQueue: Node[] = [];

    for (const next of queue) {
      const nodeId = next.id;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      // 批量更新位置
      const { x, y } = next.position();
      next.position(x, y - deltaY);

      // 获取相邻节点并加入队列
      const neighbors = flowGraph.getNeighbors(next, {
        [direction]: true,
      }) as Node[];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          nextQueue.push(neighbor);
        }
      }
    }

    queue = nextQueue;
  }
}

function afterCatchEnd(flowGraph: Graph, catchEnd: Node) {
  const neighbors = flowGraph.getNeighbors(catchEnd, {
    incoming: true,
  }) as Node[];

  if (!neighbors.length) return;

  const catchRootNode = neighbors[0];
  const deltaY = catchEnd.position().y - catchRootNode.position().y;
  if (!deltaY) return;

  adjustNodePosition(flowGraph, catchEnd, deltaY, 'outgoing');
}

function beforeCatchStart(flowGraph: Graph, catchStart: Node) {
  const neighbors = flowGraph.getNeighbors(catchStart, {
    outgoing: true,
  }) as Node[];

  if (!neighbors.length) return;

  const catchRootNode = neighbors[0];
  const deltaY = catchStart.position().y - catchRootNode.position().y;
  if (!deltaY) return;

  adjustNodePosition(flowGraph, catchStart, deltaY, 'incoming');
}

/**
 * 优化的层次调整算法
 * @param flowGraph 图实例
 */
function fineTuneLayer(flowGraph: Graph): Promise<void> {
  return new Promise((resolve) => {
    // 预先计算所有节点的层级
    const nodeLayerMap = new Map<string, number>();
    const rootNodes = flowGraph.getRootNodes();

    // 使用BFS计算每个节点的层级
    let queue = rootNodes.map((node) => ({ node, layer: 0 }));

    while (queue.length) {
      const { node, layer } = queue.shift()!;
      const nodeId = node.id;

      // 如果节点已经有层级且层级更高，则跳过
      if (nodeLayerMap.has(nodeId) && nodeLayerMap.get(nodeId)! >= layer) {
        continue;
      }

      nodeLayerMap.set(nodeId, layer);

      // 获取所有出边节点
      const neighbors = flowGraph.getNeighbors(node, {
        outgoing: true,
      }) as Node[];

      // 将下一层节点加入队列
      for (const neighbor of neighbors) {
        queue.push({ node: neighbor, layer: layer + 1 });
      }
    }

    // 批量更新节点位置
    const batchPositions: Array<{ node: Node; x: number; y: number }> = [];

    nodeLayerMap.forEach((layer, nodeId) => {
      const node = flowGraph.getCellById(nodeId) as Node;
      if (node) {
        const { y } = node.position();
        batchPositions.push({
          node,
          x: begin[0] + layer * (ranksep + nodeSize + 40),
          y,
        });
      }
    });

    // 批量应用位置更新
    flowGraph.batchUpdate(() => {
      for (const { node, x, y } of batchPositions) {
        node.position(x, y);
      }
    });

    resolve();
  });
}

/**
 * 优化的捕获异常节点布局调整
 * @param flowGraph 图实例
 */
function fineTuneCatchNodes(flowGraph: Graph) {
  // 预先筛选出所有CATCH类型节点
  const catchNodes: Node[] = [];
  const allNodes = flowGraph.getNodes();

  for (const node of allNodes) {
    const data = node.getData();
    if (!data || !data.model) continue;

    const { model } = data;
    const currentModel = model.proxy || model;

    if (currentModel.type === ConditionTypeEnum.CATCH) {
      catchNodes.push(node);
    }
  }

  // 批量处理CATCH节点
  flowGraph.batchUpdate(() => {
    for (const node of catchNodes) {
      if (node.shape === ConditionTypeEnum.CATCH) {
        // CATCH start
        beforeCatchStart(flowGraph, node);
      } else {
        // CATCH end
        afterCatchEnd(flowGraph, node);
      }
    }
  });
}

/**
 * 使用AntV的图布局包实现布局，优化性能
 * @param flowGraph 图实例
 * @param cfg 配置
 */
async function antvDagreLayout(flowGraph: Graph, cfg: any = {}): Promise<void> {
  // 预先获取所有节点和边，避免重复查询
  const allNodes = flowGraph.getNodes();
  const allEdges = flowGraph.getEdges();

  // 批量设置Z索引
  flowGraph.batchUpdate(() => {
    allNodes.forEach((node) => node.setZIndex(1));
    allEdges.forEach((edge) => edge.setZIndex(0));
  });

  // 准备布局数据
  const nodeData = allNodes.map((node) => node.toJSON());
  const edgeData = allEdges.map((edge) => edge.toJSON());

  // 创建布局实例
  const dagreLayout: DagreLayout = new DagreLayout({
    begin,
    type: 'dagre',
    rankdir,
    align,
    nodeSize,
    ranksep,
    nodesep,
    controlPoints,
    ...cfg,
  });

  // 执行布局计算
  const { nodes: newNodes } = dagreLayout.layout({
    // @ts-ignore
    nodes: nodeData,
    // @ts-ignore
    edges: edgeData,
  });

  // 创建节点ID到新位置的映射
  const positionMap = new Map<string, { x: number; y: number }>();

  newNodes?.forEach((node: any) => {
    positionMap.set(node.id, { x: node.x, y: node.y });
  });

  // 批量更新节点位置
  flowGraph.batchUpdate(() => {
    allNodes.forEach((cell) => {
      const nodeId = cell.id;
      const newPos = positionMap.get(nodeId);

      if (newPos) {
        const positionMes = cell.position();
        if (positionMes.x === 0 && positionMes.y === 0) {
          cell.position(newPos.x, newPos.y);
        }
      }
    });
  });

  // 执行微调
  await fineTuneLayer(flowGraph);
  fineTuneCatchNodes(flowGraph);
}

/**
 * 导出的布局函数
 * @param flowGraph 图实例
 * @param cfg 配置
 */
export const forceLayout = async (
  flowGraph: Graph,
  cfg: any = {},
): Promise<void> => {
  await antvDagreLayout(flowGraph, cfg);
};
