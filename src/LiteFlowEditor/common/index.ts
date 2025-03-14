export { default as registerEvents } from 'liteflow-editor-client/LiteFlowEditor/common/events';
export { default as registerShortcuts } from 'liteflow-editor-client/LiteFlowEditor/common/shortcuts';

import { Graph } from '@antv/x6';

import {
  LITEFLOW_ANCHOR,
  LITEFLOW_EDGE,
  LITEFLOW_ROUTER,
} from 'liteflow-editor-client/LiteFlowEditor/constant';

import { default as liteflowAnchor } from 'liteflow-editor-client/LiteFlowEditor/common/anchor';
import { default as liteflowEdge } from 'liteflow-editor-client/LiteFlowEditor/common/edge';
import { default as liteflowRouter } from 'liteflow-editor-client/LiteFlowEditor/common/router';

Graph.registerEdge(LITEFLOW_EDGE, liteflowEdge);
Graph.registerRouter(LITEFLOW_ROUTER, liteflowRouter);
Graph.registerAnchor(LITEFLOW_ANCHOR, liteflowAnchor);

export { LITEFLOW_ANCHOR, LITEFLOW_EDGE, LITEFLOW_ROUTER };
