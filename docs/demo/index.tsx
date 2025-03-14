import React from 'react';
import { LiteFlowEditor} from "liteflow-editor-client";
import './index.less';

const Demo: React.FC<any> = () => {
  return (
    <div className="liteflow-editor-demo-wrapper">
      <LiteFlowEditor />
    </div>
  );
};

export default Demo;
