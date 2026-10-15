# Regras · site-horus

> Gerado em 15/10/2026 a partir da auditoria de segurança (AUDITORIA.md). [V] = verificado, [NV] = não verificado. Nenhum segredo neste arquivo. Revisar antes do merge.

## Nunca fazer
- Publicar sem PR, commitar .env ou segredo, mexer em produção sem aprovação.
- Force push, drop de tabela ou DNS destrutivo.

## Sempre fazer
- Mudança incremental e reversível, com rollback escrito.
- Validar com curl, health check e logs antes de dar como pronto.
- Dados de cada parceiro no projeto do próprio parceiro.

## Regras de negócio
[R1...]
