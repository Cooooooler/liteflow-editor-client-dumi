import { defineConfig } from 'dumi';

export default defineConfig({
  favicons: ['https://liteflow.cc/img/logo.png'],
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'liteflow-editor-client',
    logo: 'https://liteflow.cc/img/logo.png',
    footer: `Open-source MIT Licensed | Copyright © 2024-present
<br />
Powered by self`,
  },
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});
