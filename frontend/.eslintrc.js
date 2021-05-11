module.exports = {
  extends: ["airbnb-typescript"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: { qoutes: "off", "@typescript-eslint/quotes": ["warn", "double"] },
};
