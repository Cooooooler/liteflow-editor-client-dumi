import { message } from 'antd';

export const safeGet = (obj: any, keyChain: string, defaultVal?: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return defaultVal;
  }

  let val = obj;
  const keys = keyChain.split('.');
  for (const key of keys) {
    if (val[key] === undefined) {
      return defaultVal;
    } else {
      val = val[key];
    }
  }

  return val;
};

export const executeScript = (code: string, type = 'module') => {
  const script = document.createElement('script');
  script.type = type;
  script.text = code;
  document.body.appendChild(script);
};

export const handleDesc = ({
  desc,
  status,
}: {
  data?: any;
  desc?: string;
  status?: number;
}) => {
  switch (status) {
    case 1: {
      message.success(desc);
      break;
    }
    default: {
      message.error(desc);
      break;
    }
  }
  return status ?? 0;
};

export const safeParse = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Invalid JSON string:', error);
    return {}; // 或返回一个默认值
  }
};

export const safeStringify = (data: any) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Failed to stringify data:', error);
    return {}; // 或返回一个默认值
  }
};
