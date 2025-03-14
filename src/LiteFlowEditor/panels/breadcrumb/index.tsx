import { HomeOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import { Breadcrumb } from 'antd';
import { getIconByType } from 'liteflow-editor-client/LiteFlowEditor/cells';
import ELNode from 'liteflow-editor-client/LiteFlowEditor/model/node';
import React, { useEffect, useReducer, useState } from 'react';
import styles from './index.module.less';

interface IProps {
  flowGraph: Graph;
}

const BreadcrumbPath: React.FC<IProps> = (props) => {
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
    <div className={styles.liteflowEditorBreadcrumb}>
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
                <div onClick={handleClick} className={styles.breadcrumb_item}>
                  <img
                    className={styles.liteflowEditorBreadcrumbIcon}
                    src={icon}
                  />
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
