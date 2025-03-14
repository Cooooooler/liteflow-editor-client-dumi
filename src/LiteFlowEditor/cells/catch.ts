import icon from '../assets/catch-icon.svg';
import {ConditionTypeEnum} from "liteflow-editor-client/LiteFlowEditor/constant";

const config: LiteFlowNode = {
  label: '捕获异常(Catch)',
  type: ConditionTypeEnum.CATCH,
  icon,
};

export default config;
