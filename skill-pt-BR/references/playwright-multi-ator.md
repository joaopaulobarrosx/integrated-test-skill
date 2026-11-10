# Suíte multi-papel com Playwright

Por quê: o navegador que o agente usa interativamente só clica por coordenadas dentro de quadros (iframes) de outro domínio, o que é lento e frágil. O Playwright alcança os quadros por seletor (`frameLocator`), espera por condição e roda tudo em segundos. Cada cenário explorado à mão vira um teste que roda a cada mudança.

## Montagem (uma vez por projeto)
```bash
npm i -D @playwright/test
# usa o Chrome já instalado (não baixa navegador):  channel: "chrome"
```
`playwright.config.ts`:
```ts
import { defineConfig } from "@playwright/test"
export default defineConfig({
  testDir: "./e2e", timeout: 120_000, expect: { timeout: 8_000 },
  fullyParallel: true, workers: 2,
  reporter: [["list"], ["html", { open: "never", outputFolder: "e2e-report" }]],
  use: { baseURL: process.env.E2E_BASE_URL ?? "https://exemplo.com", channel: "chrome",
         viewport: { width: 1470, height: 900 }, screenshot: "only-on-failure", trace: "retain-on-failure" },
})
```
`package.json`: `"e2e": "playwright test"`. Adicione `e2e-report/` e `test-results/` ao `.gitignore`.

## Ajudante dos papéis (`e2e/sim.ts`)
```ts
export async function openSim(page, info, flags = {}) {
  await page.goto("/pagina-do-simulador")
  const a = page.frameLocator('iframe[src*="role=a"]')   // papel A
  const b = page.frameLocator('iframe[src*="role=b"]')   // papel B
  // ... ligar o simulador, esperar CONDIÇÕES (elemento visível), nunca sleep
  return { page, a, b,
    // mede ação → efeito em outro papel e falha se passar do limite
    latency: async (label, limitMs, action, effect) => {
      const t0 = Date.now(); await action()
      await expect(effect).toBeVisible({ timeout: limitMs })
      info.annotations.push({ type: "latência", description: `${label}: ${Date.now() - t0} ms (limite ${limitMs} ms)` })
    } }
}
```

## Boas práticas que valeram
- **Marcadores de teste estáveis** (`data-demo`/`data-testid`) nos botões-chave; o resto, pelo texto que o usuário vê (`getByRole`, `getByText`).
- Cuidado com papéis ARIA: opções de pagamento eram `radio`, não `button`; o teste falhou por isso, não o sistema. Em dúvida, olhe o screenshot da falha e o `error-context.md`.
- `strict mode violation` = o seletor pegou mais de um elemento: refine (`getByLabel`, `.first()`, `exact: true`).
- Um teste = um fluxo completo com vários papéis, conferindo o efeito **no outro lado**.
- Teste de modelo (reducer/regra pura) à parte, rodando em milissegundos (`node --experimental-strip-types`).
- Rode contra produção quando o ambiente for sem efeito colateral (demo sem banco); aponte `E2E_BASE_URL` para local para testar antes de publicar.

## Comandos
```bash
npm run e2e                      # tudo, contra a URL padrão
E2E_BASE_URL=http://localhost:3459 npm run e2e
npx playwright test -g "conta"   # só um cenário
npx playwright show-report e2e-report
```
CI: um passo `npm run e2e` depois do deploy de preview (exige escopo `workflow` no token do GitHub para criar o arquivo do workflow).
