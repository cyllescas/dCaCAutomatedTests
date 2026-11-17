// Login manual contra la validación de Google (auth.dcac.ar) para la exploración con Playwright MCP.
// Abre un navegador visible: iniciá sesión vos; las credenciales no pasan por este script ni por Claude.
// Al llegar a stage.dcac.ar guarda las cookies en artifacts/auth-state.json (ignorado por Git).
// Uso: node scripts/save-auth-state.cjs   (luego reiniciar el MCP con /mcp)
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const baseUrl = process.env.TEST_BASE_URL || 'https://stage.dcac.ar/';
const statePath = path.resolve(process.cwd(), 'artifacts', 'auth-state.json');
const timeoutMs = 10 * 60 * 1000;

(async () => {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const host = new URL(baseUrl).host;

  await page.goto(new URL('__dcac/', baseUrl).href);
  console.log('Iniciá sesión con Google en la ventana abierta (tenés 10 minutos)...');
  await page.waitForURL((url) => url.host === host, { timeout: timeoutMs });
  await page.waitForLoadState('domcontentloaded');

  await context.storageState({ path: statePath });
  console.log(`Sesión guardada en ${path.relative(process.cwd(), statePath)}`);
  await browser.close();
})().catch((error) => {
  console.error(`No se pudo guardar la sesión: ${error.message}`);
  process.exit(1);
});
