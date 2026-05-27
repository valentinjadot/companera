import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**", "src/api/specs/generated/**"],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^\\.\\.?/",
              message: "Use @/ imports instead of relative paths.",
            },
            {
              regex: "\\.(hardware|mock)$|/(hardware|mock)$",
              message:
                "Import from the module entry point instead of hardware/mock implementations.",
            },
          ],
        },
      ],
    },
  },
);
