import {
  disable,
  enable,
  exportGeneratedCSS,
  setFetchMethod,
  Theme,
} from 'darkreader';
import { logger } from 'liteflow-editor-client/LiteFlowEditor/logger';
import { useEffect } from 'react';

type DarkReaderOptions = Partial<Theme> & {
  containerSelector?: string; // 新增容器选择器选项
};

const defaultOptions: DarkReaderOptions = {
  brightness: 100,
  contrast: 90,
  sepia: 10,
  mode: 1 as const, //1 - dark mode, 0 - dimmed mode.
};

export const useDarkReader = (
  isEnabled: boolean,
  options: DarkReaderOptions = defaultOptions,
) => {
  useEffect(() => {
    // 设置 fetch 方法，避免某些资源加载问题
    setFetchMethod(window.fetch);

    if (isEnabled) {
      try {
        if (options.containerSelector) {
          // 如果指定了容器选择器，使用 exportGeneratedCSS 方法
          enable({
            brightness: options.brightness || defaultOptions.brightness!,
            contrast: options.contrast || defaultOptions.contrast!,
            sepia: options.sepia || defaultOptions.sepia!,
            mode: options.mode || defaultOptions.mode!,
          });

          // 导出生成的 CSS 并应用到指定容器
          exportGeneratedCSS().then((css) => {
            // 将 CSS 包装在容器选择器中
            const scopedCSS = wrapCSSWithSelector(
              css,
              options.containerSelector!,
            );

            // 禁用全局 darkreader
            disable();

            // 应用到指定容器
            applyCSSToDom(scopedCSS);
          });
        } else {
          // 正常启用全局 darkreader
          enable({
            brightness: options.brightness || defaultOptions.brightness!,
            contrast: options.contrast || defaultOptions.contrast!,
            sepia: options.sepia || defaultOptions.sepia!,
            mode: options.mode || defaultOptions.mode!,
          });
        }
        logger.info('DarkReader enable success');
      } catch (error) {
        logger.warn('DarkReader enable failed:', error);
      }
    } else {
      try {
        disable();
        // 如果有容器特定的样式，也要移除
        if (options.containerSelector) {
          removeCSSFromDom();
        }
      } catch (error) {
        logger.warn('DarkReader disable failed:', error);
      }
    }

    return () => {
      try {
        disable();
        if (options.containerSelector) {
          removeCSSFromDom();
        }
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
    options.containerSelector,
  ]);

  // 将 CSS 包装在指定选择器中
  const wrapCSSWithSelector = (css: string, selector: string): string => {
    // 简单的 CSS 作用域包装
    const cssContent = css.split('/* User-Agent Style */')[1];
    const lines = cssContent.split('\n');
    logger.info(lines);
    const wrappedLines = lines.map((line) => {
      if (
        line.trim() &&
        !line.trim().startsWith('@') &&
        !line.trim().startsWith('}')
      ) {
        // 为每个 CSS 规则添加容器选择器前缀
        if (line.includes('{')) {
          const [selectorPart, ...rest] = line.split('{');
          const selectors = selectorPart
            .split(',')
            .map((s) => `${s.trim()}`)
            .join(', ');
          return `${selectors} {${rest.join('{')}`;
        }
      }
      return line;
    });
    // wrappedLines.unshift(`@scope (${selector}) {`);
    // wrappedLines.push('}');
    logger.info(wrappedLines.join('\n'));
    return wrappedLines.join('\n');
  };

  // 应用 CSS 到 DOM
  const applyCSSToDom = (css: string) => {
    const styleId = 'darkreader-container-style';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  };

  // 从 DOM 移除 CSS
  const removeCSSFromDom = () => {
    const styleElement = document.getElementById('darkreader-container-style');
    if (styleElement) {
      styleElement.remove();
    }
  };
};
