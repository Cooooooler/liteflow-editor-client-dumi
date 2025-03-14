import { Cell, Edge, Graph, Node } from '@antv/x6';
import classNames from 'classnames';
import { forceLayout } from 'liteflow-editor-client/LiteFlowEditor/common/layout';
import {
  ChainManager,
  ConnectStatus,
} from 'liteflow-editor-client/LiteFlowEditor/components';
import { MIN_ZOOM } from 'liteflow-editor-client/LiteFlowEditor/constant';
import GraphContext from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import { useModel } from 'liteflow-editor-client/LiteFlowEditor/hooks';
import { history } from 'liteflow-editor-client/LiteFlowEditor/hooks/useHistory';
import { setModel } from 'liteflow-editor-client/LiteFlowEditor/hooks/useModel';
import styles from 'liteflow-editor-client/LiteFlowEditor/index.module.less';
import ELBuilder from 'liteflow-editor-client/LiteFlowEditor/model/builder';
import Breadcrumb from 'liteflow-editor-client/LiteFlowEditor/panels/breadcrumb';
import FlowGraphContextMenu from 'liteflow-editor-client/LiteFlowEditor/panels/flowGraph/contextMenu';
import FlowGraphContextPad from 'liteflow-editor-client/LiteFlowEditor/panels/flowGraph/contextPad';
import createFlowGraph from 'liteflow-editor-client/LiteFlowEditor/panels/flowGraph/createFlowGraph';
import Layout from 'liteflow-editor-client/LiteFlowEditor/panels/layout';
import SettingBar from 'liteflow-editor-client/LiteFlowEditor/panels/settingBar';
import SideBar from 'liteflow-editor-client/LiteFlowEditor/panels/sideBar';
import ToolBar from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar';
import React, {
  forwardRef,
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

  /**
   * 其他可扩展属性
   */
  [key: string]: any;
}

const defaultMenuInfo: IMenuInfo = {
  x: 0,
  y: 0,
  scene: 'blank',
  visible: false,
};

interface IPadInfo {
  x: number;
  y: number;
  edge?: Edge;
  node?: Node;
  scene?: IContextPadScene;
  visible: boolean;
}

const defaultPadInfo: IPadInfo = {
  x: 0,
  y: 0,
  scene: 'append',
  visible: false,
};

const LiteFlowEditor = forwardRef<React.FC, ILiteFlowEditorProps>(function (
  props,
  ref,
) {
  const { className, onReady, widgets, children } = props;

  const widgetList = useMemo(
    () => widgets || [ConnectStatus, ChainManager],
    [widgets],
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<HTMLDivElement>(null);
  const [flowGraph, setFlowGraph] = useState<Graph>();
  const [contextMenuInfo, setContextMenuInfo] =
    useState<IMenuInfo>(defaultMenuInfo);
  const [contextPadInfo, setContextPadInfo] =
    useState<IPadInfo>(defaultPadInfo);

  const currentEditor = {
    getGraphInstance() {
      return flowGraph;
    },
    toJSON() {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useModel().toJSON();
    },
    fromJSON(data: Record<string, any>) {
      const model = ELBuilder.build(data || {});
      setModel(model);
      history.cleanHistory();
      flowGraph?.zoomToFit({ minScale: MIN_ZOOM, maxScale: 1 });
    },
  };
  useImperativeHandle(ref, () => currentEditor as any);
  useEffect(() => {
    if (graphRef.current && miniMapRef.current) {
      const flowGraph = createFlowGraph(graphRef.current, miniMapRef.current);
      onReady?.(flowGraph);
      setFlowGraph(flowGraph);
      history.init(flowGraph);
    }
  }, []);

  // resize flowGraph's size when window size changes
  useEffect(() => {
    const handler = () => {
      requestAnimationFrame(() => {
        if (flowGraph && wrapperRef && wrapperRef.current) {
          const width = wrapperRef.current.clientWidth;
          const height = wrapperRef.current.clientHeight;
          flowGraph.resize(width, height);
        }
      });
    };
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, [flowGraph, wrapperRef]);

  // NOTE: listen toggling context menu event
  useEffect(() => {
    const showHandler = (info: IMenuInfo) => {
      flowGraph?.lockScroller();
      setContextMenuInfo({ ...info, visible: true });
    };
    const hideHandler = () => {
      flowGraph?.unlockScroller();
      setContextMenuInfo({ ...contextMenuInfo, visible: false });
    };
    const showContextPad = (info: IPadInfo) => {
      flowGraph?.lockScroller();
      setContextPadInfo({ ...info, visible: true });
    };
    const hideContextPad = () => {
      flowGraph?.unlockScroller();
      setContextPadInfo({ ...contextPadInfo, visible: false });
    };
    const handleModelChange = () => {
      if (flowGraph) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const model = useModel();
        const modelJSON = model.toCells() as Cell[];
        flowGraph.startBatch('update');
        flowGraph.resetCells(modelJSON);
        forceLayout(flowGraph);
        flowGraph.stopBatch('update');
        flowGraph.trigger('model:changed');
      }
    };
    if (flowGraph) {
      flowGraph.on('graph:showContextMenu', showHandler);
      flowGraph.on('graph:hideContextMenu', hideHandler);
      flowGraph.on('graph:showContextPad', showContextPad);
      flowGraph.on('graph:hideContextPad', hideContextPad);
      flowGraph.on('model:change', handleModelChange);
    }
    return () => {
      if (flowGraph) {
        flowGraph.off('graph:showContextMenu', showHandler);
        flowGraph.off('graph:hideContextMenu', hideHandler);
        flowGraph.off('graph:showContextPad', showContextPad);
        flowGraph.off('graph:hideContextPad', hideContextPad);
        flowGraph.off('model:change', handleModelChange);
      }
    };
  }, [flowGraph]);

  return (
    // <ThemeProvider appearance={'dark'}>
    <GraphContext.Provider
      value={{
        graph: flowGraph!,
        graphWrapper: wrapperRef,
        model: null,
        currentEditor,
      }}
    >
      <Layout
        flowGraph={flowGraph}
        SideBar={SideBar}
        ToolBar={ToolBar}
        SettingBar={SettingBar}
        widgets={widgetList}
      >
        <div
          className={classNames(styles.liteflowEditorContainer, className)}
          ref={wrapperRef}
        >
          <div className={styles.liteflowEditorGraph} ref={graphRef} />
          <div className={styles.liteflowEditorMiniMap} ref={miniMapRef} />
          {flowGraph && <Breadcrumb flowGraph={flowGraph} />}
          {flowGraph && (
            <FlowGraphContextMenu {...contextMenuInfo} flowGraph={flowGraph} />
          )}
          {flowGraph && (
            <FlowGraphContextPad {...contextPadInfo} flowGraph={flowGraph} />
          )}
          {children}
        </div>
      </Layout>
    </GraphContext.Provider>
    // </ThemeProvider>
  );
});

export default LiteFlowEditor;
