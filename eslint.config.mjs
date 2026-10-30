import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      ".next/**",
      ".next-build/**",
      ".agents/**",
      ".codex/**",
      ".serena/**",
      "node_modules/**",
      "public/**",
      "graphify-out/**",
      "services/**",
      "scripts/**",
      "src/scripts/**",
      "tailwind.config.js",
    ],
  },
];

export default eslintConfig;