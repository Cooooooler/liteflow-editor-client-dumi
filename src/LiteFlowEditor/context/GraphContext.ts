import { Graph } from '@antv/x6';
import { MessageInstance } from 'antd/es/message/interface';
import { Context, createContext, RefObject } from 'react';

/**
 * graph: Graph实例
 * graphWrapper: Graph的容器
 */
export interface IGraphContext {
  model: any;
  graph: Graph;
  graphWrapper: RefObject<HTMLDivElement>;
  currentEditor: {
    getGraphInstance(): Graph | undefined;
    toJSON(): Record<string, any>;
    fromJSON(data: Record<string, any>): void;
  };
  messageApi: MessageInstance;
  getCmpList: (data?: any) => Promise<any>;
  getChainPage: (data?: any) => Promise<any>;
  getChainById: (data?: any) => Promise<any>;
  addChain: (data?: any) => Promise<any>;
  updateChain: (data?: any) => Promise<any>;
  deleteChain: (data?: any) => Promise<any>;
  isFineTune: boolean;
  setIsFineTune: (value: boolean) => void;
}

const defaultValue: IGraphContext = {} as any;

export const GraphContext: Context<IGraphContext> = createContext(defaultValue);

export default GraphContext;
