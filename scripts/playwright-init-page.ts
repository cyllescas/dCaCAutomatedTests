import type { Page } from '@playwright/test';
import process from 'node:process';

type LoginRole = 'client' | 'admin' | 'agent' | 'commercial_partner';

const roleToEnvKey: Record<LoginRole, string> = {
  client: 'USER_CLIENT',
  admin: 'USER_ADMIN',
  agent: 'USER_AGENT',
  commercial_partner: 'USER_COMMERCIAL_PARTNER',
};

async function fillLogin(page: Page): Promise<void> {
  if (!page.url().includes('/__dcac/login')) return;

  const role = (process.env.PLAYWRIGHT_MCP_LOGIN_ROLE || 'client') as LoginRole;
  const username = process.env[roleToEnvKey[role]];
  const password = process.env.PASSWORD;
  if (!username || !password) return;

  const fields = page.getByRole('textbox');
  await fields.nth(0).fill(username);
  await fields.nth(1).fill(password);
  await page.getByRole('button', { name: 'INGRESAR' }).click();
}

export default async ({ page }: { page: Page }): Promise<void> => {
  page.on('domcontentloaded', () => fillLogin(page));
};
