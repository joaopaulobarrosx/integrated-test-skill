# Registro de bugs e relatório

## Registro (um por bug, preencha na hora)

```
B-07  [confunde]  Observação do cliente não chega ao CRM
Cenário:   3 (cliente envia pedido com observações)
Passos:    cliente escreve "sem cebola" no item e envia → garçom abre o cartão
Esperado:  "Obs.: sem cebola" no cartão e na mesa
Obtido:    cartão sem observação
Causa:     a demo não enviava o campo notes (o CRM real mostrava)
Correção:  enviar notes por linha e no pedido; mostrar no cartão
Retestado: sim — rodada 2 (cenário 3 + regressão completa)
Teste automatizado: e2e/salao.spec.ts › "pedido: observações chegam…"
```

Severidade: **bloqueia** (fluxo não conclui) · **confunde** (conclui, mas o usuário erra ou duvida) · **cosmético**.

## Relatório final (modelo)

1. **Escopo:** o que foi testado (atores, fluxos, ambiente, data).
2. **Resultado:** N cenários, N passaram, N bugs achados, N corrigidos, N pendentes.
3. **Bugs corrigidos** (uma linha cada: o que era, a causa, como foi corrigido).
4. **Latências medidas** (tabela passagem → ms → limite).
5. **Não testado e por quê** (ambiente real, permissões, integrações, mobile…).
6. **O que o usuário precisa conferir à mão em produção.**
7. **Testes automatizados novos** e como rodar (`npm run e2e`).
8. **Critério de saída atingido?** (uma rodada completa sem bug novo + suíte verde).

Tom: direto, sem exagero. Diga "validado" só para o que foi rodado.
