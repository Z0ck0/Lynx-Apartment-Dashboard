module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": ["prettier"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": [
      "error",
      {
        "printWidth": 100,
        "tabWidth": 2,
        "useTabs": false,
        "semi": true,
        "singleQuote": false,
        "trailingComma": "es5",
        "bracketSpacing": true,
        "arrowParens": "avoid"
      }
    ],
    "object-curly-newline": ["error", { "consistent": true }],
    "array-bracket-newline": ["error", { "multiline": true }],
    //"array-element-newline": ["error", { "multiline": true, "minItems": 3 }],
    "array-element-newline": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"]
  }
}


