import LoginPage from "../../pages/LoginPage";
import MainClientPage from "../../pages/MainClientPage";
import MainAdminPage from "../../pages/MainAdminPage";
import MainAgentPage from "../../pages/MainAgentPage";
import MainCommercialPartnerPage from "../../pages/MainCommercialPartnerPage";

export function login(username, password) {
    LoginPage.usernameField().should('be.visible', { timeout: 60000 })
    LoginPage.passwordField().should('be.visible', { timeout: 60000 })
    fillLoginFields(username, password)
    LoginPage.submitButton().should('be.visible', { timeout: 60000 }).click()
}

// Reuses the authenticated browser state during the current Cypress run.
// Keep this separate from `login` because the login suite also exercises
// invalid credentials and must submit the form every time.
export function loginWithSession(username, password, expectedRole = 'client', { landingPath = '/__dcac/' } = {}) {
    cy.session(
        ['dcac-authenticated-user', expectedRole, username],
        () => {
            cy.visit('/__dcac/')
            login(username, password)
            cy.url({ timeout: 60000 }).should('include', '/__dcac/')
            assertLoginFormIsNotVisible()
            assertAuthenticatedView(expectedRole)
        },
        {
            cacheAcrossSpecs: true,
            validate() {
                cy.visit('/__dcac/')
                cy.url({ timeout: 60000 }).should('include', '/__dcac/')
                assertLoginFormIsNotVisible()
                assertAuthenticatedView(expectedRole)
            },
        },
    )

    // cy.session restores state but does not leave the application on the
    // requested page, so put each test back at the authenticated entrypoint
    // (or at the page the caller needs, to avoid an extra navigation).
    cy.visit(landingPath)
}

function assertAuthenticatedView(expectedRole) {
    if (expectedRole === 'admin') {
        MainAdminPage.mainBrowserBar().should('be.visible')
        MainAdminPage.mainNav().should('be.visible')
        MainAdminPage.logoutButton().should('be.visible')
        return
    }

    if (expectedRole === 'client') {
        MainClientPage.mainTitleTendenciasDelMercado().should('be.visible')
    }
}

// The application keeps the login modal markup mounted after authentication.
// Validate the observable state instead of requiring the button to be removed
// from the DOM; a failed login still leaves the form visible.
function assertLoginFormIsNotVisible() {
    cy.get('body', { timeout: 60000 }).should(($body) => {
        expect($body.find('#ingresar_login:visible'), 'login submit button').to.have.length(0)
    })
}

export function credentialsFor(usernameKey, passwordKey) {
    return {
        username: Cypress.env(usernameKey),
        password: Cypress.env(passwordKey),
    }
}

export function skipWhenCredentialsAreMissing(testContext, credentials, role) {
    if (!credentials.username || !credentials.password) {
        cy.log(`Skipped ${role} login: credentials are not configured`)
        testContext.skip()
    }
}

export function fillLoginFields(username, password) {
    if (username) {
        LoginPage.usernameField().should('be.visible', { timeout: 60000 }).type(username)
    }
    if (password) {
        LoginPage.passwordField().should('be.visible', { timeout: 60000 }).type(password)
    }

}

export function verifyLoginSuccessAsClient() {
    cy.location('pathname', { timeout: 60000 }).should('eq', '/__dcac/')
    cy.title({ timeout: 60000 }).should('include', 'Inicio')
    MainClientPage.topBanner().should('be.visible')
    MainClientPage.userMenu().should('be.visible')
    MainClientPage.mainTitleTendenciasDelMercado()
        .should('be.visible')
        .and('contain.text', 'Tendencias del mercado')
}

export function verifyLoginSuccessAsAdmin() {
    // The redirect to the admin shell can take a few seconds.
    cy.location('pathname', { timeout: 60000 }).should('eq', '/')
    cy.title({ timeout: 60000 }).should('include', 'Admin DCAC')
    MainAdminPage.navbar().should('be.visible')
    MainAdminPage.logoutLink().should('be.visible')
    MainAdminPage.liveBoard().should('be.visible')
}

export function verifyLoginSuccessAsAgent() {
    cy.location('pathname', { timeout: 60000 }).should('eq', '/__dcac/')
    cy.title({ timeout: 60000 }).should('include', 'Inicio')
    MainAgentPage.topBanner().should('be.visible')
    MainAgentPage.userMenu().should('be.visible')
    MainAgentPage.clientsNavLink().should('be.visible')
}

export function verifyLoginSuccessAsCommercialPartner() {
    cy.location('pathname', { timeout: 60000 }).should('eq', '/')
    cy.title({ timeout: 60000 }).should('include', 'Admin DCAC')
    MainCommercialPartnerPage.navbar().should('be.visible')
    MainCommercialPartnerPage.logoutLink().should('be.visible')
    MainCommercialPartnerPage.societiesSection().should('be.visible')
    MainCommercialPartnerPage.liveBoard().should('not.exist')
}

// Register before submitting the form. Call assertInvalidCredentialsAlertFired()
// afterwards to fail when the alert never fires.
export function verifyInvalidCredentialsAlert() {
    const alertMessages = []
    cy.wrap(alertMessages, { log: false }).as('loginAlertMessages')
    cy.on('window:alert', (text) => {
        alertMessages.push(text)
    })
}

export function assertInvalidCredentialsAlertFired(expectedMessage = 'Usuario o contraseña incorrectos') {
    cy.get('@loginAlertMessages', { timeout: 60000 }).should((alertMessages) => {
        expect(alertMessages, 'window:alert fired').to.have.length.greaterThan(0)
        expect(alertMessages[0]).to.equal(expectedMessage)
    })
}

export function verifyUsernameFieldError(message) {
    LoginPage.userFieldError().should('be.visible').and('have.text', message)
}

export function verifyPasswordFieldError(message) {
    LoginPage.passwordFieldError().should('be.visible').and('have.text', message)
}

export function verifyUsernameFieldHasNoVisibleError() {
    // Passes if the error label does not exist or exists but is hidden.
    LoginPage.userFieldErrorIfPresent().should(($el) => {
        expect($el.filter(':visible'), 'visible username error labels').to.have.length(0)
    })
}

export function verifyPasswordFieldHasNoVisibleError() {
    LoginPage.passwordFieldErrorIfPresent().should(($el) => {
        expect($el.filter(':visible'), 'visible password error labels').to.have.length(0)
    })
}
