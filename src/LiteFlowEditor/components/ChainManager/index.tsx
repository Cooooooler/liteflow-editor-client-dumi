import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useAsyncEffect } from 'ahooks';
import { Button, Modal, Select, Tooltip } from 'antd';
import { Chain, state } from 'liteflow-editor-client';
import { LoadingButton } from 'liteflow-editor-client/LiteFlowEditor/components';
import AddChain from 'liteflow-editor-client/LiteFlowEditor/components/ChainManager/AddChain';
import type { IGraphContext } from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import { GraphContext } from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import { getModel } from 'liteflow-editor-client/LiteFlowEditor/hooks';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import {
  safeParse,
  safeStringify,
} from 'liteflow-editor-client/LiteFlowEditor/utils';
import React, { FC, useContext, useState } from 'react';
import { useSnapshot } from 'valtio';

const useStyles = createStyles(({ token }) => {
  return {
    wrapper: {
      display: 'flex',
      gap: token.margin,
      alignItems: 'center',
    },
  };
});

const ChainManager: FC = () => {
  const snap = useSnapshot(state);
  const [currentChain, setCurrentChain] = useState<Chain>();
  const { styles } = useStyles();
  const { getChainPage, updateChain, deleteChain } = useContext(GraphContext);

  useAsyncEffect(async () => {
    await getChainPage();
  }, []);

  const { currentEditor } = useContext<IGraphContext>(GraphContext);
  const handleOnChange = async (id: string) => {
    const v = snap.chains.find((chain) => chain.id === id)!;
    setCurrentChain(v);
    const data = safeParse(v.chainDsl);
    currentEditor.fromJSON(data);
  };

  const handleSave = async () => {
    await updateChain({
      ...currentChain,
      chainDsl: safeStringify(currentEditor.toJSON()),
      elData: getModel().toEL(' '),
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '操作确认',
      content: '请确认是否删除当前记录？',
      async onOk() {
        await deleteChain(currentChain);
        setCurrentChain(void 0);
        currentEditor.fromJSON({});
      },
    });
  };

  return (
    snap.status === 'success' && (
      <div className={styles.wrapper}>
        <Select
          value={currentChain?.id}
          placeholder="请选择接口数据"
          style={{ width: 200 }}
          options={snap.chains.map((chain) => ({
            label: chain.chainDesc,
            value: chain.id ?? void 0,
          }))}
          onChange={handleOnChange}
        />
        <Tooltip title="保存当前修改">
          <>
            <LoadingButton
              type="primary"
              requestApi={handleSave}
              disabled={!currentChain?.id}
              icon={<SaveOutlined />}
            >
              保存
            </LoadingButton>
          </>
        </Tooltip>
        <Tooltip title="当前记录">
          <Button
            type="primary"
            danger
            onClick={handleDelete}
            disabled={!currentChain?.id}
          >
            <DeleteOutlined /> 删除
          </Button>
        </Tooltip>
        <AddChain
          onSuccess={async () => {
            await getChainPage();
          }}
        />
      </div>
    )
  );
};

export default ChainManager;
