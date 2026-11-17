import LoginPage from '../../pages/LoginPage'
import {
  assertInvalidCredentialsAlertFired,
  credentialsFor,
  fillLoginFields,
  login,
  skipWhenCredentialsAreMissing,
  verifyInvalidCredentialsAlert,
  verifyLoginSuccessAsAdmin,
  verifyLoginSuccessAsAgent,
  verifyLoginSuccessAsClient,
  verifyLoginSuccessAsCommercialPartner,
  verifyPasswordFieldError,
  verifyPasswordFieldHasNoVisibleError,
  verifyUsernameFieldError,
  verifyUsernameFieldHasNoVisibleError,
} from '../../support/helpers/login_helper'

const invalidEmail = 'invalid-login@example.test'
const invalidPassword = 'invalid-password-for-test'

describe('Autenticación dCaC', () => {
  let messages

  before(() => {
    cy.fixture('login').then((loginFixture) => {
      messages = loginFixture.messages
    })
  })

  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/')
  })

  describe('Login exitoso por rol', () => {
    it('TC-LOGIN-001: login exitoso como cliente', function () {
      const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')
      skipWhenCredentialsAreMissing(this, credentials, 'client')

      login(credentials.username, credentials.password)
      verifyLoginSuccessAsClient()
    })

    it('TC-LOGIN-002: login exitoso como administrador', function () {
      const credentials = credentialsFor('TEST_ADMIN_USERNAME', 'TEST_ADMIN_PASSWORD')
      skipWhenCredentialsAreMissing(this, credentials, 'admin')

      login(credentials.username, credentials.password)
      verifyLoginSuccessAsAdmin()
    })

    it('TC-LOGIN-003: login exitoso como agente', function () {
      const credentials = credentialsFor('TEST_AGENT_USERNAME', 'TEST_AGENT_PASSWORD')
      skipWhenCredentialsAreMissing(this, credentials, 'agent')

      login(credentials.username, credentials.password)
      verifyLoginSuccessAsAgent()
    })

    it('TC-LOGIN-004: login exitoso como asociado comercial', function () {
      const credentials = credentialsFor(
        'TEST_COMMERCIAL_PARTNER_USERNAME',
        'TEST_COMMERCIAL_PARTNER_PASSWORD',
      )
      skipWhenCredentialsAreMissing(this, credentials, 'commercial partner')

      login(credentials.username, credentials.password)
      verifyLoginSuccessAsCommercialPartner()
    })
  })

  describe('Validaciones del formulario', () => {
    it('TC-LOGIN-005: campos obligatorios', () => {
      LoginPage.submitButton().click()

      verifyUsernameFieldError(messages.emptyField)
      verifyPasswordFieldError(messages.emptyField)
      cy.url().should('include', '/__dcac/login')
    })

    it('TC-LOGIN-006: formato de email inválido', () => {
      fillLoginFields(invalidEmail.replace('@example.test', ''), invalidPassword)
      LoginPage.submitButton().click()

      verifyUsernameFieldError(messages.invalidEmail)
      cy.url().should('include', '/__dcac/login')
    })

    it('TC-LOGIN-008: falta sólo el email', () => {
      fillLoginFields('', invalidPassword)
      LoginPage.submitButton().click()

      verifyUsernameFieldError(messages.emptyField)
      verifyPasswordFieldHasNoVisibleError()
      cy.url().should('include', '/__dcac/login')
    })

    it('TC-LOGIN-009: falta sólo la contraseña', () => {
      fillLoginFields(invalidEmail, '')
      LoginPage.submitButton().click()

      verifyPasswordFieldError(messages.emptyField)
      verifyUsernameFieldHasNoVisibleError()
      cy.url().should('include', '/__dcac/login')
    })
  })

  describe('Credenciales inválidas', () => {
    it('TC-LOGIN-007: credenciales inválidas', () => {
      verifyInvalidCredentialsAlert()
      login(invalidEmail, invalidPassword)

      assertInvalidCredentialsAlertFired()
      cy.url().should('include', '/__dcac/login')
    })
  })
})
