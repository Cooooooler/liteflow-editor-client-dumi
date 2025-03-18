import { useAsyncEffect } from 'ahooks';
import FormRender, { Schema, useForm, WatchProperties } from 'form-render';
import { ConditionTypeEnum } from 'liteflow-editor-client/LiteFlowEditor/constant';
import GraphContext from 'liteflow-editor-client/LiteFlowEditor/context/GraphContext';
import { history } from 'liteflow-editor-client/LiteFlowEditor/hooks/useHistory';
import ELNode from 'liteflow-editor-client/LiteFlowEditor/model/node';
import { getDefCmpList } from 'liteflow-editor-client/LiteFlowEditor/services/api';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './index.module.less';

interface IProps {
  model: ELNode;
}

type FormValuesType = {
  any: boolean;
  id: string;
  tag: string;
  maxWaitSeconds: string;
};

const WHEN_ANY_TRUE: boolean = true;
const WHEN_ANY_FALSE: boolean = false;

const ConditionPropertiesEditor: React.FC<IProps> = (props) => {
  const { model } = props;
  const { getCmpList } = useContext(GraphContext);
  const getCmpListApi = getCmpList ?? getDefCmpList;
  const [cmpList, setCmpList] = useState<any[]>([]);
  const properties = model.getProperties();

  const schema = useMemo<Schema>(
    () => ({
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
    [model, cmpList],
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
    <div className={styles.liteflowEditorPropertiesEditorContainer}>
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
