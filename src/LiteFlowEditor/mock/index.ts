import {
  ConditionTypeEnum,
  NodeTypeEnum,
} from 'liteflow-editor-client/LiteFlowEditor/constant';

export default {
  // 串行编排(THEN)
  THEN: {
    type: ConditionTypeEnum.THEN,
    children: [
      {"type":"THEN","children":[{"type":"IF","condition":{"type":"NodeIfComponent","id":"BlackListState","properties":{}},"children":[{"type":"NodeComponent","id":"BlaskListLogger","properties":{}},{"type":"IF","condition":{"type":"NodeIfComponent","id":"RiskCheck","properties":{}},"children":[{"type":"NodeComponent","id":"RiskLogger","properties":{}},{"type":"IF","condition":{"type":"NodeIfComponent","id":"RiskCheckAndCount","properties":{}},"children":[{"type":"THEN","children":[{"type":"NodeComponent","id":"NewRiskLogger","properties":{}},{"type":"NodeComponent","id":"AskLogger","properties":{}}]},{"type":"IF","condition":{"type":"NodeIfComponent","id":"isEmptyQuestion","properties":{}},"children":[{"type":"NodeComponent","id":"EndAndLog","properties":{}},{"type":"THEN","children":[{"type":"NodeComponent","id":"reWrite","properties":{}},{"type":"NodeComponent","id":"matchRegion","properties":{}},{"type":"NodeComponent","id":"chineseByPatternMatch","properties":{}},{"type":"WHEN","children":[{"type":"THEN","children":[{"type":"NodeComponent","id":"leaderIdScene","properties":{}},{"type":"THEN","children":[{"type":"NodeComponent","id":"leaderScene","properties":{}},{"type":"NodeComponent","id":"organScene","properties":{}},{"type":"NodeComponent","id":"govDataScene","properties":{}},{"type":"NodeComponent","id":"videoScene","properties":{}},{"type":"NodeComponent","id":"vrScene","properties":{}},{"type":"NodeComponent","id":"entryExitIntent","properties":{}},{"type":"THEN","children":[{"type":"NodeComponent","id":"hotService","properties":{}}]}]}]},{"type":"NodeComponent","id":"LLMLanguageChecker","properties":{}}],"properties":{"any":false}},{"type":"WHEN","children":[{"type":"THEN","children":[{"type":"IF","condition":{"type":"NodeIfComponent","id":"isChineseLanguageCheck","properties":{}},"children":[{"type":"NodeComponent","id":"cache","properties":{}}]},{"type":"NodeComponent","id":"qaPairs","properties":{}},{"type":"IF","condition":{"type":"NodeIfComponent","id":"isQaHitCheck","properties":{}},"children":[{"type":"THEN","children":[{"type":"NodeComponent","id":"qaAnswer","properties":{}},{"type":"NodeComponent","id":"endCmp","properties":{}}]}]},{"type":"SWITCH","condition":{"type":"NodeSwitchComponent","id":"oneThing","properties":{}},"children":[{"type":"NodeComponent","id":"llmChat","properties":{"tag":"onethingOut"}},{"type":"NodeComponent","id":"endCmp","properties":{"data":"end"}},{"type":"NodeComponent","id":"normalServiceProcess","properties":{}}]}]},{"type":"NodeComponent","id":"dateRewrite","properties":{}}],"properties":{"any":false}},{"type":"IF","condition":{"type":"NodeIfComponent","id":"socialCheck","properties":{}},"children":[{"type":"THEN","children":[{"type":"NodeComponent","id":"llmChat","properties":{}},{"type":"NodeComponent","id":"endCmp","properties":{}}]}]},{"type":"NodeComponent","id":"historyLoad","properties":{}},{"type":"WHEN","children":[{"type":"IF","condition":{"type":"NodeIfComponent","id":"isNeedConformsCheck","properties":{}},"children":[{"type":"NodeComponent","id":"conformsCheck","properties":{}}]},{"type":"NodeComponent","id":"roundRewriteRequest","properties":{}}],"properties":{"any":false}},{"type":"NodeComponent","id":"searchWord","properties":{}},{"type":"SWITCH","condition":{"type":"NodeSwitchComponent","id":"roundRewriteProcess","properties":{}},"children":[{"type":"NodeComponent","id":"lastChain","properties":{"tag":"unrewritten"}},{"type":"THEN","children":[{"type":"IF","condition":{"type":"NodeIfComponent","id":"socialCheck","properties":{}},"children":[{"type":"THEN","children":[{"type":"NodeComponent","id":"llmChat","properties":{}},{"type":"NodeComponent","id":"endCmp","properties":{}}]}]},{"type":"NodeComponent","id":"cache","properties":{"tag":"rewritten"}},{"type":"IF","condition":{"type":"NodeIfComponent","id":"cacheHitCheck","properties":{}},"children":[{"type":"NodeComponent","id":"endCmp","properties":{}}]},{"type":"NodeComponent","id":"lastChain","properties":{}}],"properties":{"id":"afterRewrittenProcess","tag":"rewritten"}},{"type":"NodeComponent","id":"endCmp","properties":{"tag":"end"}},{"type":"NodeComponent","id":"llmChat","properties":{"tag":"chat"}}]}]}]}]}]}]}]}
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
} as Record<string, any>;
