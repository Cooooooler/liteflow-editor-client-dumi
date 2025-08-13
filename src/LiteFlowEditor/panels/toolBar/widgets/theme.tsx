import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useDarkReader } from 'liteflow-editor-client/LiteFlowEditor/hooks/useDarkReader';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import React, { useEffect, useMemo, useState } from 'react';

const useStyles = createStyles(({ token, css }) => {
  return {
    themeSwitcher: css`
      margin-left: ${token.marginXS}px;
      border-radius: ${token.borderRadius}px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .anticon {
        transition: all 0.3s ease;
      }

      &:hover .anticon {
        transform: rotate(15deg);
      }
    `,
  };
});

// 主题切换器组件
const ThemeSwitcher: React.FC = () => {
  const { styles } = useStyles();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 使用 useMemo 来稳定 options 对象，避免不必要的重新渲染
  const darkReaderOptions = useMemo(
    () => ({
      brightness: 100,
      contrast: 90,
      sepia: 10,
      mode: 1 as const, // 使用 as const 确保类型为字面量 1
      // containerSelector: '#liteflow-editor-wrapper',
    }),
    [],
  );

  // 使用 DarkReader hook
  useDarkReader(isDarkMode, darkReaderOptions);

  // 从 localStorage 读取主题设置
  useEffect(() => {
    const savedTheme = localStorage.getItem('liteflow-editor-dark-mode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  const handleToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('liteflow-editor-dark-mode', newMode.toString());
  };

  return (
    <Tooltip title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}>
      <Button
        className={styles.themeSwitcher}
        type="text"
        size="small"
        icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        onClick={handleToggle}
        aria-label={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
      />
    </Tooltip>
  );
};

export default ThemeSwitcher;
