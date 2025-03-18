import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import FormRender, { Schema, useForm } from 'form-render';
import { LoadingButton } from 'liteflow-editor-client/LiteFlowEditor/components';
import GraphContext from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import { addDefChain } from 'liteflow-editor-client/LiteFlowEditor/services/api';
import { handleDesc } from 'liteflow-editor-client/LiteFlowEditor/utils';
import React, { useContext, useState } from 'react';

export type Chain = {
  id: number;
  chainDesc: string;
  chainId: string;
  elJson: any;
};

interface IProps {
  className?: string;
  disabled?: boolean;
  onChange: (...args: any[]) => Promise<void>;
}

const ChainSettings: React.FC<IProps> = ({ disabled, onChange, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addChain } = useContext(GraphContext);
  const addChainApi = addChain ?? addDefChain;
  const form = useForm();

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const schema: Schema = {
    type: 'object',
    properties: {
      chainName: {
        title: '执行链名称',
        type: 'string',
        widget: 'input',
        required: true,
      },
      chainDesc: {
        title: '执行链描述',
        type: 'string',
        widget: 'textArea',
        required: true,
        props: {
          maxLength: 500,
          autoSize: { minRows: 3, maxRows: 6 },
        },
      },
    },
  };

  const handleOk = async () => {
    const { chainName, chainDesc } = await form.validateFields();
    if (chainName && chainDesc) {
      const res = await addChainApi({
        chainDesc,
        chainName,
      });
      if (handleDesc(res)) {
        setIsModalOpen(false);
        await onChange();
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Tooltip title="新增">
        <Button
          type="primary"
          onClick={showModal}
          className={className}
          disabled={disabled}
          icon={<PlusOutlined />}
        >
          新增
        </Button>
      </Tooltip>
      <Modal
        title="新增Chain"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <LoadingButton requestApi={handleOk} type="primary" key="save">
            确定
          </LoadingButton>,
        ]}
      >
        <FormRender form={form} schema={schema} footer={false} />
      </Modal>
    </>
  );
};

export default ChainSettings;
