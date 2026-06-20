import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: ["src-backup/**", ".next/**", "node_modules/**"],
  },
  {
    rules: {
      // We intentionally use <img> in the storefront to preserve original
      // layout and onError fallbacks; next/image is used where it adds value.
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
