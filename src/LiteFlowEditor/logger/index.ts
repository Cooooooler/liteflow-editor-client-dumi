import {
  createConsola,
  LogLevels,
  type ConsolaInstance,
  type ConsolaOptions,
  type LogLevel,
  type LogType,
} from 'consola';

// 环境与默认级别推导
const isBrowser = typeof window !== 'undefined';
const nodeEnv =
  (typeof process !== 'undefined' && (process as any).env?.NODE_ENV) ||
  'development';
const isProd = nodeEnv === 'production';

// 解析级别名称至数字等级
function toLogLevel(
  input: LogLevel | LogType | string | undefined,
  fallback: LogLevel,
): LogLevel {
  if (typeof input === 'number') return input as LogLevel;
  const value = (input || '').toString().toLowerCase() as LogType | string;
  if (value && (LogLevels as any)[value] != null) {
    return (LogLevels as any)[value] as LogLevel;
  }
  // 兼容常见别名
  switch (value) {
    case 'silent':
      return (LogLevels as any).silent as LogLevel;
    case 'fatal':
      return (LogLevels as any).fatal as LogLevel;
    case 'error':
      return (LogLevels as any).error as LogLevel;
    case 'warn':
    case 'warning':
      return (LogLevels as any).warn as LogLevel;
    case 'info':
      return (LogLevels as any).info as LogLevel;
    case 'log':
      return (LogLevels as any).log as LogLevel;
    case 'success':
      return (LogLevels as any).success as LogLevel;
    case 'debug':
      return (LogLevels as any).debug as LogLevel;
    case 'trace':
      return (LogLevels as any).trace as LogLevel;
    case 'verbose':
      return (LogLevels as any).verbose as LogLevel;
    default: {
      const maybeNumber = Number(value);
      if (!Number.isNaN(maybeNumber)) return maybeNumber as LogLevel;
      return fallback;
    }
  }
}

function readLevelFromEnv(): string | undefined {
  // 支持三种来源：进程环境变量、浏览器 localStorage、URL 查询
  const envLevel = (typeof process !== 'undefined' &&
    (process as any).env?.LITEFLOW_LOG_LEVEL) as string | undefined;

  let storageLevel: string | undefined;
  if (isBrowser) {
    try {
      storageLevel =
        window.localStorage.getItem('LITEFLOW_LOG_LEVEL') || undefined;
    } catch (_) {
      // ignore
    }
  }

  let queryLevel: string | undefined;
  if (isBrowser && typeof window.location !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      queryLevel =
        params.get('logLevel') || params.get('LOG_LEVEL') || undefined;
    } catch (_) {
      // ignore
    }
  }

  return queryLevel || storageLevel || envLevel;
}

// 默认级别：开发 debug，生产 warn，可被变量覆盖
const defaultLevel = toLogLevel(
  readLevelFromEnv(),
  isProd ? (LogLevels as any).warn : (LogLevels as any).debug,
);

export type LoggerOptions = {
  tag?: string;
  level?: LogLevel | LogType | string;
  fancy?: boolean;
  date?: boolean;
  formatOptions?: Partial<ConsolaOptions['formatOptions']>;
};

export function createLogger(options: LoggerOptions = {}): ConsolaInstance {
  const level = toLogLevel(options.level, defaultLevel);
  const instance = createConsola({
    level,
    fancy: options.fancy ?? !isProd,
    formatOptions: {
      date: options.date ?? true,
      compact: isProd,
      ...(options.formatOptions || {}),
    },
  });
  return options.tag ? instance.withTag(options.tag) : instance;
}

// 默认实例，统一打上组件前缀 tag
export const logger: ConsolaInstance = createLogger({ tag: 'LiteFlowEditor' });

export function withTag(tag: string): ConsolaInstance {
  return logger.withTag(tag);
}

export function setGlobalLogLevel(
  level: LogLevel | LogType | string,
): LogLevel {
  const parsed = toLogLevel(level, logger.level);
  logger.level = parsed;
  return parsed;
}

export type { ConsolaInstance, LogLevel, LogType };
