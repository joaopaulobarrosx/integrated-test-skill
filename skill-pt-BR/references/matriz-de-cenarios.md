# Matriz de cenários

Preencha antes de testar. Uma linha = uma passagem entre papéis. A coluna "limite" é o tempo máximo que o usuário aceita esperar.

| # | Ator que age | Ação | Quem deve reagir | Efeito esperado | Limite |
|---|---|---|---|---|---|
| 1 | Cliente | Chama o garçom | Garçom | Cartão "Chamando garçom · Mesa N" | 3 s |
| 2 | Garçom | Atende | Cliente | Aviso "Atendimento confirmado" | 3 s |
| 3 | Cliente | Envia pedido com observações | Garçom, depois cozinha | Observação no cartão; ao aprovar, na cozinha | 3 s |
| 4 | Cozinha | Desfaz (↩) | Garçom | Status volta; nada quebra no fluxo | 3 s |

## Categorias para não esquecer
1. **Fluxo feliz** completo, do primeiro ao último passo.
2. **Idas e voltas:** desfazer, recusar e refazer, cancelar, voltar de tela, reabrir.
3. **Campos de texto:** vazio, acento, `<b>`, `&`, emoji, texto muito longo, só espaços. Confira **onde cada texto reaparece** (cartão, detalhe, cozinha, impressão, histórico).
4. **Todos os botões** de cada tela, inclusive os pouco usados (menu "⋯", confirmações, "Voltar", "Limpar").
5. **Configurações e interruptores** que ligam/desligam funções.
6. **Concorrência:** dois pedidos/chamados ao mesmo tempo, dois operadores, repetir clique rápido.
7. **Permissões por papel:** o que cada papel vê e não pode fazer (no ambiente real).
8. **Dinheiro e números:** totais, taxas, descontos, pagamento parcial, valor acima do saldo, arredondamento.
9. **Tempo:** atraso entre papéis, polling, realtime, timeouts, sessão expirando.
10. **Dispositivos/idiomas:** celular, tema escuro, outros idiomas.
11. **Estados vazios e de erro:** sem dados, falha de rede, resposta lenta.
12. **Acessibilidade básica:** botões com nome, foco, contraste.

## Modo de leitura de resultado
Para cada linha: ✔ passou / ✘ falhou (id do bug) / – não testado (motivo).
