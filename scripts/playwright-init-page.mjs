import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

// Optional role override, re-read on every login so the role can change without restarting the MCP.
const roleFile = path.resolve(process.cwd(), 'artifacts', '.mcp-login-role');

function currentRole() {
  try {
    const fromFile = fs.readFileSync(roleFile, 'utf8').trim();
    if (fromFile) return fromFile;
  } catch {}
  return process.env.PLAYWRIGHT_MCP_LOGIN_ROLE || 'client';
}

const roleToEnvKey = {
  client: 'USER_CLIENT',
  admin: 'USER_ADMIN',
  agent: 'USER_AGENT',
  commercial_partner: 'USER_COMMERCIAL_PARTNER',
};

async function fillLogin(page) {
  if (!page.url().includes('/__dcac/login')) return;

  // PLAYWRIGHT_MCP_LOGIN_ROLE=none disables auto-login (e.g. to explore the login form itself).
  const role = currentRole();
  if (role === 'none') return;

  const envKey = roleToEnvKey[role];
  const username = envKey && process.env[envKey];
  const password = process.env.PASSWORD;
  if (!username || !password) return;

  const fields = page.getByRole('textbox');
  await fields.nth(0).fill(username);
  await fields.nth(1).fill(password);
  await page.getByRole('button', { name: 'INGRESAR' }).click();
}

export default async ({ page }) => {
  page.on('domcontentloaded', () => fillLogin(page));
};
