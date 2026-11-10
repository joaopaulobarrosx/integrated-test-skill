# Estudo de caso: um SaaS de restaurantes

Sistema com três papéis conectados: o **cliente** (cardápio no celular da mesa), o **garçom/caixa** (painel) e a **cozinha** (painel). Um simulador sem banco ligava os três na mesma página por mensagens entre quadros.

## O que o teste integrado achou (tipos de bug)
- **Dado perdido na passagem:** a observação escrita pelo cliente não chegava ao painel do garçom.
- **Atraso percebido:** o cliente só via "pedido aprovado" até 5 s depois (consulta periódica), enquanto o garçom já tinha aprovado.
- **Desfazer quebrando o fluxo:** o botão "voltar" da cozinha deixava o roteiro guiado num passo que não existia mais.
- **Interface atrapalhando:** balão de ajuda cobrindo campos e botões; botões que pulavam de lugar quando outro elemento aparecia.
- **Simulador diferente do real:** o garçom da demo não podia abrir mesa nem editar pedido, ao contrário do sistema de verdade. Lição: **simulador só vale se usa os mesmos componentes**.
- **Acessibilidade:** botão só com ícone, sem nome para leitor de tela.
- **Lentidão fora da demo:** a reordenação de categorias fazia uma gravação por item e recarregava a página inteira a cada clique; cliques seguidos entravam numa fila.

## O método que funcionou
1. Auditar o simulador contra o sistema real e fazer os dois iguais.
2. Mapear cenários e testar com todos os papéis visíveis ao mesmo tempo.
3. Registrar, corrigir por causa-raiz e **retestar tudo**.
4. Transformar cada bug em teste automatizado (Playwright) e o modelo de dados em teste unitário.

## Números
Suíte final: 10 cenários multi-papel em ~40 s, contra a produção, sem efeitos colaterais (o simulador não usa banco).
