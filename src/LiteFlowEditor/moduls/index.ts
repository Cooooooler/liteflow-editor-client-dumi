/**
 * 状态
 */

import { proxy } from 'valtio';

export type Chain = {
  id: string;
  chainId: string;
  chainName: string;
  chainDesc: string;
  chainDsl: string;
  elData: string;
  enable: number;
  createTime: string;
  updateTime: string;
};

export type NodeList = {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  className: string;
  scriptId: string;
  nodeDesc: string;
  enable: number;
  createTime: string;
  updateTime: string;
};

export type Status = 'success' | 'error' | 'pending';

export const state = proxy<{
  status: Status;
  chains: Chain[];
  nodeList: NodeList[];
}>({
  status: 'pending',
  chains: [],
  nodeList: [],
});
