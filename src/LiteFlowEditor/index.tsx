import { Cell, Graph } from '@antv/x6';
import { Dropdown, message, Spin } from 'antd';
import classNames from 'classnames';
import { forceLayout } from 'liteflow-editor-client/LiteFlowEditor/common/layout';
import {
  ChainManager,
  ConnectStatus,
} from 'liteflow-editor-client/LiteFlowEditor/components';
import { MIN_ZOOM } from 'liteflow-editor-client/LiteFlowEditor/constant';
import GraphContext from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import { history } from 'liteflow-editor-client/LiteFlowEditor/hooks/useHistory';
import {
  getModel,
  setModel,
} from 'liteflow-editor-client/LiteFlowEditor/hooks/useModel';
import ELBuilder from 'liteflow-editor-client/LiteFlowEditor/model/builder';
import Breadcrumb from 'liteflow-editor-client/LiteFlowEditor/panels/breadcrumb';
import getContextMenu from 'liteflow-editor-client/LiteFlowEditor/panels/flowGraph/contextMenu';
import createFlowGraph from 'liteflow-editor-client/LiteFlowEditor/panels/flowGraph/createFlowGraph';
import Layout from 'liteflow-editor-client/LiteFlowEditor/panels/layout';
import SettingBar from 'liteflow-editor-client/LiteFlowEditor/panels/settingBar';
import SideBar from 'liteflow-editor-client/LiteFlowEditor/panels/sideBar';
import ToolBar from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar';
import {
  createGlobalStyle,
  createStyles,
} from 'liteflow-editor-client/LiteFlowEditor/styles';
import { handleTimeConsumingOperations } from 'liteflow-editor-client/LiteFlowEditor/utils/flowChartUtils';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

interface ILiteFlowEditorProps {
  /**
   * 样式类
   */
  className?: string;
  /**
   * style
   */
  style?: React.CSSProperties;
  /**
   * 生成图示例事件
   * @param graph 图实例
   * @returns
   */
  onReady?: (graph: Graph) => void;
  /**
   * 工具栏组件
   */
  widgets?: React.FC<any>[];
  /**
   * 更多子节点
   */
  children?: React.ReactNode;

  getCmpList?: (data?: any) => Promise<any>;

  getChainPage?: (data?: any) => Promise<any>;

  getChainById?: (data?: any) => Promise<any>;

  addChain?: (data?: any) => Promise<any>;

  updateChain?: (data?: any) => Promise<any>;

  deleteChain?: (data?: any) => Promise<any>;

  /**
   * 其他可扩展属性
   */
  [key: string]: any;
}

const defaultMenuInfo: IMenuScene = 'blank';

const useStyles = createStyles(({ css }) => {
  return {
    editorContainer: css`
      width: 100%;
      height: 100%;
    `,
    editorGraph: css`
      width: 100%;
      height: 100%;

      .liteflow-edge-add-button {
        display: none;
        pointer-events: all !important;
        margin: 0;
        border: dashed 1px #feb663;
        color: #feb663;
      }

      .x6-edge:hover .liteflow-edge-add-button {
        display: block;
      }
    `,
    editorMiniMap: css`
      position: absolute;
      right: 8px;
      bottom: 12px;
      padding: 6px;
      border-radius: 2px;
      background-color: #fff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
      user-select: none;
    `,
  };
});

