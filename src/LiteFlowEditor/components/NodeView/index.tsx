import { Node } from '@antv/x6';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

import styles from './index.module.less';

const NodeView: React.FC<{
  icon: string;
  node: Node;
  label: string;
  children: ReactNode;
}> = (props) => {
  const { icon, children, label, node } = props;
  const idText = (node.getAttrs()?.label.text as string) || label;
  const { highlight = false } = (node.getAttrs()?.body || {}) as {
    highlight: boolean;
  };
  return (
    <div className={classNames(styles.liteflowShapeWrapper)}>
      <img className={styles.liteflowShapeSvg} src={icon}></img>
      {children}
      <div className={styles.liteflowShapeText}>{idText}</div>
    </div>
  );
};

export default NodeView;
