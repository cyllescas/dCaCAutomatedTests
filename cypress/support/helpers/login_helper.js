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
export function loginWithSession(username, password, expectedRole = 'client') {
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
    // requested page, so put each test back at the authenticated entrypoint.
    cy.visit('/__dcac/')
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

export function fillLoginFields(username, password){
    if (username) {
    LoginPage.usernameField().should('be.visible', { timeout: 60000 }).type(username)
  }

  if (password) {
    LoginPage.passwordField().should('be.visible', { timeout: 60000 }).type(password)
  }
    
}

export function verifyLoginSuccessAsClient(){
    cy.url({ timeout: 60000 }).should('include', '/__dcac/')
    MainClientPage.mainBody().should('be.visible')
    MainClientPage.mainTitleTendenciasDelMercado().should('be.visible')
    
}

export function verifyLoginSuccessAsAdmin(){
    cy.url({ timeout: 60000 }).should('include', '/__dcac/')  
    MainAdminPage.mainBrowserBar().should('be.visible')
    MainAdminPage.mainNav().should('be.visible')
    MainAdminPage.logoutButton().should('be.visible')

}

export function verifyLoginSuccessAsAgent(){
    cy.url({ timeout: 60000 }).should('include', '/__dcac/')
    MainAgentPage.mainBody().should('be.visible')
    MainAgentPage.mainTitleTendenciasDelMercado().should('be.visible')
    MainAgentPage.mainTopNavbar().should('be.visible')

}
export function verifyLoginSuccessAsCommercialPartner(){
    cy.url({ timeout: 60000 }).should('include', '/__dcac/')
    MainCommercialPartnerPage.mainBody().should('be.visible')
    MainCommercialPartnerPage.mainBrowserBar().should('be.visible')
    MainCommercialPartnerPage.mainCompaniesList().should('be.visible')
}

export function verifyInvalidCredentialsAlert(){
    cy.on('window:alert', (text) => {
    expect(text).to.equal('Usuario o contraseña incorrectos')
})
}

export function verifyUsernameFieldError(message){
    LoginPage.userFieldError().should('have.text', message)
}

export function verifyPasswordFieldError(message){
    LoginPage.passwordFieldError().should('have.text', message)
}



