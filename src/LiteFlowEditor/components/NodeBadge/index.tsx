import { Node } from '@antv/x6';
import { getIconByType } from 'liteflow-editor-client/LiteFlowEditor/cells';
import {
  ConditionTypeEnum,
  NODE_TYPE_INTERMEDIATE_END,
  NodeTypeEnum,
} from 'liteflow-editor-client/LiteFlowEditor/constant';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React from 'react';

const useStyles = createStyles(({ css }) => {
  return {
    ShapeBadgeSvg: css`
      position: absolute;
      top: 0;
      right: -4px;
      width: 18px;
      height: 18px;
      text-align: center;
    `,
  };
});

const NodeBadge: React.FC<{ node: Node }> = (props) => {
  const { styles } = useStyles();
  const { node } = props;
  const { model } = node.getData();
  let badge = null;
  if (model) {
    const currentModel = model.proxy || model;
    if (
      currentModel.type !== node.shape &&
      currentModel.type !== NodeTypeEnum.COMMON &&
      currentModel.type !== NodeTypeEnum.BOOLEAN &&
      currentModel.type !== NodeTypeEnum.VIRTUAL &&
      currentModel.type !== ConditionTypeEnum.CHAIN &&
      NODE_TYPE_INTERMEDIATE_END !== node.shape
    ) {
      badge = (
        <img
          className={styles.ShapeBadgeSvg}
          src={getIconByType(currentModel.type)}
        ></img>
      );
    }
  }
  return badge;
};

export default NodeBadge;
