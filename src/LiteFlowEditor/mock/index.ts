import {
  ConditionTypeEnum,
  NodeTypeEnum,
} from 'liteflow-editor-client/LiteFlowEditor/constant';

export default {
  // 串行编排(THEN)
  THEN: {
    type: ConditionTypeEnum.THEN,
    children: [
      { type: NodeTypeEnum.COMMON, id: 'a' },
      { type: NodeTypeEnum.COMMON, id: 'b' },
      { type: NodeTypeEnum.COMMON, id: 'c' },
      { type: NodeTypeEnum.COMMON, id: 'd' },
    ],
    properties: { id: 'cat' },
  },
  // 并行编排(WHEN)
  WHEN: {
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
  },
  // 选择编排(SWITCH)
  SWITCH: {
    type: ConditionTypeEnum.SWITCH,
    condition: { type: NodeTypeEnum.SWITCH, id: 'x' },
    children: [
      { type: NodeTypeEnum.COMMON, id: 'a' },
      { type: NodeTypeEnum.COMMON, id: 'b' },
      { type: NodeTypeEnum.COMMON, id: 'c' },
      { type: NodeTypeEnum.COMMON, id: 'd' },
    ],
  },
  // 条件编排(IF)
  IF: {
    type: ConditionTypeEnum.IF,
    condition: { type: NodeTypeEnum.BOOLEAN, id: 'x' },
    children: [{ type: NodeTypeEnum.COMMON, id: 'a' }],
  },
  // FOR循环
  FOR: {
    type: ConditionTypeEnum.FOR,
    condition: { type: NodeTypeEnum.BOOLEAN, id: 'x' },
    children: [
      {
        type: ConditionTypeEnum.THEN,
        children: [
          { type: NodeTypeEnum.COMMON, id: 'a' },
          { type: NodeTypeEnum.COMMON, id: 'b' },
        ],
      },
    ],
  },
  // WHILE循环
  WHILE: {
    type: ConditionTypeEnum.WHILE,
    condition: { type: NodeTypeEnum.BOOLEAN, id: 'x' },
    children: [
      {
        type: ConditionTypeEnum.THEN,
        children: [
          { type: NodeTypeEnum.COMMON, id: 'a' },
          { type: NodeTypeEnum.COMMON, id: 'b' },
        ],
      },
    ],
  },
  // ITERATOR循环
  ITERATOR: {
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
  },
  // CATCH 捕获异常
  CATCH: {
    type: ConditionTypeEnum.CATCH,
    condition: {
      type: ConditionTypeEnum.WHEN,
      children: [
        { type: NodeTypeEnum.COMMON, id: 'a' },
        { type: NodeTypeEnum.COMMON, id: 'b' },
        { type: NodeTypeEnum.COMMON, id: 'c' },
      ],
    },
    children: [
      {
        type: ConditionTypeEnum.IF,
        condition: { type: NodeTypeEnum.IF, id: 'x' },
        children: [{ type: NodeTypeEnum.COMMON, id: 'y' }],
      },
    ],
  },
  // AND_OR_NOT 与或非
  AND: {
    type: ConditionTypeEnum.IF,
    condition: {
      type: ConditionTypeEnum.AND,
      children: [
        {
          type: ConditionTypeEnum.OR,
          children: [
            { type: NodeTypeEnum.BOOLEAN, id: 'a' },
            { type: NodeTypeEnum.BOOLEAN, id: 'b' },
          ],
        },
        {
          type: ConditionTypeEnum.NOT,
          children: [{ type: NodeTypeEnum.BOOLEAN, id: 'c' }],
        },
      ],
    },
    children: [
      { type: NodeTypeEnum.COMMON, id: 'x' },
      { type: NodeTypeEnum.COMMON, id: 'y' },
    ],
  },
  // CHAIN 子流程
  CHAIN: {
    type: ConditionTypeEnum.THEN,
    children: [
      { type: NodeTypeEnum.COMMON, id: 'A' },
      { type: NodeTypeEnum.COMMON, id: 'B' },
      {
        type: ConditionTypeEnum.WHEN,
        children: [
          {
            type: ConditionTypeEnum.CHAIN,
            id: 't1',
            // ids: '1',
            // position: { x: 220, y: 40 },
            children: [
              {
                type: ConditionTypeEnum.THEN,
                children: [
                  { type: NodeTypeEnum.COMMON, id: 'C' },
                  {
                    type: ConditionTypeEnum.WHEN,
                    children: [
                      { type: NodeTypeEnum.COMMON, id: 'J' },
                      { type: NodeTypeEnum.COMMON, id: 'K' },
                    ],
                  },
                ],
              },
            ],
          },
          { type: NodeTypeEnum.COMMON, id: 'D' },
          {
            type: ConditionTypeEnum.CHAIN,
            id: 't2',
            children: [
              {
                type: ConditionTypeEnum.THEN,
                children: [
                  { type: NodeTypeEnum.COMMON, id: 'H' },
                  { type: NodeTypeEnum.COMMON, id: 'I' },
                ],
              },
            ],
          },
        ],
      },
      {
        type: ConditionTypeEnum.SWITCH,
        condition: { type: NodeTypeEnum.COMMON, id: 'X' },
        children: [
          { type: NodeTypeEnum.COMMON, id: 'M' },
          { type: NodeTypeEnum.COMMON, id: 'N' },
          {
            type: ConditionTypeEnum.CHAIN,
            id: 'w1',
            children: [
              {
                type: ConditionTypeEnum.WHEN,
                children: [
                  { type: NodeTypeEnum.COMMON, id: 'Q' },
                  {
                    type: ConditionTypeEnum.THEN,
                    children: [
                      { type: NodeTypeEnum.COMMON, id: 'P' },
                      { type: NodeTypeEnum.COMMON, id: 'R' },
                    ],
                  },
                ],
                properties: {
                  id: 'w01',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // 模拟大量节点(包括if，switch，for，while，catch，and，or，not，chain，Iterator)数据
  LARGE_DATA: {
    type: ConditionTypeEnum.THEN,
    children: Array.from({ length: 100 }, (_, index) => {
      const nodeType = index % 10; // 用于循环生成不同类型的节点
      switch (nodeType) {
        case 0: // IF
          return {
            type: ConditionTypeEnum.IF,
            condition: { type: NodeTypeEnum.BOOLEAN, id: `bool_${index}` },
            children: [{ type: NodeTypeEnum.COMMON, id: `node_${index}` }],
          };
        case 1: // SWITCH
          return {
            type: ConditionTypeEnum.SWITCH,
            condition: { type: NodeTypeEnum.SWITCH, id: `switch_${index}` },
            children: [
              { type: NodeTypeEnum.COMMON, id: `case1_${index}` },
              { type: NodeTypeEnum.COMMON, id: `case2_${index}` },
            ],
          };
        case 2: // FOR
          return {
            type: ConditionTypeEnum.FOR,
            condition: { type: NodeTypeEnum.BOOLEAN, id: `for_${index}` },
            children: [{ type: NodeTypeEnum.COMMON, id: `loop_${index}` }],
          };
        case 3: // WHILE
          return {
            type: ConditionTypeEnum.WHILE,
            condition: { type: NodeTypeEnum.BOOLEAN, id: `while_${index}` },
            children: [{ type: NodeTypeEnum.COMMON, id: `loop_${index}` }],
          };
        case 4: // CATCH
          return {
            type: ConditionTypeEnum.CATCH,
            condition: { type: NodeTypeEnum.COMMON, id: `try_${index}` },
            children: [{ type: NodeTypeEnum.COMMON, id: `catch_${index}` }],
          };
        case 5: // AND
          return {
            type: ConditionTypeEnum.AND,
            children: [
              { type: NodeTypeEnum.BOOLEAN, id: `and1_${index}` },
              { type: NodeTypeEnum.BOOLEAN, id: `and2_${index}` },
            ],
          };
        case 6: // OR
          return {
            type: ConditionTypeEnum.OR,
            children: [
              { type: NodeTypeEnum.BOOLEAN, id: `or1_${index}` },
              { type: NodeTypeEnum.BOOLEAN, id: `or2_${index}` },
            ],
          };
        case 7: // NOT
          return {
            type: ConditionTypeEnum.NOT,
            children: [{ type: NodeTypeEnum.BOOLEAN, id: `not_${index}` }],
          };
        case 8: // CHAIN
          return {
            type: ConditionTypeEnum.CHAIN,
            id: `chain_${index}`,
            children: [
              {
                type: ConditionTypeEnum.THEN,
                children: [{ type: NodeTypeEnum.COMMON, id: `sub_${index}` }],
              },
            ],
          };
        case 9: // ITERATOR
          return {
            type: ConditionTypeEnum.ITERATOR,
            condition: { type: NodeTypeEnum.ITERATOR, id: `iter_${index}` },
            children: [{ type: NodeTypeEnum.COMMON, id: `item_${index}` }],
          };
        default:
          return { type: NodeTypeEnum.COMMON, id: `node_${index}` };
      }
    }),
  },
  // 模拟大量（5000）节点数据
  LARGE_DATA_2: {
    type: ConditionTypeEnum.THEN,
    children: Array.from({ length: 1000 }, (_, index) => ({
      type: NodeTypeEnum.COMMON,
      id: `node_${index}`,
    })),
  },
} as Record<string, any>;
