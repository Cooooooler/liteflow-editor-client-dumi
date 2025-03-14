import '@antv/x6-react-shape';
import { register } from '@antv/x6-react-shape';
import {
  ConditionTypeEnum,
  NODE_HEIGHT,
  NODE_TYPE_INTERMEDIATE_END,
  NODE_WIDTH,
  NodeTypeEnum,
} from 'liteflow-editor-client/LiteFlowEditor/constant';
import React from 'react';
/** AntV X6自定义节点 */
// 开始 & 结束
import { default as End } from 'liteflow-editor-client/LiteFlowEditor/cells/end';
import { default as Start } from 'liteflow-editor-client/LiteFlowEditor/cells/start';
// 顺序：串行、并行
import { default as Common } from 'liteflow-editor-client/LiteFlowEditor/cells/common';
import { default as IntermediateEnd } from 'liteflow-editor-client/LiteFlowEditor/cells/intermediate-end';
import { default as Then } from 'liteflow-editor-client/LiteFlowEditor/cells/then';
import { default as When } from 'liteflow-editor-client/LiteFlowEditor/cells/when';
// 分支：选择、条件
import { default as If } from 'liteflow-editor-client/LiteFlowEditor/cells/if';
import { default as Switch } from 'liteflow-editor-client/LiteFlowEditor/cells/switch';
// 循环：For、While
import { default as For } from 'liteflow-editor-client/LiteFlowEditor/cells/for';
import { default as Iterator } from 'liteflow-editor-client/LiteFlowEditor/cells/iterator';
import { default as While } from 'liteflow-editor-client/LiteFlowEditor/cells/while';
// 捕获异常：Catch
import { default as Catch } from 'liteflow-editor-client/LiteFlowEditor/cells/catch';
// 运算符：与或非
import { default as And } from 'liteflow-editor-client/LiteFlowEditor/cells/and';
import { default as Not } from 'liteflow-editor-client/LiteFlowEditor/cells/not';
import { default as Or } from 'liteflow-editor-client/LiteFlowEditor/cells/or';
// 子流程：Chain
import { default as Chain } from 'liteflow-editor-client/LiteFlowEditor/cells/chain';
// 其他辅助节点：虚节点
import { default as Virtual } from 'liteflow-editor-client/LiteFlowEditor/cells/virtual';
// AntV X6自定义节点的视图：使用React组件
import {
  NodeBadge,
  NodeToolBar,
  NodeView,
} from 'liteflow-editor-client/LiteFlowEditor/components';

/** 注册自定义节点到AntV X6 */
[
  Start,
  End,
  Then,
  When,
  Common,
  IntermediateEnd,
  If,
  Switch,
  For,
  While,
  Iterator,
  Catch,
  And,
  Or,
  Not,
  Virtual,
  Chain,
].forEach((cell: LiteFlowNode) => {
  const { type, label, icon, node = {} } = cell;
  register({
    shape: type,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    component: ({ node }) => (
      <NodeView node={node} icon={icon} label={label}>
        <NodeBadge node={node} />
        <NodeToolBar node={node} />
      </NodeView>
    ),
    attrs: {
      label: {
        refX: 0.5,
        refY: '100%',
        refY2: 20,
        text: label,
        fill: '#333',
        fontSize: 13,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        textWrap: {
          width: 80,
          height: 60,
          ellipsis: true,
          breakWord: true,
        },
      },
    },
    ...node,
  });
});

export {
  And,
  Catch,
  Chain,
  Common,
  End,
  For,
  If,
  IntermediateEnd,
  Iterator,
  Not,
  Or,
  Start,
  Switch,
  Then,
  Virtual,
  When,
  While,
};

export interface IGroupItem {
  key: string;
  name: string;
  cellTypes: LiteFlowNode[];
}

export const NODE_GROUP: IGroupItem = {
  key: 'node',
  name: '节点类',
  cellTypes: [{ ...Common, type: NodeTypeEnum.COMMON, shape: Common.type }],
};

