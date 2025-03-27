import { Graph } from '@antv/x6';
import { useModel } from 'liteflow-editor-client/LiteFlowEditor/hooks';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, { useEffect, useState } from 'react';

interface IProps {
  flowGraph: Graph;
}

const useStyles = createStyles(({ token, css }) => {
  return {
    editorBasicContainer: css`
      padding: ${token.paddingSM}px;
    `,
    editorTitle: css`
      color: ${token.colorTextHeading};
      font-weight: ${token.fontWeightStrong};
    `,
  };
});

const Basic: React.FC<IProps> = (props) => {
  const { flowGraph } = props;
  const { styles } = useStyles();
  const [elString, setELString] = useState<string>(useModel()?.toEL(' '));

  useEffect(() => {
    const handleModelChange = () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      setELString(useModel()?.toEL(' '));
    };
    flowGraph.on('model:change', handleModelChange);
    return () => {
      flowGraph.off('model:change', handleModelChange);
    };
  }, [flowGraph, setELString]);

  return (
    <div className={styles.editorBasicContainer}>
      <div className={styles.editorTitle}>EL表达式：</div>
      <pre>{elString}</pre>
    </div>
  );
};

export default Basic;