const LiteFlowEditor = forwardRef<React.FC, ILiteFlowEditorProps>(function (
  props,
  ref,
) {
  const {
    className,
    style,
    onReady,
    widgets,
    getCmpList,
    getChainPage,
    getChainById,
    addChain,
    updateChain,
    deleteChain,
  } = props;

  const { styles } = useStyles();
  const [messageApi, contextHolder] = message.useMessage();
  const widgetList = useMemo(
    () => widgets || [ConnectStatus, ChainManager],
    [widgets],
  );

  const GlobalStyles = createGlobalStyle`
    .x6-widget-dnd {
      pointer-events: none !important;
    }
  `;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<HTMLDivElement>(null);
  const [flowGraph, setFlowGraph] = useState<Graph>();
  const [contextMenuScene, setContextMenuScene] =
    useState<IMenuScene>(defaultMenuInfo);
  const [isLayouting, setIsLayouting] = useState(false);

  // Memoize the currentEditor object to prevent unnecessary re-renders
  const currentEditor = useMemo(
    () => ({
      getGraphInstance() {
        return flowGraph;
      },
      toJSON() {
        return getModel().toJSON();
      },
      fromJSON(data: Record<string, any>) {
        const model = ELBuilder.build(data || {});
        setModel(model);
        history.cleanHistory();
        flowGraph?.zoomToFit({ minScale: MIN_ZOOM, maxScale: 1 });
      },
    }),
    [flowGraph],
  );

  useImperativeHandle(ref, () => currentEditor as any);

  useEffect(() => {
    if (graphRef.current && miniMapRef.current) {
      const flowGraph = createFlowGraph(graphRef.current, miniMapRef.current);
      onReady?.(flowGraph);
      setFlowGraph(flowGraph);
      history.init(flowGraph);
    }
  }, [onReady]);

  // Memoize resize handler to prevent recreation on each render
  const resizeHandler = useCallback(() => {
    requestAnimationFrame(() => {
      if (flowGraph && wrapperRef.current) {
        const width = wrapperRef.current.clientWidth;
        const height = wrapperRef.current.clientHeight;
        flowGraph.resize(width, height);
      }
    });
  }, [flowGraph]);

  // resize flowGraph's size when window size changes
  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [resizeHandler]);

  // Memoize model change handler
  const handleModelChange = useCallback(async () => {
    if (flowGraph) {
      handleTimeConsumingOperations(
        () => {
          setIsLayouting(true);
        },
        () => {
          setIsLayouting(false);
        },
        async () => {
          const model = getModel();
          const modelJSON = model.toCells() as Cell[];
          flowGraph.startBatch('update');
          flowGraph.resetCells(modelJSON);
          // Apply layout method
          await forceLayout(flowGraph).then(() => {
            flowGraph.stopBatch('update');
            flowGraph.trigger('model:changed');
          });
        },
      );
    }
  }, [flowGraph]);

  // Memoize context menu handlers
  const showContextMenuHandler = useCallback(
    (info: IMenuScene) => {
      flowGraph?.lockScroller();
      setContextMenuScene(info);
    },
    [flowGraph],
  );

  const hideContextMenuHandler = useCallback(() => {
    flowGraph?.unlockScroller();
    setContextMenuScene(defaultMenuInfo);
  }, [flowGraph]);

  // Set up event listeners
  useEffect(() => {
    if (!flowGraph) return;

    flowGraph.on('graph:showContextMenu', showContextMenuHandler);
    flowGraph.on('graph:hideContextMenu', hideContextMenuHandler);
    flowGraph.on('model:change', handleModelChange);

    return () => {
      flowGraph.off('graph:showContextMenu', showContextMenuHandler);
      flowGraph.off('graph:hideContextMenu', hideContextMenuHandler);
      flowGraph.off('model:change', handleModelChange);
    };
  }, [
    flowGraph,
    showContextMenuHandler,
    hideContextMenuHandler,
    handleModelChange,
  ]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      graph: flowGraph!,
      graphWrapper: wrapperRef,
      model: null,
      currentEditor,
      messageApi,
      getCmpList,
      getChainPage,
      getChainById,
      addChain,
      updateChain,
      deleteChain,
    }),
    [
      flowGraph,
      currentEditor,
      messageApi,
      getCmpList,
      getChainPage,
      getChainById,
      addChain,
      updateChain,
      deleteChain,
    ],
  );

  // Memoize context menu items
  const contextMenuItems = useMemo(
    () =>
      getContextMenu({
        scene: contextMenuScene,
        flowGraph,
      }),
    [contextMenuScene, flowGraph],
  );

  return (
    <div className={classNames(className)} style={style}>
      <Spin spinning={isLayouting} fullscreen />
      {contextHolder}
      <GlobalStyles />
      <GraphContext.Provider value={contextValue}>
        <Layout
          flowGraph={flowGraph}
          SideBar={SideBar}
          ToolBar={ToolBar}
          SettingBar={SettingBar}
          widgets={widgetList}
        >
          <Dropdown
            menu={{
              items: contextMenuItems,
            }}
            trigger={['contextMenu']}
          >
            <div className={styles.editorContainer} ref={wrapperRef}>
              <div className={styles.editorGraph} ref={graphRef} />
              <div className={styles.editorMiniMap} ref={miniMapRef} />
              {flowGraph && <Breadcrumb flowGraph={flowGraph} />}
            </div>
          </Dropdown>
        </Layout>
      </GraphContext.Provider>
    </div>
  );
});

export default LiteFlowEditor;
