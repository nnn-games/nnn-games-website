// ESLint 설정 (flat config)
// - 브라우저 스크립트(js/, 덱)는 전역 객체 기반 비모듈 스크립트로 취급한다.
// - scripts/ 와 설정 파일은 Node CommonJS 로 취급한다.
const js = require('@eslint/js');
const globals = require('globals');

// window.* 로 노출되어 다른 파일에서 bare identifier 로 읽는 전역들
const siteGlobals = {
  translations: 'readonly',
  NNNUtils: 'readonly',
  ProjectManager: 'readonly',
  ProjectRenderer: 'readonly',
  projectsData: 'writable',
  ProjectDetailConfigs: 'readonly',
  DECK_SLIDES: 'readonly',
  DECK_I18N: 'readonly',
};

const commonRules = {
  ...js.configs.recommended.rules,
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
  // 위 전역들은 각 파일에서 const 로 정의한 뒤 window 에 노출하므로 재선언 검사를 끈다.
  'no-redeclare': ['error', { builtinGlobals: false }],
  'no-console': 'off',
  'no-empty': ['error', { allowEmptyCatch: true }],
};

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**', '_archive/**', 'package-lock.json'],
  },
  {
    files: ['site/**/*.js', 'decks/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: { ...globals.browser, ...siteGlobals },
    },
    rules: commonRules,
  },
  {
    files: ['scripts/**/*.js', '*.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: commonRules,
  },
];
