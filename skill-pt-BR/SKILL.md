---
name: teste-integrado
description: Teste integrado ponta a ponta de um sistema com vários papéis/apps conectados (ex.: cliente + garçom + cozinha), usando o sistema de verdade num navegador, esperando os tempos de resposta reais, achando bugs, corrigindo e testando de novo até ficar limpo. Use SOMENTE quando o usuário pedir "teste integrado" (ou "teste ponta a ponta"/"testa tudo junto"). Não rode por conta própria depois de cada feature: é demorado e caro; serve para depois de um bom lote de funcionalidades ou antes de uma entrega.
---

# Teste integrado

Testar o sistema **inteiro e conectado**, como o usuário final vai usar: todos os papéis ao mesmo tempo, cada ação conferida **no outro lado**, com os tempos de resposta medidos. Nasceu num SaaS de restaurantes (cliente + garçom/caixa + cozinha), onde esse método achou dezenas de bugs que teste de tela isolada não achava (veja `examples/case-study.pt-BR.md`).

## Quando usar (e quando não)
- **Usar:** depois de um lote de features, antes de entregar/publicar, quando o usuário disser "teste integrado".
- **Não usar:** a cada feature pequena (use typecheck/build/teste da própria tela). Custa de dezenas de minutos a horas, e quase sempre gera uma rodada de correção e um novo teste.
- Pergunte só se faltar algo que bloqueie (conta de teste, URL). Não peça confirmação do plano: execute.

## Por que funciona
Os bugs que importam moram **nas passagens entre papéis**: dado que some no caminho (observação do cliente que não chegava ao CRM), atualização que demora, botão de "desfazer" que quebra o fluxo do outro lado, aviso que cobre o botão. Só aparecem quando você vê os lados juntos e espera a resposta de verdade.

## O processo (siga na ordem)

### 0. Segurança e limites (antes de tudo)
- Nunca digite senha; peça login manual. Teste só em ambiente de teste/restaurante de teste; em dados reais de terceiros só leia.
- Nada de pagamento real nem mensagem a pessoas reais. Prefixe o que criar com "TESTE" e liste no fim.
- Respeite regras do projeto (commit/push, migrations, CLAUDE.md).

### 1. Preparar o ambiente
- Escolha o ambiente mais fiel e mais barato: **simulador sem banco** (se existir) → **ambiente de teste com dados de seed** → produção só com conta de teste.
- Suba tudo junto (todos os apps) e confirme que cada papel carregou. Aguarde de verdade: o primeiro carregamento em dev é lento (10–20 s); use esperas por condição, nunca `sleep` fixo.
- **Regra de fidelidade:** um simulador só vale se usa os **mesmos componentes e telas** do sistema real, trocando só a origem dos dados. Tela "parecida" ou fluxo "inventado" é bug do simulador e invalida o teste. Faça primeiro a auditoria "o que a demo faz que o real não faz / o real faz que a demo não faz".

### 2. Mapear atores e fluxos
Monte a matriz em `references/matriz-de-cenarios.md`: atores × ações × efeito esperado em cada outro ator × tempo limite. Inclua idas e voltas (desfazer, recusar e refazer, cancelar), campos de texto, todos os botões, interruptores/configurações, papéis com permissão menor, vários itens/pedidos simultâneos e casos de borda (vazio, texto longo, caracteres especiais).

### 3. Rodar o que já está automatizado (linha de base)
Se houver suíte (ver `references/playwright-multi-ator.md`), rode primeiro: ela diz em segundos o que já está quebrado e libera tokens para explorar o resto.

### 4. Exploração guiada (o que a suíte ainda não cobre)
- Use o navegador e **olhe a tela a cada passo** (screenshot com escala 0.5; em lote). Confira o efeito **no outro papel**, não só no que você clicou.
- Meça: ação → efeito visível no outro papel. Compare com o limite da matriz (tempo real percebido: instantâneo na demo; poucos segundos com realtime/polling).
- Observe o que um usuário veria: balão cobrindo botão, texto cortado, botão que pula de lugar, aviso duplicado, estado que não volta, rolagem perdida, acessibilidade (botão sem nome).
- Quando algo parecer "lento" ou "travado", investigue a causa (fila de ações, recarga de página inteira, polling, N chamadas ao banco) antes de remendar.

### 5. Registrar cada bug na hora
Use `references/relatorio-modelo.md`: passos, esperado × obtido, severidade (bloqueia / confunde / cosmético), causa provável. Não corrija durante a exploração do mesmo cenário se isso fizer perder o contexto; anote e siga, depois corrija em lote por causa-raiz.

### 6. Corrigir
- Uma causa-raiz por vez; prefira corrigir a origem (ex.: dado que nunca era enviado) a esconder o sintoma.
- Rode as verificações do projeto (typecheck, build, auditorias) a cada lote.
- **Cada bug achado vira um teste automatizado** (suíte ou teste de modelo) para nunca mais voltar.

### 7. Testar de novo (o passo que mais se pula)
- Refaça o cenário que falhou **e** a regressão completa (corrigir um fluxo quebra outro com frequência: aconteceu várias vezes).
- Critério de saída: **uma rodada completa sem bug novo** e a suíte toda verde. Se a rodada achou algo, volte ao passo 5.

### 8. Entregar
Relate o que foi testado, o que foi corrigido, o que **não** foi testado e por quê (RLS/realtime/permissões reais, integrações externas, mobile), e o que o usuário precisa conferir à mão em produção. Seja honesto: "validado" só vale para o que de fato foi rodado.

## Esperas e tempos de resposta
- Espere por **condição visível** (elemento, texto), com limite de tempo = o tempo máximo aceitável para o usuário. Estourou o limite = bug, não "teste instável".
- Registre a latência medida de cada passagem importante (cliente→garçom, garçom→cozinha, cozinha→garçom…). Ver o helper `latency` em `references/playwright-multi-ator.md`.
- Atualizações por polling têm atraso embutido (ex.: 4–5 s): prefira disparar atualização na hora quando há evento conhecido.

## Armadilhas que já custaram caro
- Testar com tela inventada (a demo não era o sistema real).
- Dar a tarefa por pronta sem retestar o fluxo completo depois da correção.
- Clicar por coordenadas dentro de iframe de outro domínio: lento e frágil; use Playwright (alcança os quadros por seletor) para repetir.
- Elementos que mudam de lugar entre o screenshot e o clique (layout que reflui): espere a condição, tire novo screenshot.
- Estado perdido por HMR/recarga em desenvolvimento: refaça o cenário desde o início.
- Conferir só o lado que você clicou.

## Quando o ambiente simulado não basta
Banco real, RLS, realtime e latência de rede, pagamentos, permissões por papel: teste no ambiente de teste/produção com conta de teste, manualmente ou com a mesma suíte apontada para lá. Diga isso no relatório.

## Arquivos de apoio
- `references/matriz-de-cenarios.md` — modelo e exemplo de matriz.
- `references/relatorio-modelo.md` — registro de bugs e relatório final.
- `references/playwright-multi-ator.md` — como montar a suíte multi-papel (código-base).
- `references/projeto.md` — **crie este arquivo em cada projeto**: como subir os apps, URLs, cenários e o que o ambiente simulado não cobre (modelo em `projeto.modelo.md`).
