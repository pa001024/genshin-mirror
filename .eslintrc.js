module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ["@nuxtjs/eslint-config-typescript", "prettier", "prettier/vue", "plugin:prettier/recommended", "plugin:nuxt/recommended"],
  plugins: ["prettier"],
  // add your custom rules here
  rules: {
    "no-unused-vars": 0,
    "no-console": 0,
    "no-use-before-define": 0,
    "require-await": 0,
    "@typescript-eslint/no-unused-vars": 0,
  },
};
