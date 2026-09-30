require('dotenv/config');
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const out = path.resolve('artifacts/home-exploration');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, recordVideo: { dir: out } });
  const page = await context.newPage();
  const consoleMessages = [];
  const pageErrors = [];
  const dialogs = [];
  const requests = [];
  page.on('response', response => { if (response.url().includes('login') || response.url().includes('session') || response.url().includes('reload')) requests.push({ url: response.url(), status: response.status() }); });
  page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => pageErrors.push(String(err)));
  page.on('dialog', async dialog => { dialogs.push({ type: dialog.type(), message: dialog.message() }); await dialog.dismiss(); });
  const base = 'https://react-stage.dcac.ar/';
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.screenshot({ path: path.join(out, '01-initial.png'), fullPage: true });
  const initial = { url: page.url(), title: await page.title(), text: (await page.locator('body').innerText()).slice(0, 12000) };
  if (await page.locator('#floatingEmailLogin').count()) {
    await page.locator('#floatingEmailLogin').fill(process.env.USER_CLIENT_INVERNADA_ONLY || '');
    await page.locator('#floatingPasswordLogin').fill(process.env.PASSWORD_USER_CLIENT_INVERNADA_ONLY || '');
    await page.locator('button.form-login').click({ force: true });
    await page.waitForTimeout(10000);
  }
  if (page.url().includes('/login')) {
    await page.goto('https://stage.dcac.ar/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    if (await page.locator('#maillog').count()) {
      await page.locator('#maillog').fill(process.env.USER_CLIENT_INVERNADA_ONLY || '');
      await page.locator('#password').fill(process.env.PASSWORD_USER_CLIENT_INVERNADA_ONLY || '');
      await page.locator('#ingresar_login').click({ force: true });
      await page.waitForTimeout(10000);
    }
    await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);
  }
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(out, '02-home.png'), fullPage: true });
  const selectors = await page.locator('body').evaluate(() => {
    const els = [...document.querySelectorAll('button,a,input,select,[role="button"],[role="tab"],[role="combobox"]')];
    return els.map((e, i) => ({ i, tag: e.tagName, id: e.id, cls: e.className, role: e.getAttribute('role'), text: (e.innerText || e.getAttribute('aria-label') || e.getAttribute('placeholder') || '').trim().slice(0, 200), href: e.getAttribute('href') })).filter(x => x.text || x.id || x.href);
  });
  const bodyText = await page.locator('body').innerText();
  const links = await page.locator('a').evaluateAll(as => as.map(a => ({ text: (a.innerText || '').trim(), href: a.href })).filter(x => x.text || x.href));
  const result = { initial, final: { url: page.url(), title: await page.title(), text: bodyText.slice(0, 20000) }, selectors, links, consoleMessages, pageErrors, dialogs, requests };
  fs.writeFileSync(path.join(out, 'exploration.json'), JSON.stringify(result, null, 2));
  await context.close();
  await browser.close();
  console.log(JSON.stringify({ url: result.final.url, title: result.final.title, text: result.final.text.slice(0, 6000), selectors: selectors.slice(0, 100), consoleMessages, pageErrors, dialogs, requests }, null, 2));
})().catch(err => { console.error(err); process.exitCode = 1; });
