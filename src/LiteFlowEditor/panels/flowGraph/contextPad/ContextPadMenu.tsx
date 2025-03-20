import { Edge, Graph, Node } from '@antv/x6';
import { MenuProps, Typography } from 'antd';
import {
  BRANCH_GROUP,
  CONTROL_GROUP,
  NODE_GROUP,
  OTHER_GROUP,
  SEQUENCE_GROUP,
} from 'liteflow-editor-client/LiteFlowEditor/cells';
import GraphContext from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import { history } from 'liteflow-editor-client/LiteFlowEditor/hooks/useHistory';
import ELBuilder from 'liteflow-editor-client/LiteFlowEditor/model/builder';
import { INodeData } from 'liteflow-editor-client/LiteFlowEditor/model/node';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, { useCallback, useContext } from 'react';

const groups = [
  NODE_GROUP,
  SEQUENCE_GROUP,
  BRANCH_GROUP,
  CONTROL_GROUP,
  OTHER_GROUP,
];

interface IProps {
  edge?: Edge;
  node?: Node;
  scene?: IContextPadScene;
  title?: string;
  flowGraph?: Graph;
}

const { Text } = Typography;

const useStyles = createStyles(({ token, css }) => {
  return {
    groupComponent: css`
      height: 100%;
      width: 100%;
      display: flex;
      gap: ${token.marginXS}px;
      align-items: center;
    `,
  };
});

const GroupComponent: React.FC<{ cell: LiteFlowNode; extraProps: IProps }> = ({
  cell,
  extraProps,
}) => {
  const { styles } = useStyles();
  const { edge, node, scene, flowGraph } = extraProps;
  const { graph: flowGraphContext } = useContext(GraphContext);
  const graph = flowGraph ?? flowGraphContext;

  const onClickMenu = useCallback(() => {
    if (edge) {
      let targetNode = edge.getTargetNode();
      let { model: targetModel } = targetNode?.getData<INodeData>() || {};
      const sourceNode = edge.getSourceNode();
      const { model: sourceModel } = sourceNode?.getData<INodeData>() || {};
      const inComingEdgesLength = (
        graph.getIncomingEdges(targetNode as Node) || []
      ).length;
      if (
        inComingEdgesLength > 1 ||
        (sourceModel && targetModel?.isParentOf(sourceModel))
      ) {
        sourceModel?.append(ELBuilder.createELNode(cell.type, targetModel));
      } else {
        targetModel?.prepend(ELBuilder.createELNode(cell.type, targetModel));
      }
      history.push();
    } else if (node) {
      const { model } = node.getData() || {};
      if (scene === 'prepend') {
        model.prepend(ELBuilder.createELNode(cell.type, model));
      } else if (scene === 'replace') {
        model.replace(ELBuilder.createELNode(cell.type, model));
      } else {
        model.append(ELBuilder.createELNode(cell.type, model));
      }
      history.push();
    }
  }, [graph, edge, node]);

  return (
    <div
      className={styles.groupComponent}
      key={cell.type}
      onClick={onClickMenu}
    >
      <img src={cell.icon} />
      <span>{cell.label}</span>
    </div>
  );
};

const Group = (cell: LiteFlowNode, props: IProps) => {
  return <GroupComponent cell={cell} extraProps={props} />;
};

const getContextPadMenu = (props: IProps): MenuProps['items'] => {
  const { title } = props;
  return [
    {
      key: 'title',
      label: <Text strong>{title ?? '插入节点'}</Text>,
      disabled: true,
    },
    {
      type: 'divider',
    },
    ...groups.map((item) => ({
      key: item.key,
      label: item.name,
      children: item.cellTypes.map((cell) => ({
        key: cell.type,
        label: Group(cell, props),
      })),
    })),
  ];
};

export default getContextPadMenu;
