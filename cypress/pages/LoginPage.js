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
}
export default new LoginPage()