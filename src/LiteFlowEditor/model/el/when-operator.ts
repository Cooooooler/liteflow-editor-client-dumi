import { Cell, Node, Edge } from '@antv/x6';
import ELNode, { Properties } from 'liteflow-editor-client/LiteFlowEditor/model/node';
import { ELStartNode, ELEndNode } from 'liteflow-editor-client/LiteFlowEditor/model/utils';
import {
  ConditionTypeEnum,
  LITEFLOW_EDGE,
  NODE_TYPE_INTERMEDIATE_END,
  NodeTypeEnum,
} from 'liteflow-editor-client/LiteFlowEditor/constant';
import NodeOperator from 'liteflow-editor-client/LiteFlowEditor/model/el/node-operator';

/**
 * 并行编排操作符：WHEN。
 *
 * 例如一个并行编排(WHEN)示例：
 * (1) EL表达式语法：THEN(a, WHEN(b, c, d), e)
 * (2) JSON表示形式：
 * {
    type: ConditionTypeEnum.THEN,
    children: [
      { type: NodeTypeEnum.COMMON, id: 'a' },
      {
        type: ConditionTypeEnum.WHEN,
        children: [
          { type: NodeTypeEnum.COMMON, id: 'b' },
          { type: NodeTypeEnum.COMMON, id: 'c' },
          { type: NodeTypeEnum.COMMON, id: 'd' },
        ],
      },
      { type: NodeTypeEnum.COMMON, id: 'e' },
    ],
  }
  * (3) 通过ELNode节点模型进行表示的组合关系为：
                                          ┌─────────────────┐      ┌─────────────────┐
                                      ┌──▶│  NodeOperator   │  ┌──▶│  NodeOperator   │
  ┌─────────┐    ┌─────────────────┐  │   └─────────────────┘  │   └─────────────────┘
  │  Chain  │───▶│  ThenOperator   │──┤   ┌─────────────────┐  │   ┌─────────────────┐
  └─────────┘    └─────────────────┘  ├──▶│  WhenOperator   │──┼──▶│  NodeOperator   │
                                      │   └─────────────────┘  │   └─────────────────┘
                                      │   ┌─────────────────┐  │   ┌─────────────────┐
                                      └──▶│  NodeOperator   │  └──▶│  NodeOperator   │
                                          └─────────────────┘      └─────────────────┘
 */
export default class WhenOperator extends ELNode {
  type = ConditionTypeEnum.WHEN;
  parent?: ELNode;
  children: ELNode[] = [];
  properties?: Properties;
  startNode?: Node;
  endNode?: Node;

  constructor(parent?: ELNode, children?: ELNode[], properties?: Properties) {
    super();
    this.parent = parent;
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
    const newNode = new WhenOperator(parent);
    newNode.appendChild(NodeOperator.create(newNode, type));
    return newNode;
  }

  /**
   * 转换为X6的图数据格式
   */
  public toCells(options: Record<string, any> = {}): Cell[] {
    this.resetCells();
    const { children, cells } = this;
    const start = Node.create({
      shape: ConditionTypeEnum.WHEN,
      attrs: {
        label: { text: '' },
      },
    });
    start.setData({
      model: new ELStartNode(this),
      toolbar: {
        prepend: true,
        append: true,
        delete: true,
        replace: true,
        collapse: true,
      },
    }, { overwrite: true });
    cells.push(this.addNode(start));
    this.startNode = start;

    if (!this.collapsed) {
      const end = Node.create({
        shape: NODE_TYPE_INTERMEDIATE_END,
        attrs: {
          label: { text: '' },
        },
      });
      end.setData({ model: new ELEndNode(this) }, { overwrite: true });
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
    const { type } = this;
    if (prefix) {
      return `${prefix}${type}(\n${this.children
        .map((x) => x.toEL(`${prefix}  `))
        .join(', \n')}\n${prefix})${this.propertiesToEL()}`;
    }
    return `${type}(${this.children
      .map((x) => x.toEL())
      .join(', ')})${this.propertiesToEL()}`;
  }
}
