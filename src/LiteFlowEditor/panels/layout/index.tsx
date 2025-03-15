import { Graph } from '@antv/x6';
import { SplitBox } from '@antv/x6-react-components';
import '@antv/x6-react-components/es/split-box/style/index.css';
import { useGraphWrapper } from 'liteflow-editor-client/LiteFlowEditor/hooks';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, { ReactNode } from 'react';

interface ISubComponentProps {
  flowGraph: Graph;
  widgets?: React.FC<any>[];
}

interface IProps {
  flowGraph?: Graph;
  SideBar: React.FC<ISubComponentProps>;
  ToolBar: React.FC<ISubComponentProps>;
  SettingBar: React.FC<ISubComponentProps>;
  widgets?: React.FC[];
  children: ReactNode;
}

const useStyles = createStyles(({ token, css }) => {
  return {
    editorLayoutContainer: css`
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      border: 1px solid ${token.colorBorder};

      .x6-widget-transform {
        border-color: rgba(0, 0, 0, 0.3);
        border-style: dashed;
        background-color: rgba(0, 0, 0, 0.14);
        border-radius: 0;
        padding: 6px;
        margin: -7px 0 0 -7px;
        .x6-widget-transform-resize {
          width: 6px;
          height: 6px;
          border-radius: 0;
          border-color: rgba(0, 0, 0, 0.3);
          // border: 0 none;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        }
        .x6-widget-transform-cursor-nw {
          top: -6px;
          left: -6px;
        }
        .x6-widget-transform-cursor-n {
          margin-left: -3px;
          top: -6px;
        }
        .x6-widget-transform-cursor-ne {
          top: -6px;
          right: -6px;
        }
        .x6-widget-transform-cursor-e {
          margin-top: -3px;
          right: -6px;
        }
        .x6-widget-transform-cursor-se {
          right: -6px;
          bottom: -6px;
        }
        .x6-widget-transform-cursor-s {
          margin-left: -3px;
          bottom: -6px;
        }
        .x6-widget-transform-cursor-sw {
          left: -6px;
          bottom: -6px;
        }
        .x6-widget-transform-cursor-w {
          left: -6px;
          margin-top: -3px;
        }
      }
      .x6-widget-dnd.dragging {
        pointer-events: none;
      }
      .x6-edge path:nth-child(2) {
        stroke: #c1c1c1;
        stroke-width: 1px;
      }
      .x6-edge:hover,
      .x6-edge.edge-moving,
      .x6-edge.x6-edge-selected {
        path:nth-child(2) {
          stroke: #feb663;
          stroke-width: 3px;
        }
      }
      .x6-node {
        & > text {
          pointer-events: none;
        }
      }
      .react-json-view {
        .collapsed-icon,
        .expanded-icon {
          svg {
            vertical-align: middle !important;
          }
        }
      }
    `,
    editorBarContainer: css`
      height: 100%;
      overflow: auto;
    `,
  };
});

const Layout: React.FC<IProps> = (props) => {
  const { flowGraph, SideBar, ToolBar, SettingBar, widgets } = props;
  const { styles } = useStyles();
  const wrapperRef = useGraphWrapper();

  const handleResize = () => {
    if (flowGraph && wrapperRef && wrapperRef.current) {
      const width = wrapperRef.current.clientWidth;
      const height = wrapperRef.current.clientHeight;
      flowGraph.resize(width, height);
    }
  };

  let sideBar, toolBar, settingBar;
  if (flowGraph) {
    sideBar = <SideBar flowGraph={flowGraph} />;
    toolBar = <ToolBar flowGraph={flowGraph} widgets={widgets} />;
    settingBar = <SettingBar flowGraph={flowGraph} />;
  }

  return (
    <div className={styles.editorLayoutContainer}>
      {toolBar}
      <SplitBox
        split={'vertical'}
        minSize={50}
        maxSize={500}
        defaultSize={260}
        primary="first"
        onResizing={handleResize}
      >
        <div className={styles.editorBarContainer}>{sideBar}</div>
        <SplitBox
          split={'vertical'}
          minSize={50}
          maxSize={500}
          defaultSize={260}
          primary="second"
          onResizing={handleResize}
        >
          {props.children}
          {settingBar}
        </SplitBox>
      </SplitBox>
    </div>
  );
};

export default Layout;
