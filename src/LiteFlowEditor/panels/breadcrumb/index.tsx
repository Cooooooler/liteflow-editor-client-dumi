import { HomeOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import { Breadcrumb } from 'antd';
import { getIconByType } from 'liteflow-editor-client/LiteFlowEditor/cells';
import ELNode from 'liteflow-editor-client/LiteFlowEditor/model/node';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, { useEffect, useReducer, useState } from 'react';

interface IProps {
  flowGraph: Graph;
}

const useStyles = createStyles(({ token, css }) => {
  return {
    editorBreadcrumb: css`
      position: absolute;
      left: 8px;
      bottom: 12px;
      height: 36px;
      padding: 6px;
      border-radius: 2px;
      background-color: #fff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
      user-select: none;

      :global {
        .ant-breadcrumb-link {
          cursor: pointer;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    `,
    breadcrumbItem: css`
      display: flex;
      align-items: center;
    `,
    editorBreadcrumbIcon: css`
      width: 16px;
      height: 16px;
      margin-right: 4px;
      margin-top: -4px;
    `,
  };
});

const BreadcrumbPath: React.FC<IProps> = (props) => {
  const { styles } = useStyles();
  const { flowGraph } = props;

  const [selectedModel, setSelectedModel] = useState<ELNode | null>(null);

  const forceUpdate = useReducer((n) => n + 1, 0)[1];
  useEffect(() => {
    const handler = () => {
      setSelectedModel(null);
      forceUpdate();
    };
    const handleSelect = (component: ELNode) => {
      setSelectedModel(component);
    };
    flowGraph.on('settingBar:forceUpdate', handler);
    flowGraph.on('model:select', handleSelect);
    return () => {
      flowGraph.off('settingBar:forceUpdate', handler);
      flowGraph.off('model:select', handleSelect);
    };
  }, [flowGraph, setSelectedModel, forceUpdate]);

  const nodes = flowGraph.getSelectedCells().filter((v) => !v.isEdge());
  const parents: ELNode[] = [];
  if (selectedModel || nodes.length === 1) {
    const currentModel = selectedModel || nodes[0].getData().model;
    let nextModel = currentModel.proxy || currentModel;
    while (nextModel) {
      if (nextModel.parent) {
        parents.splice(0, 0, nextModel);
      }
      nextModel = nextModel.parent;
    }
  }

  const handleSelectModel = (selectedModel: ELNode) => {
    flowGraph.trigger('model:select', selectedModel);
  };

  return (
    <div className={styles.editorBreadcrumb}>
      <Breadcrumb
        items={[
          {
            key: 'home',
            title: <HomeOutlined />,
          },
          ...parents.map((elNodeModel: ELNode, index: number) => {
            const icon = getIconByType(elNodeModel.type);
            const handleClick = () => {
              flowGraph.cleanSelection();
              flowGraph.select(elNodeModel.getNodes());
              setSelectedModel(elNodeModel);
              handleSelectModel(elNodeModel);
            };
            return {
              key: elNodeModel.ids ?? index,
              title: (
                <div onClick={handleClick} className={styles.breadcrumbItem}>
                  <img className={styles.editorBreadcrumbIcon} src={icon} />
                  <span>{elNodeModel.type}</span>
                </div>
              ),
            };
          }),
        ]}
      />
    </div>
  );
};

export default BreadcrumbPath;
