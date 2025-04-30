import { EyeOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import { Modal } from 'antd';
import { getModel } from 'liteflow-editor-client/LiteFlowEditor/hooks';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React from 'react';
import JsonView from 'react-json-view';
import makeBtnWidget from './common/makeBtnWidget';

interface IProps {
  flowGraph: Graph;
}

const useStyles = createStyles(({ css }) => {
  return {
    modalContent: css`
      max-height: 650px;
      overflow: auto;
    `,
  };
});

const ViewComponent: React.FC = () => {
  const { styles } = useStyles();
  const model = getModel();

  return (
    <div className={styles.modalContent}>
      <JsonView
        name={null}
        collapsed={false}
        enableClipboard={true}
        displayDataTypes={false}
        displayObjectSize={false}
        src={JSON.parse(JSON.stringify(model.toJSON()))}
      />
    </div>
  );
};

const View: React.FC<IProps> = makeBtnWidget({
  tooltip: '查看DSL',
  handler() {
    Modal.info({
      title: '查看DSL',
      width: 1000,
      maskClosable: true,
      closable: true,
      content: <ViewComponent />,
    });
  },
  getIcon() {
    return <EyeOutlined />;
  },
  disabled() {
    return false;
  },
});

export default View;
