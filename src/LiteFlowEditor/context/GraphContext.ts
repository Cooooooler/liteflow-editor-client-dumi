import { Graph } from '@antv/x6';
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
  getCmpList?: (data?: any) => Promise<any>;
  getChainPage?: (data?: any) => Promise<any>;
}

const defaultValue: IGraphContext = {} as any;

export const GraphContext: Context<IGraphContext> = createContext(defaultValue);

export default GraphContext;
