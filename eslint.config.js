import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      // Custom rules to enforce design system compliance
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value*="bg-gradient"]',
          message: 'Gradients are forbidden. Use solid colors only.',
        },
        {
          selector: 'Literal[value*="backdrop-filter"]',
          message: 'Glass morphism is forbidden. Use solid backgrounds only.',
        },
        {
          selector: 'Literal[value*="blur"]',
          message: 'Blur effects are forbidden. Use solid backgrounds only.',
        },
        {
          selector: 'Literal[value*="font-semibold"]',
          message: 'font-semibold is forbidden. Use font-medium (500) or font-normal (400) only.',
        },
        {
          selector: 'Literal[value*="font-bold"]',
          message: 'font-bold is forbidden. Use font-medium (500) or font-normal (400) only.',
        },
        {
          selector: 'Literal[value*="font-extrabold"]',
          message: 'font-extrabold is forbidden. Use font-medium (500) or font-normal (400) only.',
        },
        {
          selector: 'Literal[value*="font-black"]',
          message: 'font-black is forbidden. Use font-medium (500) or font-normal (400) only.',
        },
      ],
    },
  }
);
