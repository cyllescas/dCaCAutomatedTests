class LoginPage{
    usernameField(){
        return cy.get("#maillog");
    }
    passwordField(){
        return cy.get("#password");
    }
    submitButton(){
        return cy.get("#ingresar_login");
    }
    userFieldError(){
        return cy.get('label.error[for="maillog"]'); //Direcion de email no valida..
    }
    passwordFieldError(){
        return cy.get('.error-password'); 
    }
    // Non-failing lookups: jQuery Validate only creates the label for the invalid field,
    // so for a valid field the element may not exist in the DOM.
    userFieldErrorIfPresent(){
        return cy.get('body').then(($body) => $body.find('label.error[for="maillog"]'));
    }
    passwordFieldErrorIfPresent(){
        return cy.get('body').then(($body) => $body.find('.error-password'));
    }
    loginForm(){
        return cy.get('#login_modal');
    }
    // Landing of the php8-upgrade environment: the form lives in `#modalLogin`
    // and is opened by this "INGRESAR" link (`data-target="#modalLogin"`).
    openLoginModalButton(){
        return cy.get('#btn_login');
    }

    // Alternate login path. In stage.dcac.ar the form is already visible; in
    // environments that show the public landing first, the modal is opened
    // with the INGRESAR button. Does nothing when the form is already visible.
    openLoginModalIfNeeded(){
        return cy.get('body', { timeout: 60000 }).then(($body) => {
            if ($body.find('#maillog:visible').length) return;
            this.openLoginModalButton().filter(':visible').first().click();
            // The modal animates and takes the focus when it finishes opening: wait for it before typing.
            cy.get('#modalLogin').should('have.class', 'in');
            this.usernameField().should('be.visible');
        });
    }
}
export default new LoginPage()