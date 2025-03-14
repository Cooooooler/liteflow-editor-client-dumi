import { Cell, Graph } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { MiniMap } from '@antv/x6-plugin-minimap';
import { Scroller } from '@antv/x6-plugin-scroller';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Button } from 'antd';
import { debounce } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MAX_ZOOM, MIN_ZOOM } from 'liteflow-editor-client/LiteFlowEditor/constant';

import {
  LITEFLOW_ANCHOR,
  LITEFLOW_ROUTER,
  registerEvents,
  registerShortcuts,
} from '../../common';

const createFlowChart = (
  container: HTMLDivElement,
  miniMapContainer: HTMLDivElement,
): Graph => {
  const flowGraph = new Graph({
    autoResize: true,
    container,
    onEdgeLabelRendered: (args) => {
      const { edge, selectors, label } = args;
      const content = selectors.foContent as HTMLElement;
      if (content) {
        const root = ReactDOM.createRoot(content);
        content.style.display = 'flex';
        content.style.alignItems = 'center';
        content.style.justifyContent = 'center';
        content.style.overflow = 'hidden';
        if (label?.attrs?.label.text === '+') {
          const showContextPad = debounce((info: any) => {
            flowGraph.trigger('graph:showContextPad', info);
          }, 100);
          const handleOnClick = (event: any) => {
            showContextPad({
              x: event.clientX,
              y: event.clientY,
              edge,
            });
          };
          root.render(
            <Button
              size="small"
              onClick={handleOnClick}
              className="liteflow-edge-add-button"
            >
              +
            </Button>,
          );
        } else {
          content.appendChild(
            document.createTextNode(label?.attrs?.label.text + ''),
          );
        }
      }
      return void 0;
    },
    // https://x6.antv.vision/zh/docs/tutorial/intermediate/connector
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      allowNode: false,
      allowEdge: false,
      highlight: true,
      anchor: LITEFLOW_ANCHOR, // LITEFLOW_ANCHOR, // 'center',
      connectionPoint: 'bbox',
      connector: {
        name: 'rounded', //两条线交叉时，出现线桥。
        args: {
          radius: 8,
        },
      },
      router: LITEFLOW_ROUTER, // LITEFLOW_ROUTER, // 'normal',
      validateEdge: (args) => {
        const { edge } = args;
        return !!(edge?.target as any)?.port;
      },
      validateConnection({
        sourceView,
        targetView,
        sourceMagnet,
        targetMagnet,
      }) {
        if (!sourceMagnet) {
          return false;
        } else if (!targetMagnet) {
          return false;
        } else {
          return sourceView !== targetView;
        }
      },
    },
    // https://x6.antv.vision/zh/docs/tutorial/basic/background
    background: {
      color: '#f4f7fc',
    },
    // https://x6.antv.vision/zh/docs/tutorial/basic/grid
    grid: {
      visible: true,
    },
    mousewheel: {
      enabled: true,
      minScale: MIN_ZOOM,
      maxScale: MAX_ZOOM,
      modifiers: ['ctrl', 'meta'],
    },
    interacting: {
      nodeMovable: true,
      edgeLabelMovable: false,
    },
  });
  flowGraph
    .use(
      new Scroller({
        enabled: true,
        pannable: true,
      }),
    )
    .use(
      new Selection({
        enabled: true,
        rubberband: false, // 启用框选
        movable: true,
        multiple: true,
        strict: true,
        showNodeSelectionBox: true,
        selectNodeOnMoved: true,
        pointerEvents: 'none',
      }),
    )
    .use(
      new Keyboard({
        enabled: true,
        global: false,
      }),
    )
    .use(
      new Clipboard({
        enabled: true,
        useLocalStorage: true,
      }),
    )
    .use(
      new Snapline({
        enabled: true,
        clean: 100,
      }),
    )
    .use(
      new History({
        enabled: true,
        beforeAddCommand(event: any, args: any) {
          if (args.options) {
            return args.options.ignore !== true;
          }
        },
      }),
    )
    .use(
      new MiniMap({
        width: 150,
        height: 150,
        minScale: MIN_ZOOM,
        maxScale: MAX_ZOOM,
        scalable: false,
        container: miniMapContainer,
        graphOptions: {
          async: true,
          createCellView(cell: Cell) {
            if (cell.isEdge()) {
              return null;
            }
          },
        },
      }),
    );
  registerEvents(flowGraph);
  registerShortcuts(flowGraph);
  return flowGraph;
};

export default createFlowChart;
