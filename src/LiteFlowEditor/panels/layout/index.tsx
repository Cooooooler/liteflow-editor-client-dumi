import { Graph } from '@antv/x6';
import { SplitBox } from '@antv/x6-react-components';
import '@antv/x6-react-components/es/split-box/style/index.css';
import React, { ReactNode } from 'react';
import { useGraphWrapper } from 'liteflow-editor-client/LiteFlowEditor/hooks';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';

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
    `,
    editorBarContainer:css`
      height: 100%;
      overflow: auto;
    `
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
        <div className={styles.editorBarContainer}>
          {sideBar}
        </div>
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
