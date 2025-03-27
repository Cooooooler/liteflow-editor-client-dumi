import { Graph } from '@antv/x6';
import { MenuProps } from 'antd';
import GraphContext from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import {
  blankMenuConfig,
  nodeMenuConfig,
} from 'liteflow-editor-client/LiteFlowEditor/panels/flowGraph/contextMenu/menuConfig';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, { useContext } from 'react';

interface IProps {
  scene: 'node' | 'blank';
  flowGraph?: Graph;
}

interface IMenuConfig {
  key: string;
  title: string;
  icon?: React.ReactElement;
  children?: IMenuConfig[];
  showDividerBehind?: boolean;
  disabled?: boolean | ((flowGraph: Graph) => boolean);
  handler: (flowGraph: Graph) => void;
}

const useStyles = createStyles(({ token, css }) => {
  return {
    groupComponent: css`
      height: 100%;
      width: 100%;
      display: flex;
      gap: ${token.marginSM}px;
      align-items: center;
    `,
  };
});

const GroupComponent: React.FC<{ item: IMenuConfig; extraProps: IProps }> = ({
  item,
  extraProps,
}) => {
  const { icon, handler, key, title } = item;
  const { styles } = useStyles();
  const { flowGraph } = extraProps;
  const { graph: flowGraphContext } = useContext(GraphContext);
  const graph = flowGraph ?? flowGraphContext;
  const Icon = () => icon;

  const onClickMenu = () => {
    handler(graph);
  };

  return (
    <div className={styles.groupComponent} key={key} onClick={onClickMenu}>
      <Icon />
      <span>{title}</span>
    </div>
  );
};

const Group = (item: IMenuConfig, props: IProps) => {
  return <GroupComponent item={item} extraProps={props} />;
};

const getContextMenu = (props: IProps): MenuProps['items'] => {
  const { scene } = props;
  const menuConfigMap: { [scene in 'node' | 'blank']: IMenuConfig[] } = {
    node: nodeMenuConfig,
    blank: blankMenuConfig,
  };
  const menuConfig = menuConfigMap[scene];

  return [
    ...menuConfig.map((item) => ({
      key: item.key,
      label: Group(item, props),
    })),
  ];
};

export default getContextMenu;
