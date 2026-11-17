require('dotenv/config');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const secretsPath = path.resolve(process.cwd(), '.env');
const initPagePath = path.resolve(process.cwd(), 'scripts', 'playwright-init-page.mjs');
// Sesión guardada con `node scripts/save-auth-state.cjs` (validación de Google en auth.dcac.ar).
// --storage-state sólo aplica a sesiones aisladas, por eso va con --isolated.
const authStatePath = path.resolve(process.cwd(), 'artifacts', 'auth-state.json');
const authStateArgs = fs.existsSync(authStatePath) ? ['--isolated', '--storage-state', authStatePath] : [];
const child = spawn(command, [
  'playwright',
  'mcp',
  '--secrets',
  secretsPath,
  '--init-page',
  initPagePath,
  ...authStateArgs,
], {
  stdio: 'inherit',
  env: process.env,
});

// Prevent an orphaned browser/server when the orchestrator ends the session.
const forwardSignal = (signal) => {
  if (child.exitCode === null) child.kill(signal);
};
process.once('SIGINT', () => forwardSignal('SIGINT'));
process.once('SIGTERM', () => forwardSignal('SIGTERM'));

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
