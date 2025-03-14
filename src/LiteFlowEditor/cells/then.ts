import icon from '../assets/then-icon.svg';
import {ConditionTypeEnum} from "liteflow-editor-client/LiteFlowEditor/constant";

const config: LiteFlowNode = {
  label: '串行(Then)',
  type: ConditionTypeEnum.THEN,
  icon,
  node: {
    primer: 'circle',
  },
};

export default config;
