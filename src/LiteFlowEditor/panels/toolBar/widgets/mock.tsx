import { Graph } from '@antv/x6';
import { Select } from 'antd';
import { ConditionTypeEnum } from 'liteflow-editor-client/LiteFlowEditor/constant';
import GraphContext from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import mocks from 'liteflow-editor-client/LiteFlowEditor/mock';
import React, { useContext, useEffect, useState } from 'react';
import styles from './index.module.less';

interface IProps {
  flowGraph: Graph;
}

const Mock: React.FC<IProps> = (props) => {
  const { flowGraph } = props;
  const [selectedValue, setSelectedValue] = useState<string>('');

  const { currentEditor } = useContext<any>(GraphContext);

  const handleOnChange = (value: string) => {
    setSelectedValue(value);
    const mockData = mocks[value] as any;
    currentEditor.fromJSON(mockData);
  };

  useEffect(() => {
    setTimeout(() => {
      handleOnChange(ConditionTypeEnum.THEN);
    }, 500);
  }, [flowGraph]);

  return (
    <div className={styles.zoomContainer}>
      <span>测试数据：</span>
      <Select
        placeholder="请选择测试数据"
        value={selectedValue}
        style={{ width: 200 }}
        onChange={handleOnChange}
        options={[
          {
            label: '顺序类',
            options: [
              { label: '串行编排(THEN)', value: ConditionTypeEnum.THEN },
              { label: '并行编排(WHEN)', value: ConditionTypeEnum.WHEN },
            ],
          },
          {
            label: '分支类',
            options: [
              {
                label: '选择编排(SWITCH)',
                value: ConditionTypeEnum.SWITCH,
              },
              { label: '条件编排(IF)', value: ConditionTypeEnum.IF },
            ],
          },
          {
            label: '循环类',
            options: [
              { label: 'FOR循环', value: ConditionTypeEnum.FOR },
              { label: 'WHILE循环', value: ConditionTypeEnum.WHILE },
              { label: 'ITERATOR循环', value: ConditionTypeEnum.ITERATOR },
            ],
          },
          {
            label: '其他类',
            options: [
              { label: '捕获异常(CATCH)', value: ConditionTypeEnum.CATCH },
              { label: '与或非(AND_OR_NOT)', value: ConditionTypeEnum.AND },
              { label: '子流程(CHAIN)', value: ConditionTypeEnum.CHAIN },
            ],
          },
        ]}
      />
    </div>
  );
};

export default Mock;
