import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // react-three-fiber is built on mutation: geometry is seeded with
    // Math.random() inside useMemo, and the per-frame useFrame callback mutates
    // uniforms directly. Both run outside React's render pass, but the React
    // Compiler lint rules can't see that, so we relax purity checks for the
    // WebGL layer only. The measure-then-setState effect in use-quality is a
    // deliberate one-time capability probe that has to read `navigator`.
    files: ["src/components/three/**"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/react-compiler": "off",
    },
  },
]);

export default eslintConfig;
