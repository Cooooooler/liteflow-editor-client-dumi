import { Graph } from '@antv/x6';
import { useGraph } from 'liteflow-editor-client/LiteFlowEditor/hooks';
import widgets from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, { useEffect, useReducer } from 'react';

interface IProps {
  flowGraph: Graph;
  widgets?: React.FC<any>[];
}

const useStyles = createStyles(({ token, css }) => {
  return {
    editorToolBarContainer: css`
      display: flex;
      flex-wrap: wrap;
      row-gap: ${token.marginSM}px;
      border-bottom: 1px solid ${token.colorBorder};
      background-color: ${token.colorBgContainer};
      padding: ${token.paddingSM}px;
    `,
    editorToolBarGroup: css`
      display: flex;
      flex-direction: row;
      align-items: center;

      &:after {
        content: '';
        height: 100%;
        width: 1px;
        background-color: ${token.colorBorder};
        margin: 0 ${token.marginSM}px;
      }

      &:last-child:after {
        display: none;
      }
    `,
  };
});

const ToolBar: React.FC<IProps> = ({ widgets: customWidgets }) => {
  const flowGraph: Graph = useGraph();
  const forceUpdate = useReducer((n) => n + 1, 0)[1];

  const { styles } = useStyles();
  useEffect(() => {
    flowGraph.on('toolBar:forceUpdate', forceUpdate);
    return () => {
      flowGraph.off('toolBar:forceUpdate');
    };
  }, [flowGraph]);

  let customWidgetsGroup = null;
  if (customWidgets && customWidgets.length) {
    customWidgetsGroup = (
      <div className={styles.editorToolBarGroup}>
        {customWidgets.map((WidgetItem, index) => (
          <WidgetItem key={index} flowGraph={flowGraph} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.editorToolBarContainer}>
      {widgets.map((group, index) => (
        <div key={index} className={styles.editorToolBarGroup}>
          {group.map((ToolItem, index) => {
            return <ToolItem key={index} flowGraph={flowGraph} />;
          })}
        </div>
      ))}
      {customWidgetsGroup}
    </div>
  );
};

export default ToolBar;
