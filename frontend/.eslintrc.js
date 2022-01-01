module.exports = {
  ignorePatterns: ["**/queries/types/graphql.tsx", "serviceWorker.tsx"],
  plugins: ["import"],
  extends: ["airbnb-typescript"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    qoutes: "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/quotes": ["warn", "double"],
    "comma-dangle": ["error", "always-multiline"],
    "no-param-reassign": "off",
    "jsx-a11y/media-has-caption": "off",
  },
};
