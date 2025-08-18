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

export type CmpList = {
  cmpId: string;
  cmpName: string;
  type: string;
  typeName: string;
};

export type Status = 'success' | 'error' | 'pending';

export const state = proxy<{
  status: Status;
  chains: Chain[];
  cmpList: CmpList[];
}>({
  status: 'pending',
  chains: [],
  cmpList: [],
});

export const buttonStatus = proxy({ isFineTune: true });
