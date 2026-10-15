# Segurança · site-horus

> Gerado em 15/10/2026 a partir da auditoria de segurança (AUDITORIA.md). [V] = verificado, [NV] = não verificado. Nenhum segredo neste arquivo. Revisar antes do merge.

## Como reportar
sr@logus.agency (interno)

## Controles
- Rate limit: n/a
- Turnstile/captcha: [NV]
- RLS: n/a
- Cloudflare: não (origem exposta)
- HSTS: não

## Riscos abertos (auditoria 15/10)
- P1 `horuscnt.com.br` já está na Cloudflare em DNS only: ligar o proxy é o quick win mais barato do ecossistema.
- P2 `formulario.html` estático: proteção do envio [NV].
- Bom: `register-inbound-lead` é o modelo de referência (Turnstile + rate limit SQL + allowlist).

## Segredos
Ficam no Infisical ou nas envs do Coolify/Supabase. Nunca no Git. Aqui entram só os nomes das variáveis.

## Histórico
- Nenhuma mudança neste repo na noite de 15/10.
