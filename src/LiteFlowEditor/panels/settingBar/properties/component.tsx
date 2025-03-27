import { useAsyncEffect } from 'ahooks';
import FormRender, { Schema, useForm, WatchProperties } from 'form-render';
import GraphContext from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import { history } from 'liteflow-editor-client/LiteFlowEditor/hooks/useHistory';
import ELNode from 'liteflow-editor-client/LiteFlowEditor/model/node';
import { getDefCmpList } from 'liteflow-editor-client/LiteFlowEditor/services/api';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

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
  const { getCmpList } = useContext(GraphContext);
  const getCmpListApi = getCmpList ?? getDefCmpList;
  const [cmpList, setCmpList] = useState<any[]>([]);
  const properties = model.getProperties();

  const schema: Schema = useMemo(
    () => ({
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
            options: cmpList.map((item) => ({
              label: item?.cmpName,
              value: item?.cmpId,
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
    }),
    [cmpList],
  );

  const form = useForm();

  const watch: WatchProperties = {
    tag: (val: string) => {
      form.setValueByPath(
        'id',
        cmpList.find((item) => item.cmpId === val)?.cmpId,
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
  };

  useEffect(() => {
    form.setValues({
      data: '',
      tag: '',
      maxWaitSeconds: '',
      ...properties,
      id: model.id,
    });
  }, [model.id]);

  const getCmpListCallBack = useCallback(async () => {
    const { data } = await getCmpListApi({ type: model.type });
    if (data && data.length) {
      setCmpList(data);
    }
  }, [setCmpList]);

  useAsyncEffect(async () => {
    await getCmpListCallBack();
  }, []);

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
