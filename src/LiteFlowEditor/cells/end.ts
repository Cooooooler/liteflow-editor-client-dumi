import icon from '../assets/end-icon.svg';
import {NODE_TYPE_END} from "liteflow-editor-client/LiteFlowEditor/constant";

const config: LiteFlowNode = {
  label: '结束',
  type: NODE_TYPE_END,
  icon,
  node: {
    primer: 'circle',
  },
};

export default config;
