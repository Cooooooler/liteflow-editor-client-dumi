import { DownOutlined } from '@ant-design/icons';
import { Graph, StringExt } from '@antv/x6';
import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import classNames from 'classnames';
import { getIconByType } from 'liteflow-editor-client/LiteFlowEditor/cells';
import { getModel } from 'liteflow-editor-client/LiteFlowEditor/hooks/useModel';
import ELNode from 'liteflow-editor-client/LiteFlowEditor/model/node';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, { MouseEventHandler, useEffect, useState } from 'react';

interface IProps {
  flowGraph: Graph;
}

const useStyles = createStyles(({ token, css }) => {
  return {
    editorOutlineContainer: css`
      padding: ${token.paddingSM}px;

      .ant-tree .ant-tree-treenode {
        white-space: nowrap;
      }

      .ant-tree .ant-tree-node-content-wrapper {
        display: flex;
      }

      .ant-tree-title {
        flex: 1;
        transform: translateY(-2px);
      }

      .ant-tree-iconEle.ant-tree-icon__customize {
        transform: translateY(-2px);
      }
    `,
    editorOutlineIcon: css`
      img {
        width: 100%;
        height: 100%;
      }
    `,
    editorOutlineTitle: css`
      padding-left: ${token.paddingSM}px;
    `,
  };
});

const TreeNodeTitle: React.FC<{
  model: ELNode;
  onClick: MouseEventHandler<HTMLDivElement>;
}> = ({ model, onClick }) => {
  const { id, type } = model;
  const { styles } = useStyles();
  return (
    <div className={classNames(styles.editorOutlineTitle)} onClick={onClick}>
      <span>{id ? `${id} : ${type}` : type}</span>
    </div>
  );
};

const Outline: React.FC<IProps> = (props) => {
  const { flowGraph } = props;
  const { styles } = useStyles();

  const model = getModel();
  const initialkeys: string[] = [];
  const [treeData, setTreeData] = useState<DataNode[]>(
    model ? [transformer(model, initialkeys)] : [],
  );
  const [expandedKeys, setExpandedKeys] = useState<string[]>(initialkeys);

  function transformer(currentModel: ELNode, keys: string[]): DataNode {
    const handleClick = () => {
      flowGraph.cleanSelection();
      flowGraph.select(currentModel.getNodes());
      // flowGraph.centerCell(currentModel.getNodes()[0]);
      flowGraph.positionCell(currentModel.getNodes()[0], 'left', {
        padding: { left: 240 },
      });
      flowGraph.trigger('model:select', currentModel);
    };
    const key = `${currentModel.type}-${StringExt.uuid()}`;
    keys.push(key);
    const node: DataNode = {
      title: <TreeNodeTitle model={currentModel} onClick={handleClick} />,
      key,
      icon: (
        <div className={styles.editorOutlineIcon} onClick={handleClick}>
          <img src={getIconByType(currentModel.type)} />
        </div>
      ),
    };
    node.children = [];
    if (currentModel.condition) {
      node.children.push(transformer(currentModel.condition, keys));
    }
    if (currentModel.children) {
      node.children = node.children.concat(
        currentModel.children.map((item) => transformer(item, keys)),
      );
    }
    return node;
  }

  useEffect(() => {
    const handleModelChange = () => {
      const model = getModel();
      if (model) {
        const keys: string[] = [];
        setTreeData([transformer(model, keys)]);
        setExpandedKeys(keys);
        return;
      }
      setTreeData([]);
    };
    flowGraph.on('model:change', handleModelChange);
    return () => {
      flowGraph.off('model:change', handleModelChange);
    };
  }, [flowGraph, setTreeData]);

  return (
    <div className={styles.editorOutlineContainer}>
      <Tree
        blockNode
        showIcon
        showLine={{ showLeafIcon: false }}
        switcherIcon={<DownOutlined />}
        expandedKeys={expandedKeys}
        selectedKeys={[]}
        treeData={treeData}
      />
    </div>
  );
};

export default Outline;
