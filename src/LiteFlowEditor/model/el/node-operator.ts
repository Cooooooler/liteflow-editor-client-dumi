import { Cell, Node } from '@antv/x6';
import { getNodeShapeByType } from 'liteflow-editor-client/LiteFlowEditor/cells';
import { NodeTypeEnum } from 'liteflow-editor-client/LiteFlowEditor/constant';
import ELNode, {
  Properties,
} from 'liteflow-editor-client/LiteFlowEditor/model/node';

/**
 * 节点组件操作符：是EL表达式树型结构的叶子结点。
 *
 * 例如一个串行编排(THEN)：
 * (1) EL表达式形式：THEN(a, b, c, d)
 * (2) JSON表示形式：
 * {
 type: ConditionTypeEnum.THEN,
 children: [
 { type: NodeTypeEnum.COMMON, id: 'a' },
 { type: NodeTypeEnum.COMMON, id: 'b' },
 { type: NodeTypeEnum.COMMON, id: 'c' },
 { type: NodeTypeEnum.COMMON, id: 'd' },
 ],
 }
 * (3) 通过ELNode节点模型进行表示的组合关系为：
 ┌─────────────────┐
 ┌──▶│  NodeOperator   │
 │   └─────────────────┘
 │   ┌─────────────────┐
 ├──▶│  NodeOperator   │
 ┌─────────┐    ┌─────────────────┐  │   └─────────────────┘
 │  Chain  │───▶│  ThenOperator   │──┤   ┌─────────────────┐
 └─────────┘    └─────────────────┘  ├──▶│  NodeOperator   │
 │   └─────────────────┘
 │   ┌─────────────────┐
 └──▶│  NodeOperator   │
 └─────────────────┘
 */
export default class NodeOperator extends ELNode {
  type: NodeTypeEnum;
  parent?: ELNode;
  id: string;
  node?: Node;

  constructor(
    parent?: ELNode,
    type?: NodeTypeEnum,
    id?: string,
    properties?: Properties,
    ids?: string,
    position?: { x: number; y: number },
    highlight?: boolean,
  ) {
    super(ids, position, highlight);
    this.parent = parent;
    this.type = type || NodeTypeEnum.COMMON;
    this.id = id || `Placeholder${Math.ceil(Math.random() * 10)}`;
    this.properties = properties;
  }

  /**
   * 创建新的节点
   * @param parent 新节点的父节点
   * @param type 新节点的节点类型
   * @param id 新节点的节点Id
   */
  public static create(
    parent?: ELNode,
    type?: NodeTypeEnum,
    id?: string,
  ): ELNode {
    return new NodeOperator(parent, type, id);
  }

  /**
   * 转换为X6的图数据格式
   */
  // :TODO id
  public toCells(options: Record<string, any> = {}): Cell[] {
    if (!this.node) {
      this.resetCells();
      const { id, type, cells } = this;
      const node = Node.create({
        shape: getNodeShapeByType(type),
        attrs: {
          label: { text: id },
          body: {
            highlight: this.highlight ?? false,
          },
        },
        id: this.ids,
        ...(options || {}),
      });
      node.position(this?.position?.x ?? 0, this?.position?.y ?? 0);
      node.setData({ model: this }, { overwrite: true });
      cells.push(this.addNode(node));
      this.node = node;
    }

    return this.getCells();
  }

  /**
   * 获取当前节点的开始节点
   */
  public getStartNode(): Node {
    return this.node as Node;
  }

  /**
   * 获取当前节点的结束节点
   */
  public getEndNode(): Node {
    return this.node as Node;
  }

  /**
   * 转换为EL表达式字符串
   */
  public toEL(prefix: string = ''): string {
    return `${prefix}${this.id}${this.propertiesToEL()}`;
  }
}
