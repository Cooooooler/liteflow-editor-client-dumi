import icon from '../assets/start-icon.svg';
import {NODE_TYPE_START} from "liteflow-editor-client/LiteFlowEditor/constant";

const config: LiteFlowNode = {
  label: '开始',
  type: NODE_TYPE_START,
  icon,
  node: {
    primer: 'circle',
  },
};

export default config;
