import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import FormRender, { Schema, useForm } from 'form-render';
import { LoadingButton } from 'liteflow-editor-client/LiteFlowEditor/components';
import GraphContext from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import React, { useContext, useState } from 'react';

interface IProps {
  className?: string;
  disabled?: boolean;
  onSuccess?: () => void;
}

const ChainSettings: React.FC<IProps> = ({
  disabled,
  className,
  onSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addChain } = useContext(GraphContext);
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
    try {
      const values = (await form.validateFields()) as {
        chainName: string;
        chainDesc: string;
      };
      const { chainName, chainDesc } = values;
      const res = await addChain({
        chainDesc,
        chainName,
      });
      if (res) {
        setIsModalOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      // Form validation failed
      console.error('Validation failed:', error);
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