export const SEQUENCE_GROUP: IGroupItem = {
  key: 'sequence',
  name: '顺序类',
  cellTypes: [
    { ...Then, type: ConditionTypeEnum.THEN, shape: Then.type },
    { ...When, type: ConditionTypeEnum.WHEN, shape: When.type },
  ],
};

export const BRANCH_GROUP: IGroupItem = {
  key: 'branch',
  name: '分支类',
  cellTypes: [
    { ...Switch, type: ConditionTypeEnum.SWITCH, shape: Switch.type },
    { ...If, type: ConditionTypeEnum.IF, shape: If.type },
  ],
};

export const CONTROL_GROUP: IGroupItem = {
  key: 'control',
  name: '循环类',
  cellTypes: [
    { ...For, type: ConditionTypeEnum.FOR, shape: For.type },
    { ...While, type: ConditionTypeEnum.WHILE, shape: While.type },
    { ...Iterator, type: ConditionTypeEnum.ITERATOR, shape: Iterator.type },
  ],
};

export const OTHER_GROUP: IGroupItem = {
  key: 'other',
  name: '其他类',
  cellTypes: [
    { ...Catch, type: ConditionTypeEnum.CATCH, shape: Catch.type },
    { ...And, type: ConditionTypeEnum.AND, shape: And.type },
    { ...Or, type: ConditionTypeEnum.OR, shape: Or.type },
    { ...Not, type: ConditionTypeEnum.NOT, shape: Not.type },
    { ...Chain, type: ConditionTypeEnum.CHAIN, shape: Chain.type },
  ],
};

export const getIconByType = (nodeType: ConditionTypeEnum | NodeTypeEnum) => {
  switch (nodeType) {
    case ConditionTypeEnum.THEN:
      return Then.icon;
    case ConditionTypeEnum.WHEN:
      return When.icon;
    case ConditionTypeEnum.SWITCH:
    case NodeTypeEnum.SWITCH:
      return Switch.icon;
    case ConditionTypeEnum.IF:
    case NodeTypeEnum.IF:
      return If.icon;
    case ConditionTypeEnum.FOR:
    case NodeTypeEnum.FOR:
      return For.icon;
    case ConditionTypeEnum.WHILE:
    case NodeTypeEnum.WHILE:
      return While.icon;
    case ConditionTypeEnum.ITERATOR:
    case NodeTypeEnum.ITERATOR:
      return Iterator.icon;
    case ConditionTypeEnum.CHAIN:
      return Chain.icon;
    case ConditionTypeEnum.CATCH:
      return Catch.icon;
    case ConditionTypeEnum.AND:
      return And.icon;
    case ConditionTypeEnum.OR:
      return Or.icon;
    case ConditionTypeEnum.NOT:
      return Not.icon;
    case NodeTypeEnum.COMMON:
    default:
      return Common.icon;
  }
};

export function getNodeShapeByType(nodeType: NodeTypeEnum): string {
  switch (nodeType) {
    case NodeTypeEnum.BOOLEAN:
    case NodeTypeEnum.BOOLEAN_SCRIPT:
    case NodeTypeEnum.IF:
    case NodeTypeEnum.IF_SCRIPT:
      return NodeTypeEnum.IF;
    case NodeTypeEnum.SWITCH:
    case NodeTypeEnum.SWITCH_SCRIPT:
      return NodeTypeEnum.SWITCH;
    case NodeTypeEnum.FOR:
    case NodeTypeEnum.FOR_SCRIPT:
      return NodeTypeEnum.FOR;
    case NodeTypeEnum.WHILE:
    case NodeTypeEnum.WHILE_SCRIPT:
      return NodeTypeEnum.WHILE;
    case NodeTypeEnum.ITERATOR:
      return NodeTypeEnum.ITERATOR;
    case NodeTypeEnum.BREAK:
    case NodeTypeEnum.BREAK_SCRIPT:
      return NODE_TYPE_INTERMEDIATE_END;
    case NodeTypeEnum.VIRTUAL:
      return NodeTypeEnum.VIRTUAL;
    case NodeTypeEnum.COMMON:
    case NodeTypeEnum.FALLBACK:
    case NodeTypeEnum.SCRIPT:
    default:
      return NodeTypeEnum.COMMON;
  }
}
