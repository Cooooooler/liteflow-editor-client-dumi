import icon from '../assets/chain-icon.svg';
import {ConditionTypeEnum} from "liteflow-editor-client/LiteFlowEditor/constant";

const config: LiteFlowNode = {
  label: '子流程(Chain)',
  type: ConditionTypeEnum.CHAIN,
  icon
};

export default config;
