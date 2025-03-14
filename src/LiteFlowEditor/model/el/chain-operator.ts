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
import {
  ELEndNode,
  ELStartNode,
} from 'liteflow-editor-client/LiteFlowEditor/model/utils';

/**
 * 子流程操作符：CHAIN。
 *
 * 例如一个子流程(CHAIN)示例：
 * (1) EL表达式语法：t1 = THEN(a, b, c)
 * (2) JSON表示形式：
 * {
 type: ConditionTypeEnum.CHAIN,
 id: 't1',
 children: [
 { type: NodeTypeEnum.COMMON, id: 'a' },
 { type: NodeTypeEnum.COMMON, id: 'b' },,
 { type: NodeTypeEnum.COMMON, id: 'c' },
 ],
 }
 * (3) 通过ELNode节点模型进行表示的组合关系为：
 ┌─────────────────┐
 ┌──▶│  NodeOperator   │
 ┌─────────┐    ┌─────────────────┐  │   └─────────────────┘
 │  Chain  │───▶│  ChainOperator  │──┤   ┌─────────────────┐
 └─────────┘    └─────────────────┘  ├──▶│  NodeOperator   │
 │   └─────────────────┘
 │   ┌─────────────────┐
 └──▶│  NodeOperator   │
 └─────────────────┘
 */
export default class ChainOperator extends ELNode {
  type = ConditionTypeEnum.CHAIN;
  parent?: ELNode;
  children: ELNode[] = [];
  properties?: Properties;
  startNode?: Node;
  endNode?: Node;
  id?: string;

  constructor(
    parent?: ELNode,
    id?: string,
    children?: ELNode[],
    properties?: Properties,
    ids?: string,
    position?: { x: number; y: number },
  ) {
    super(ids, position);
    this.parent = parent;
    this.id = id || `Placeholder${Math.ceil(Math.random() * 10)}`;
    if (children) {
      this.children = children;
    }
    this.properties = properties;
    super.toggleCollapse(true);
  }

  /**
   * 创建新的节点
   * @param parent 新节点的父节点
   * @param type 新节点的子节点类型
   */
  public static create(parent?: ELNode, type?: NodeTypeEnum): ELNode {
    const newNode = new ChainOperator(parent);
    newNode.appendChild(NodeOperator.create(newNode, type));
    return newNode;
  }

  /**
   * 转换为X6的图数据格式
   */
  public toCells(options: Record<string, any> = {}): Cell[] {
    this.resetCells();
    const { id, children, cells } = this;
    const start = Node.create({
      shape: ConditionTypeEnum.CHAIN,
      attrs: {
        label: { text: id },
      },
      id: this.ids,
    });
    start.position(this?.position?.x ?? 0, this?.position?.y ?? 0);
    start.setData(
      {
        model: new ELStartNode(this),
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
    const { id } = this;
    if (prefix) {
      return `${prefix}${id}${this.propertiesToEL()}`;
    }
    return `${id}${this.propertiesToEL()}`;
  }
}
