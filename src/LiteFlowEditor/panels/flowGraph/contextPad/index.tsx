import { Edge, Graph, Node } from '@antv/x6';
import { Input } from 'antd';
import {
  BRANCH_GROUP,
  CONTROL_GROUP,
  NODE_GROUP,
  OTHER_GROUP,
  SEQUENCE_GROUP,
} from 'liteflow-editor-client/LiteFlowEditor/cells';
import useClickAway from 'liteflow-editor-client/LiteFlowEditor/hooks/useClickAway';
import { history } from 'liteflow-editor-client/LiteFlowEditor/hooks/useHistory';
import ELBuilder from 'liteflow-editor-client/LiteFlowEditor/model/builder';
import { INodeData } from 'liteflow-editor-client/LiteFlowEditor/model/node';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, { useCallback, useRef } from 'react';
import styles from './index.module.less';

interface IProps {
  x: number;
  y: number;
  edge?: Edge;
  node?: Node;
  scene?: IContextPadScene;
  title?: string;
  visible: boolean;
  flowGraph: Graph;
}

const groups = [
  NODE_GROUP,
  SEQUENCE_GROUP,
  BRANCH_GROUP,
  CONTROL_GROUP,
  OTHER_GROUP,
];

const useStyles = createStyles(({ token, css }) => {
  return {
    editorContextPad: css`
      z-index: ${token.zIndexBase};
      position: fixed;
      min-width: 200px;
      box-shadow: ${token.boxShadow};
      background: ${token.colorBgContainer};
    `,
    editorContextPadHeader: css`
      display: flex;
      align-items: stretch;
      line-height: 20px;
      margin: 10px 12px;
    `,
    editorContextPadTitle: css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: ${token.fontSize}px;
    `,
    editorContextPadSearch: css`
      margin: 10px 12px;
    `,
    editorContextPadResults: css`
      margin: 7px 3px 7px 12px;
      max-height: 280px;
      overflow: auto;
      padding-right: 9px;
    `,
  };
});

const FlowGraphContextPad: React.FC<IProps> = (props) => {
  const menuRef = useRef(null);
  const {
    x,
    y,
    visible,
    flowGraph,
    edge,
    node,
    scene = 'append',
    title = '插入节点',
  } = props;

  const onClickAway = useCallback(
    () => flowGraph.trigger('graph:hideContextPad'),
    [flowGraph],
  );

  useClickAway(() => onClickAway(), menuRef);

  const onClickMenu = useCallback(
    (cellType: LiteFlowNode) => {
      if (edge) {
        let targetNode = edge.getTargetNode();
        let { model: targetModel } = targetNode?.getData<INodeData>() || {};
        const sourceNode = edge.getSourceNode();
        const { model: sourceModel } = sourceNode?.getData<INodeData>() || {};
        const inComingEdgesLength = (
          flowGraph.getIncomingEdges(targetNode as Node) || []
        ).length;
        if (
          inComingEdgesLength > 1 ||
          (sourceModel && targetModel?.isParentOf(sourceModel))
        ) {
          sourceModel?.append(
            ELBuilder.createELNode(cellType.type, targetModel),
          );
        } else {
          targetModel?.prepend(
            ELBuilder.createELNode(cellType.type, targetModel),
          );
        }
        history.push();
      } else if (node) {
        const { model } = node.getData() || {};
        if (scene === 'prepend') {
          model.prepend(ELBuilder.createELNode(cellType.type, model));
        } else if (scene === 'replace') {
          model.replace(ELBuilder.createELNode(cellType.type, model));
        } else {
          model.append(ELBuilder.createELNode(cellType.type, model));
        }
        history.push();
      }

      onClickAway();
    },
    [flowGraph, edge, node],
  );

  return !visible ? null : (
    <div
      ref={menuRef}
      className={styles.liteflowEditorContextPad}
      style={{ left: x, top: y }}
    >
      <div className={styles.liteflowEditorContextPadHeader}>
        <h3 className={styles.liteflowEditorContextPadTitle}>{title}</h3>
      </div>
      <div className={styles.liteflowEditorContextPadBody}>
        <div className={styles.liteflowEditorContextPadSearch}>
          <Input.Search placeholder="" />
        </div>
        <div className={styles.liteflowEditorContextPadResults}>
          {groups.map((group) => (
            <div
              key={group.key}
              className={styles.liteflowEditorContextPadGroup}
            >
              <div className={styles.liteflowEditorContextPadGroupName}>
                {group.name}
              </div>
              <div className={styles.liteflowEditorContextPadGroupItems}>
                {group.cellTypes.map((cellType, index) => (
                  <div
                    key={index}
                    className={styles.liteflowEditorContextPadGroupItem}
                    onClick={() => {
                      onClickMenu(cellType);
                    }}
                  >
                    <img
                      className={styles.liteflowEditorContextPadGroupItemIcon}
                      src={cellType.icon}
                    />
                    <div
                      className={styles.liteflowEditorContextPadGroupItemLabel}
                    >
                      {cellType.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowGraphContextPad;
