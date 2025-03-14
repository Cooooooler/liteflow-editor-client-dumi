import icon from '../assets/intermediate-end-icon.svg';
import {NODE_TYPE_INTERMEDIATE_END} from "liteflow-editor-client/LiteFlowEditor/constant";

const config: LiteFlowNode = {
  label: '结束',
  type: NODE_TYPE_INTERMEDIATE_END,
  icon,
  node: {
    primer: 'circle',
  },
};

export default config;
