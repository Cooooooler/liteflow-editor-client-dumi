import { Edge, Graph, Node } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Collapse, Typography } from 'antd';
import classNames from 'classnames';
import {
  BRANCH_GROUP,
  CONTROL_GROUP,
  IGroupItem,
  NODE_GROUP,
  OTHER_GROUP,
  SEQUENCE_GROUP,
} from 'liteflow-editor-client/LiteFlowEditor/cells';
import { findViewsFromPoint } from 'liteflow-editor-client/LiteFlowEditor/common/events';
import { history } from 'liteflow-editor-client/LiteFlowEditor/hooks/useHistory';
import { logger } from 'liteflow-editor-client/LiteFlowEditor/logger';
import ELBuilder from 'liteflow-editor-client/LiteFlowEditor/model/builder';
import { INodeData } from 'liteflow-editor-client/LiteFlowEditor/model/node';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const { Text } = Typography;

interface ISideBarProps {
  flowGraph: Graph;
}

const useStyles = createStyles(({ token, css }) => {
  return {
    editorSideBarCollapse: css`
      &.ant-collapse {
        border: 0;
        border-radius: 0;
      }
    `,
    shapeWrapper: css`
      display: flex;
      position: relative;
      cursor: pointer;
      pointer-events: auto;
    `,
    shapeSvg: css`
      height: 30px;
      aspect-ratio: 1;
      overflow: visible;
    `,
    editorSideBarPanelContent: css`
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: ${token.marginSM}px;
    `,
    editorSideBarCellContainer: css`
      display: flex;
      gap: ${token.marginSM}px;
      flex-direction: column;
      align-items: center;
    `,
    disabled: css`
      cursor: not-allowed;
      background-color: ${token.colorBgContainerDisabled};
      color: ${token.colorTextDisabled};
    `,
    editorSideBarCellText: css`
      width: 4em;
      text-align: center;
    `,
  };
});

interface IPanelContentProps {
  dnd: Dnd;
  cellTypes: LiteFlowNode[];
}

const View: React.FC<any> = (props) => {
  const { icon, ...rest } = props;
  const { styles } = useStyles();
  return (
    <div className={styles.shapeWrapper} {...rest}>
      <img className={styles.shapeSvg} src={icon}></img>
    </div>
  );
};

const PanelContent: React.FC<IPanelContentProps> = (props) => {
  const { dnd, cellTypes } = props;
  const { styles } = useStyles();
  const onMouseDown = (evt: any, node: LiteFlowNode) => {
    dnd.start(Node.create({ shape: node.shape, data: { node } }), evt);
  };
  return (
    <div className={styles.editorSideBarPanelContent}>
      {cellTypes.map((cellType, index) => {
        return (
          <div
            key={index}
            className={classNames(styles.editorSideBarCellContainer, {
              [styles.disabled]: cellType.disabled,
            })}
          >
            <View
              icon={cellType.icon}
              onMouseDown={(evt: any) => {
                if (!cellType.disabled) {
                  onMouseDown(evt, cellType);
                }
              }}
            />
            <Text className={styles.editorSideBarCellText}>
              {cellType.label}
            </Text>
          </div>
        );
      })}
    </div>
  );
};

const SideBar: React.FC<ISideBarProps> = (props) => {
  const { flowGraph } = props;
  const { styles } = useStyles();

  const lastEdgeRef = useRef<Edge | null>(null);
  useEffect(() => {
    const handleSetLastEdge = (args: any) => {
      if (!lastEdgeRef.current) {
        logger.info('handleSetLastEdge', args);
        // 保存边
        lastEdgeRef.current = args.edge;
      }
    };
    const handleResetLastEdge = () => {
      logger.info('handleResetLastEdge');
      lastEdgeRef.current = null;
    };
    // 鼠标悬浮在边上时，设置 lastEdgeRef，用于从工具栏拖动节点到边上时，松开鼠标后，将节点添加到边上
    flowGraph.on('edge:mouseover', handleSetLastEdge);
    flowGraph.on('edge:mouseleave', handleResetLastEdge);
    return () => {
      flowGraph.off('edge:mouseover', handleSetLastEdge);
      flowGraph.off('edge:mouseleave', handleResetLastEdge);
    };
  }, [flowGraph]);

  const [groups, setGroups] = useState<IGroupItem[]>([]);
  const dnd = useMemo(
    () =>
      new Dnd({
        target: flowGraph,
        scaled: true,
        validateNode: (droppingNode: Node) => {
          const position = droppingNode.getPosition();
          const size = droppingNode.getSize();
          const { node } = droppingNode.getData();
          // 拿到鼠标位置的边EdgeView，或者节点（这里一般是ReactShapeView）
          const cellViewsFromPoint = findViewsFromPoint(
            flowGraph,
            position.x + size.width / 2,
            position.y + size.height / 2,
          );
          if (lastEdgeRef.current) {
            const currentEdge = lastEdgeRef.current;
            if (currentEdge) {
              // 获取这条边指向的节点
              let targetNode = currentEdge.getTargetNode();
              // 获取这个targetNode节点的model
              let { model: targetModel } =
                targetNode?.getData<INodeData>() || {};
              // 获取这条边的源节点
              const sourceNode = currentEdge.getSourceNode();
              // 获取这个sourceNode节点的model
              const { model: sourceModel } =
                sourceNode?.getData<INodeData>() || {};
              // 获取这个targetNode节点的入边数量
              const inComingEdgesLength = (
                flowGraph.getIncomingEdges(targetNode as Node) || []
              ).length;
              // 如果这个targetNode节点的入边数量大于1，或者这个targetNode节点的model是这个sourceNode节点的子节点，则将这个节点添加到这个targetNode节点的model中
              if (
                inComingEdgesLength > 1 ||
                (sourceModel && targetModel?.isParentOf(sourceModel))
              ) {
                sourceModel?.append(
                  ELBuilder.createELNode(node.type, targetModel),
                );
              } else {
                targetModel?.prepend(
                  ELBuilder.createELNode(node.type, targetModel),
                );
              }
              history.push();
            }
          }
          const cellViews =
            cellViewsFromPoint.filter((cellView) => cellView.isNodeView()) ||
            [];
          if (cellViews && cellViews.length) {
            const currentNode = flowGraph.getCellById(
              cellViews[cellViews.length - 1].cell.id,
            ) as Node | null;
            if (currentNode) {
              let { model } = currentNode.getData<INodeData>();
              model?.replace(ELBuilder.createELNode(node.type as any));
              history.push();
            }
          }
          return false;
        },
      }),
    [flowGraph],
  );

  // life
  useEffect(() => {
    setGroups([
      SEQUENCE_GROUP,
      BRANCH_GROUP,
      CONTROL_GROUP,
      OTHER_GROUP,
      NODE_GROUP,
    ]);
  }, [setGroups]);

  return (
    <Collapse
      className={styles.editorSideBarCollapse}
      defaultActiveKey={['node', 'sequence', 'branch', 'control', 'other']}
      items={groups.map((group) => ({
        key: group.key,
        label: group.name,
        children: <PanelContent dnd={dnd} cellTypes={group.cellTypes} />,
      }))}
    />
  );
};

export default SideBar;
