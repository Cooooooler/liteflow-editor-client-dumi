const valtio = require('eslint-plugin-valtio');
const umi = require('@umijs/lint/dist/config/eslint');
module.exports = [
  valtio.configs['flat/recommended'],
  {
    ...umi,
    plugins: {
      ...umi.plugins,
      valtio,
    },
    rules: {
      ...umi.rules,
      'valtio/state-snapshot-rule': ['warn'],
      'valtio/avoid-this-in-proxy': ['warn'],
    },
  },
];
