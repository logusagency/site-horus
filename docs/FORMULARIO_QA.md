# Formulário — candidato local de 13/10/2026

O formulário mostra sucesso somente após `response.ok` e `lead_id` UUID válido. Falha HTTP/rede/JSON conserva campos, exibe erro e libera o botão. Aceite versão `horus-contato-2026-10-13` e prova antiautomação seguem no payload. Cada tentativa consome a prova e exige nova verificação. Instagram/e-mail preservam a atribuição por `utm_source`.

`public/horus-lead-config.js` está deliberadamente vazio. Endpoint do projeto oficial, site key pública Turnstile e número oficial de WhatsApp precisam de decisão do Maestro antes de publicar. Sem configuração, o formulário falha fechado e os links WhatsApp não têm destino nem ficam visíveis. Nunca colocar segredo/JWT de serviço nesse arquivo. O browser só carrega o widget após existir configuração; os testes não o carregam.

A rota nginx exata `/formulario` serve `formulario.html` ou 404. O Dockerfile já copia esse HTML e a pasta public. O teste local comprova conteúdo, query da campanha e ausência do fallback para homepage quando o arquivo não existe.

## Reproduzir sem produção

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
python3 tests/test-routes.py
```

Os testes DOM usam jsdom, fetch e widget simulados: 401/400/500/429/rede, JSON/ID inválidos, 200/201, consentimento ausente e retry. Não fazem POST real nem carregam recursos externos. Na execução desta entrega, jsdom foi compartilhado da instalação isolada do lead-flow por `NODE_PATH`; o lockfile deste site também fixa a dependência para uma instalação independente.

O teste de rota constrói imagem nginx local (pode obter a imagem base do registry), executa com `--network none`, sem portas no host, e faz GET apenas no loopback do container descartável. Remove somente seu container. Não executa scripts do navegador nem acessa Supabase.

A versão e texto do aceite devem acompanhar `supabase/functions/_shared/inbound-contract.ts` e a migration do lead-flow. A captação só pode ser publicada junto ao serviço/migration revisados; usar o contrato antigo com este HTML falhará. Integração real, widget/gateway implantado e QA humano no CRM continuam pendentes de autorização. Roteiro: ops/horus-status-1310.md.
