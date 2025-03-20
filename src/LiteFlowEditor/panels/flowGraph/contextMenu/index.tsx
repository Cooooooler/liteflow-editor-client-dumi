import React, { useCallback, useRef } from 'react';

import { Graph } from '@antv/x6';
import { Menu } from 'antd';
import useClickAway from 'liteflow-editor-client/LiteFlowEditor/hooks/useClickAway';
import {
  blankMenuConfig,
  nodeMenuConfig,
} from 'liteflow-editor-client/LiteFlowEditor/panels/flowGraph/contextMenu/menuConfig';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';

interface IProps {
  x: number;
  y: number;
  scene: string;
  visible: boolean;
  flowGraph: Graph;
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

const menuConfigMap: { [scene: string]: IMenuConfig[] } = {
  node: nodeMenuConfig,
  blank: blankMenuConfig,
};

const useStyles = createStyles(({ token, css }) => {
  return {
    editorContextMenu: css`
      z-index: ${token.zIndexBase};
      position: fixed;
      min-width: 200px;
      box-shadow: ${token.boxShadow};
    `,
  };
});

const FlowGraphContextMenu: React.FC<IProps> = (props) => {
  const { styles } = useStyles();
  const menuRef = useRef(null);
  const { x, y, scene, visible, flowGraph } = props;
  const menuConfig = menuConfigMap[scene];

  const onClickAway = useCallback(
    () => flowGraph.trigger('graph:hideContextMenu'),
    [flowGraph],
  );

  useClickAway(() => onClickAway(), menuRef);

  const Helper = {
    makeMenuHandlerMap(config: IMenuConfig[]) {
      const queue = config.slice(0);
      const handlerMap: { [key: string]: (flowGraph: Graph) => void } = {};
      while (queue.length > 0) {
        const { key, handler, children } = queue.pop() as IMenuConfig;
        if (children && children.length > 0) {
          queue.push(...children);
        } else {
          handlerMap[key] = handler;
        }
      }
      return handlerMap;
    },
    makeMenuContent(flowGraph: Graph, menuConfig: IMenuConfig[]) {
      const loop = (config: IMenuConfig[]) => {
        return config.map((item) => {
          let content = null;
          let {
            key,
            title,
            icon,
            children,
            disabled = false,
            showDividerBehind,
          } = item;
          if (typeof disabled === 'function') {
            disabled = disabled(flowGraph);
          }
          if (children && children.length > 0) {
            content = (
              <Menu.SubMenu
                key={key}
                icon={icon}
                title={title}
                disabled={disabled}
              >
                {loop(children)}
              </Menu.SubMenu>
            );
          } else {
            content = (
              <Menu.Item key={key} icon={icon} disabled={disabled}>
                {title}
              </Menu.Item>
            );
          }
          return [content, showDividerBehind && <Menu.Divider />];
        });
      };
      return loop(menuConfig);
    },
  };

  const onClickMenu = useCallback(
    ({ key }: { key: string }) => {
      const handlerMap = Helper.makeMenuHandlerMap(menuConfig);
      const handler = handlerMap[key];
      if (handler) {
        onClickAway();
        handler(flowGraph);
      }
    },
    [flowGraph, menuConfig],
  );

  return !visible ? null : (
    <div
      ref={menuRef}
      className={styles.editorContextMenu}
      style={{ left: x, top: y }}
    >
      <Menu mode={'vertical'} selectable={false} onClick={onClickMenu}>
        {Helper.makeMenuContent(flowGraph, menuConfig)}
      </Menu>
    </div>
  );
};

export default FlowGraphContextMenu;
