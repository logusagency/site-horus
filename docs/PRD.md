# PRD · site-horus

> Gerado em 15/10/2026 a partir da auditoria de segurança (AUDITORIA.md). [V] = verificado, [NV] = não verificado. Nenhum segredo neste arquivo. Revisar antes do merge.

## Problema
[preencher com o dono do produto]

## Público e mercado (países)
Brasil

## Objetivos e métricas de sucesso
[preencher]

## Escopo (dentro / fora)
No ar: horuscnt.com.br (Coolify site-horus, deploy de Venomwapp/site-horus master)

## Requisitos funcionais
[preencher]

## Requisitos não funcionais
- Disponibilidade: hoje roda sem CDN/WAF e na VPS única 85.31.236.67 (P0 da auditoria), salvo indicação em contrário.
- LGPD/GDPR conforme o mercado acima.

## Riscos e dependências
- P1 `horuscnt.com.br` já está na Cloudflare em DNS only: ligar o proxy é o quick win mais barato do ecossistema.
- P2 `formulario.html` estático: proteção do envio [NV].
- Bom: `register-inbound-lead` é o modelo de referência (Turnstile + rate limit SQL + allowlist).
