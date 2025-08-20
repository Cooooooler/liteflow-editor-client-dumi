import { useAsyncEffect } from 'ahooks';
import FormRender, { Schema, useForm, WatchProperties } from 'form-render';
import GraphContext from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import { history } from 'liteflow-editor-client/LiteFlowEditor/hooks/useHistory';
import ELNode from 'liteflow-editor-client/LiteFlowEditor/model/node';
import { state } from 'liteflow-editor-client/LiteFlowEditor/moduls';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, { useContext, useEffect } from 'react';
import { useSnapshot } from 'valtio';

interface IProps {
  model: ELNode;
}

type FormValuesType = {
  id: string;
  data: string;
  tag: string;
  maxWaitSeconds: string;
};

const useStyles = createStyles(({ token, css }) => {
  return {
    editorPropertiesEditorContainer: css`
      overflow-y: auto;
      padding: ${token.paddingSM}px;
    `,
  };
});

const ComponentPropertiesEditor: React.FC<IProps> = (props) => {
  const { styles } = useStyles();
  const { model } = props;
  const { getNodeList, messageApi } = useContext(GraphContext);
  const properties = model.getProperties();
  const snap = useSnapshot(state);

  const schema: Schema = {
    type: 'object',
    properties: {
      id: {
        title: 'ID',
        type: 'string',
        widget: 'input',
        required: true,
      },
      data: {
        title: '参数（data）',
        type: 'string',
        widget: 'input',
      },
      tag: {
        title: '标签（tag）',
        type: 'string',
        widget: 'select',
        props: {
          options: snap.nodeList.map((item) => ({
            label: item?.nodeName,
            value: item?.nodeId,
          })),
        },
        required: true,
      },
      maxWaitSeconds: {
        title: '超时（maxWaitSeconds）',
        type: 'string',
        widget: 'input',
      },
    },
  };

  const form = useForm();

  const watch: WatchProperties = {
    tag: (val: string) => {
      form.setValueByPath(
        'id',
        state.nodeList.find((item) => item.nodeId === val)?.nodeId,
      );
    },
  };

  const onFinish = (formData: FormValuesType) => {
    const { id, ...rest } = formData;
    model.id = id;
    model.setProperties({ ...properties, ...rest });
    history.push(undefined, { silent: true });
    // history.push();
    // 以下是对AntV X6视图层进行临时修改
    const modelNode = model.getStartNode();
    const originSize = modelNode.getSize();
    modelNode.updateAttrs({ label: { text: id } }).setSize(originSize); // 解决由于文本修改导致的尺寸错误
    messageApi.success('操作成功');
  };

  const initForm = () => {
    form.setValues({
      data: '',
      tag:
        state.nodeList.find((item) => item.nodeId === model.id)?.nodeId ?? '',
      maxWaitSeconds: '',
      id: model.id,
      ...properties,
    });
  };

  useEffect(() => {
    initForm();
  }, [model.id]);

  useAsyncEffect(async () => {
    await getNodeList({ nodeType: model.type });
    initForm();
  }, [model.type]);

  return (
    <div className={styles.editorPropertiesEditorContainer}>
      <FormRender
        form={form}
        schema={schema}
        onFinish={onFinish}
        maxWidth={360}
        footer={true}
        watch={watch}
      />
    </div>
  );
};
export default ComponentPropertiesEditor;
