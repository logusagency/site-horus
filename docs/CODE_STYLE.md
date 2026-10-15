# Estilo de código · site-horus

> Gerado em 15/10/2026 a partir da auditoria de segurança (AUDITORIA.md). [V] = verificado, [NV] = não verificado. Nenhum segredo neste arquivo. Revisar antes do merge.

- TypeScript strict onde houver TS.
- Lint/format: usar o que o repo já tem (ESLint/Prettier ou Biome); não misturar.
- Proibido criar `components/ui` novo localmente; usar `@logus/design-system` quando disponível.
- Testes mínimos por PR: os que tocam a mudança e o build passando.
- Commits: convencionais (feat/fix/security/docs). PR com revisão.
