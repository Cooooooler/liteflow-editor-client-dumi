import { useAsyncEffect } from 'ahooks';
import FormRender, { Schema, useForm, WatchProperties } from 'form-render';
import { history } from 'liteflow-editor-client/LiteFlowEditor/hooks/useHistory';
import ELNode from 'liteflow-editor-client/LiteFlowEditor/model/node';
import { getCmpList } from 'liteflow-editor-client/LiteFlowEditor/services/api';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';

interface IProps {
  model: ELNode;
}

type FormValuesType = {
  id: string;
  data: string;
  tag: string;
  maxWaitSeconds: string;
};

const handleConfig = (config: string[]) => {
  const obj: Record<string, boolean> = {};
  config.forEach((item) => {
    obj[item] = true;
  });
  return obj;
};

const handleConfigValue = (config: Record<string, boolean>) => {
  const arr: string[] = [];
  Object.keys(config).forEach((key) => {
    if (config[key]) {
      arr.push(key);
    }
  });
  return arr;
};

const ComponentPropertiesEditor: React.FC<IProps> = (props) => {
  const { model } = props;
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

  // const handleOnChange = debounce(async () => {
  //   try {
  //     const changedValues = await form.validateFields();
  //     const { id, config, ...rest } = changedValues;
  //     const { highlight = false } = handleConfig(config);
  //
  //     model.id = id;
  //     model.highlight = highlight;
  //     model.setProperties({ ...properties, ...rest });
  //     history.push(undefined, { silent: true });
  //     // history.push();
  //     // 以下是对AntV X6视图层进行临时修改
  //     const modelNode = model.getStartNode();
  //     const originSize = modelNode.getSize();
  //     const body = modelNode.getAttrs()?.body;
  //     modelNode
  //       .updateAttrs({ label: { text: id }, body: { ...body, highlight } })
  //       .setSize(originSize); // 解决由于文本修改导致的尺寸错误
  //   } catch (errorInfo) {
  //     console.log('Failed:', errorInfo);
  //   }
  // }, 200);
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
    const { data } = await getCmpList({ type: model.type });
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
export default ComponentPropertiesEditor;
