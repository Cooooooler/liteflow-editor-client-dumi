import { Node } from '@antv/x6';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';

const useStyles = createStyles(({ token, css }) => {
  return {
    shapeWrapper: css`
      position: relative;
      font-size: ${token.fontSize}px;
      cursor: pointer;
      pointer-events: auto;
      width: 100%;
      height: 100%;
    `,
    shapeSvg: css`
      width: 100%;
      height: 100%;
      overflow: visible;
    `,
    shapeText: css`
      margin-top: 6px;
      font-size: ${token.fontSize}px;
      pointer-events: none;
      width: 100%;
      height: 100%;
      text-align: center;
    `,
  };
});

const NodeView: React.FC<{
  icon: string;
  node: Node;
  label: string;
  children: ReactNode;
}> = (props) => {
  const { styles } = useStyles();
  const { icon, children, label, node } = props;
  const idText = (node.getAttrs()?.label.text as string) || label;
  return (
    <div className={classNames(styles.shapeWrapper)}>
      <img className={styles.shapeSvg} src={icon}></img>
      {children}
      <div
        className={classNames(styles.shapeText, 'liteflow-editor-node-text')}
      >
        {idText}
      </div>
    </div>
  );
};

export default NodeView;
