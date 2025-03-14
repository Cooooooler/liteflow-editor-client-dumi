import icon from '../assets/when-icon.svg';
import {ConditionTypeEnum} from "liteflow-editor-client/LiteFlowEditor/constant";

const config: LiteFlowNode = {
  label: '并行(When)',
  type: ConditionTypeEnum.WHEN,
  icon,
  node: {
    primer: 'circle',
  },
};

export default config;
