# integrated-test (teste integrado) — uma skill para o Claude Code

> 🇬🇧 English: [README.md](README.md)

**Teste integrado ponta a ponta** de sistemas com vários papéis conectados (por exemplo cliente + atendente + cozinha): o agente usa o sistema de verdade num navegador, confere o efeito **no outro lado** de cada ação, mede os tempos de resposta, registra os bugs, corrige e **testa tudo de novo** até uma rodada sair limpa.

## Por que existe

Bugs importantes moram **nas passagens entre papéis**, não dentro de uma tela: um texto que o cliente escreve e nunca chega ao atendente, uma atualização que demora, um botão "desfazer" que quebra o fluxo do outro lado, um aviso que cobre o botão. Teste de tela isolada não vê isso. Testar todos os papéis **ao mesmo tempo**, olhando a resposta real, vê. Veja o [estudo de caso](examples/case-study.pt-BR.md).

## O que a skill faz

Quando você pede **"teste integrado"**, o Claude segue um processo de 8 passos:

1. **Segurança e limites** (sem senhas, só ambiente de teste, nada de pagamento ou mensagem reais).
2. **Preparar o ambiente** (de preferência um simulador sem banco que use os *mesmos componentes* do sistema real).
3. **Mapear atores e fluxos** numa matriz (ator → ação → quem reage → efeito → tempo limite).
4. **Rodar a suíte automatizada** como linha de base.
5. **Explorar à mão** o que a suíte não cobre, olhando a tela de cada papel e medindo ação → efeito.
6. **Registrar cada bug** na hora (passos, esperado × obtido, severidade, causa).
7. **Corrigir e testar de novo**, a regressão completa. Critério de saída: uma rodada inteira sem bug novo.
8. **Relatar** o que foi testado, corrigido e **o que não foi coberto**.

Ela foi escrita para **não** rodar sozinha depois de cada feature: o teste integrado é demorado e caro, e serve para depois de um bom lote de funcionalidades ou antes de uma entrega.

## Instalação

Pré-requisito: [Claude Code](https://claude.com/claude-code).

```bash
git clone https://github.com/joaopaulobarrosx/integrated-test-skill.git
cd integrated-test-skill

./install.sh --lang pt-BR            # global: vale para todos os projetos (~/.claude/skills)
./install.sh --project --lang pt-BR  # só no projeto atual (./.claude/skills), rode dentro do projeto
./install.sh                         # versão em inglês da skill (integrated-test)
```

Ou copie à mão a pasta `skill-pt-BR/` para `~/.claude/skills/teste-integrado/` (global) ou `.claude/skills/teste-integrado/` (dentro do projeto). Reinicie o Claude Code.

## Como usar

1. Em cada projeto, copie `references/projeto.modelo.md` para `references/projeto.md` (dentro da skill instalada) e preencha: como subir os apps, URLs, onde fica a suíte e **o que o ambiente de teste não cobre**.
2. (Recomendado) Monte a suíte automatizada com Playwright usando os exemplos em [`examples/playwright`](examples/playwright) e a receita em [`skill-pt-BR/references/playwright-multi-ator.md`](skill-pt-BR/references/playwright-multi-ator.md).
3. No Claude Code, peça: **"teste integrado"** (ou "teste ponta a ponta", "testa tudo junto").

## O que tem aqui

| Caminho | Para quê |
|---|---|
| `skill-pt-BR/SKILL.md` | A skill (versão em português; a versão em inglês está em `skill/`): quando usar, o processo, esperas e tempos, armadilhas |
| `skill-pt-BR/references/matriz-de-cenarios.md` | Modelo de matriz e categorias de cenário (texto, idas e voltas, concorrência, dinheiro, tempo…) |
| `skill-pt-BR/references/relatorio-modelo.md` | Registro de bug e relatório final |
| `skill-pt-BR/references/playwright-multi-ator.md` | Como montar a suíte multi-papel e medir latência |
| `skill-pt-BR/references/projeto.modelo.md` | Modelo do arquivo específico de cada projeto |
| `examples/playwright/` | Config, ajudante de papéis (`sim.ts`) e um teste de exemplo (em inglês) |
| `examples/case-study.pt-BR.md` | O que o método achou num SaaS de restaurantes (em inglês: `examples/case-study.md`) |
| `install.sh` | Instala a skill (global ou no projeto) |

## Princípios

- **Fidelidade primeiro:** um simulador só vale se usa os mesmos componentes do sistema real; fluxo "inventado" invalida o teste.
- **Olhe o outro lado:** toda ação é conferida no papel que deveria reagir.
- **Espere por condição, não por tempo:** o limite de espera é o que o usuário aceita; estourou, é bug.
- **Cada bug vira teste:** automatize o que o teste manual achou.
- **Seja honesto no relatório:** "validado" só vale para o que foi de fato rodado, e o que o ambiente simulado não cobre fica explícito.

## Contribuindo

Sugestões e *pull requests* são bem-vindos, em especial: novos exemplos de suíte (outros frameworks), categorias de cenário e traduções.

## Licença

[MIT](LICENSE) © 2026 Joao Barros
