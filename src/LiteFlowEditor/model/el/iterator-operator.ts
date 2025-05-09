import { Cell, Edge, Node } from '@antv/x6';
import {
  ConditionTypeEnum,
  LITEFLOW_EDGE,
  NODE_TYPE_INTERMEDIATE_END,
  NodeTypeEnum,
} from 'liteflow-editor-client/LiteFlowEditor/constant';
import NodeOperator from 'liteflow-editor-client/LiteFlowEditor/model/el/node-operator';
import ELNode, {
  Properties,
} from 'liteflow-editor-client/LiteFlowEditor/model/node';
import { ELEndNode } from 'liteflow-editor-client/LiteFlowEditor/model/utils';

/**
 * Iterator编排操作符：ITERATOR。
 *
 * 例如一个ITERATOR循环编排示例：
 * (1) EL表达式语法：ITERATOR(x).DO(THEN(a, b))
 * (2) JSON表示形式：
 * {
 type: ConditionTypeEnum.ITERATOR,
 condition: { type: NodeTypeEnum.ITERATOR, id: 'x' },
 children: [
 {
 type: ConditionTypeEnum.THEN,
 children: [
 { type: NodeTypeEnum.COMMON, id: 'a' },
 { type: NodeTypeEnum.COMMON, id: 'b' },
 ],
 },
 ],
 }
 * (3) 通过ELNode节点模型进行表示的组合关系为：
 ┌─────────────────┐
 ┌──▶│  NodeOperator   │
 ┌─────────┐    ┌──────────────────┐  │   └─────────────────┘      ┌─────────────────┐
 │  Chain  │───▶│ IteratorOperator │──┤   ┌─────────────────┐  ┌──▶│  NodeOperator   │
 └─────────┘    └──────────────────┘  └──▶│  ThenOperator   │──┤   └─────────────────┘
 └─────────────────┘  │   ┌─────────────────┐
 └──▶│  NodeOperator   │
 └─────────────────┘
 */
export default class IteratorOperator extends ELNode {
  type = ConditionTypeEnum.ITERATOR;
  parent?: ELNode;
  condition: ELNode = new NodeOperator(this, NodeTypeEnum.ITERATOR, 'x');
  children: ELNode[] = [];
  properties?: Properties;
  startNode?: Node;
  endNode?: Node;

  constructor(
    parent?: ELNode,
    condition?: ELNode,
    children?: ELNode[],
    properties?: Properties,
  ) {
    super();
    this.parent = parent;
    if (condition) {
      this.condition = condition;
    }
    if (children) {
      this.children = children;
    }
    this.properties = properties;
  }

  /**
   * 创建新的节点
   * @param parent 新节点的父节点
   * @param type 新节点的子节点类型
   */
  public static create(parent?: ELNode, type?: NodeTypeEnum): ELNode {
    const newNode = new IteratorOperator(parent);
    newNode.appendChild(NodeOperator.create(newNode, type));
    return newNode;
  }

  /**
   * 转换为X6的图数据格式
   */
  public toCells(options: Record<string, any> = {}): Cell[] {
    this.resetCells();
    const { condition, children, cells } = this;
    condition.toCells({
      shape: NodeTypeEnum.ITERATOR,
    });
    let start = condition.getStartNode();
    start.setData(
      {
        model: condition,
        toolbar: {
          prepend: true,
          append: true,
          delete: true,
          replace: true,
          collapse: true,
        },
      },
      { overwrite: true },
    );
    this.startNode = start;
    start = condition.getEndNode();

    if (!this.collapsed) {
      const end = Node.create({
        shape: NODE_TYPE_INTERMEDIATE_END,
        attrs: {
          label: { text: '' },
        },
      });
      end.setData(
        {
          model: new ELEndNode(this),
          toolbar: {
            prepend: true,
            append: true,
            delete: true,
            replace: true,
          },
        },
        { overwrite: true },
      );
      cells.push(this.addNode(end));
      this.endNode = end;

      if (children.length) {
        children.forEach((child) => {
          child.toCells(options);
          const nextStartNode = child.getStartNode();
          cells.push(
            Edge.create({
              shape: LITEFLOW_EDGE,
              source: start.id,
              target: nextStartNode.id,
            }),
          );
          const nextEndNode = child.getEndNode();
          cells.push(
            Edge.create({
              shape: LITEFLOW_EDGE,
              source: nextEndNode.id,
              target: end.id,
            }),
          );
        });
      } else {
        cells.push(
          Edge.create({
            shape: LITEFLOW_EDGE,
            source: start.id,
            target: end.id,
          }),
        );
      }
    }

    return this.getCells();
  }

  /**
   * 转换为EL表达式字符串
   */
  public toEL(prefix: string = ''): string {
    if (prefix) {
      return `${prefix}ITERATOR(${this.condition.toEL()}).DO(\n${this.children
        .map((x) => x.toEL(`${prefix}  `))
        .join(', \n')}\n${prefix})`;
    }
    return `ITERATOR(${this.condition.toEL()}).DO(${this.children
      .map((x) => x.toEL())
      .join(', ')})`;
  }
}
