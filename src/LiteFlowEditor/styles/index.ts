import { createInstance, FullToken } from 'antd-style';

const styleInstance = createInstance<FullToken>({
  key: 'liteflow',
  speedy: false,
  hashPriority: 'low',
});

export const {
  createStyles,
  createStylish,
  createGlobalStyle,
  cx,
  css,
  styleManager,
  useTheme,
  StyleProvider,
  ThemeProvider,
} = styleInstance;
