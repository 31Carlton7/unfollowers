import coreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [...coreWebVitals, { ignores: ['node_modules/**', '.next/**', 'out/**'] }];

export default eslintConfig;
