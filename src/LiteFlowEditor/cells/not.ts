import icon from '../assets/not-icon.svg';
import {ConditionTypeEnum} from "liteflow-editor-client/LiteFlowEditor/constant";

const config: LiteFlowNode = {
  label: '非(Not)',
  type: ConditionTypeEnum.NOT,
  icon,
};

export default config;
