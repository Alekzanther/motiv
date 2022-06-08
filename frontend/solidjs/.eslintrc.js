module.exports = {
  ignorePatterns: ["dist/", "**/queries/types/graphql.tsx", "serviceWorker.tsx"],
  plugins: ["import"],
  extends: ["airbnb-typescript/base"],
  parserOptions: {
    project: "tsconfig.json",
  },
  rules: {
    qoutes: "off",
    "import/extensions": [0],
    "import/no-extraneous-dependencies": [0],
    "jsx-filename-extension": [0],
    "@typescript-eslint/quotes": ["warn", "double"],
    "comma-dangle": ["error", "always-multiline"],
    "no-param-reassign": "off",
    "jsx-a11y/media-has-caption": "off",
  },
};
