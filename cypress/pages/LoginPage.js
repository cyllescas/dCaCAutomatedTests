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
        return cy.get(':nth-child(2) > label.error'); //Direcion de email no valida..
    }
    passwordFieldError(){
        return cy.get('.error-password'); 
    }
}
export default new LoginPage()