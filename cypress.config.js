require('dotenv/config');
const fs = require('fs');
const path = require('path');
const { defineConfig } = require('cypress');
const { createFailureReports } = require('./cypress/reporters/test-report-generator');

function envValue(name, fallback) {
  const value = process.env[name] ?? fallback ?? '';
  return String(value).trim().replace(/^['"]\s*/, '').replace(/[\s'",]+$/, '');
}

module.exports = defineConfig({
  env: {
    TEST_BASE_URL: envValue('TEST_BASE_URL', 'https://stage.dcac.ar/'),
    TEST_USERNAME: envValue('TEST_USERNAME'),
    TEST_PASSWORD: envValue('TEST_PASSWORD', process.env.PASSWORD),
    TEST_ADMIN_USERNAME: envValue('TEST_ADMIN_USERNAME', process.env.USER_ADMIN),
    TEST_ADMIN_PASSWORD: envValue('TEST_ADMIN_PASSWORD', process.env.PASSWORD),
    TEST_CLIENT_USERNAME: envValue('TEST_CLIENT_USERNAME', process.env.USER_CLIENT),
    TEST_CLIENT_PASSWORD: envValue('TEST_CLIENT_PASSWORD', process.env.PASSWORD),
    TEST_AGENT_USERNAME: envValue('TEST_AGENT_USERNAME', process.env.USER_AGENT),
    TEST_AGENT_PASSWORD: envValue('TEST_AGENT_PASSWORD', process.env.PASSWORD),
    TEST_COMMERCIAL_PARTNER_USERNAME: envValue('TEST_COMMERCIAL_PARTNER_USERNAME', process.env.USER_COMMERCIAL_PARTNER),
    TEST_COMMERCIAL_PARTNER_PASSWORD: envValue('TEST_COMMERCIAL_PARTNER_PASSWORD', process.env.PASSWORD),
    user_client: envValue('USER_CLIENT'),
    user_transportes: envValue('USER_TRANSPORTES'),
    user_admin: envValue('USER_ADMIN'),
    user_admin_full: envValue('USAR_ADMIN_FULL', process.env.USER_ADMIN_FULL),
    user_agent: envValue('USER_AGENT'),
    user_commercial_partner: envValue('USER_COMMERCIAL_PARTNER'),
    password: envValue('PASSWORD'),
    user_client_invernada_only: envValue('USER_CLIENT_INVERNADA_ONLY'),
    password_user_client_invernada_only: envValue('PASSWORD_USER_CLIENT_INVERNADA_ONLY')
  },
  e2e: {
    baseUrl: envValue('TEST_BASE_URL', 'https://stage.dcac.ar/'),
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: true,
    screenshotsFolder: 'artifacts/cypress/screenshots',
    videosFolder: 'artifacts/cypress/videos',
    downloadsFolder: 'artifacts/cypress/downloads',
    retries: process.env.CI ? 2 : 0,
    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        if (results && results.tests) createFailureReports(results, config.projectRoot);
      });
      // Lets specs skip cases whose local, non-versioned fixture (e.g. videos) is missing.
      on('task', {
        fileExists(filePath) {
          return fs.existsSync(path.resolve(config.projectRoot, filePath));
        },
      });
      return config;
    },
  },
});
