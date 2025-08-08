import { disable, enable, setFetchMethod, Theme } from 'darkreader';
import { logger } from 'liteflow-editor-client/LiteFlowEditor/logger';
import { useEffect, useRef } from 'react';

type DarkReaderOptions = Partial<Theme>;

const defaultOptions: DarkReaderOptions = {
  brightness: 100,
  contrast: 90,
  sepia: 10,
  mode: 1, //1 - dark mode, 0 - dimmed mode.
};

export const useDarkReader = (
  isEnabled: boolean,
  options: DarkReaderOptions = defaultOptions,
) => {
  const isEnabledRef = useRef(isEnabled);

  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    // 设置 fetch 方法，避免某些资源加载问题
    setFetchMethod(window.fetch);

    if (isEnabled) {
      try {
        enable({
          brightness: options.brightness || defaultOptions.brightness!,
          contrast: options.contrast || defaultOptions.contrast!,
          sepia: options.sepia || defaultOptions.sepia!,
          mode: options.mode || defaultOptions.mode!,
        });
      } catch (error) {
        logger.warn('DarkReader enable failed:', error);
      }
    } else {
      try {
        disable();
      } catch (error) {
        logger.warn('DarkReader disable failed:', error);
      }
    }

    return () => {
      try {
        disable();
      } catch (error) {
        logger.warn('DarkReader cleanup failed:', error);
      }
    };
  }, [
    isEnabled,
    options.brightness,
    options.contrast,
    options.sepia,
    options.mode,
  ]);

  return {
    isEnabled: isEnabledRef.current,
  };
};
