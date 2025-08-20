import { useAsyncEffect } from 'ahooks';
import FormRender, { Schema, useForm, WatchProperties } from 'form-render';
import { ConditionTypeEnum } from 'liteflow-editor-client/LiteFlowEditor/constant';
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
  any: boolean;
  id: string;
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

const WHEN_ANY_TRUE: boolean = true;
const WHEN_ANY_FALSE: boolean = false;

const ConditionPropertiesEditor: React.FC<IProps> = (props) => {
  const { styles } = useStyles();
  const { model } = props;
  const { getNodeList, messageApi } = useContext(GraphContext);
  const snap = useSnapshot(state);
  const properties = model.getProperties();

  const schema: Schema = {
    type: 'object',
    properties: {
      any: {
        title: 'Any（any）',
        type: 'string',
        widget: 'select',
        props: {
          options: [
            { label: '是', value: WHEN_ANY_TRUE },
            { label: '否', value: WHEN_ANY_FALSE },
          ],
        },
        hidden: model.type !== ConditionTypeEnum.WHEN,
      },
      id: {
        title: '唯一标识（id）',
        type: 'string',
        widget: 'input',
        required: true,
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
        snap.nodeList.find((item) => item.nodeId === val)?.nodeId,
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
      ...properties,
      id: model.id,
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

export default ConditionPropertiesEditor;
