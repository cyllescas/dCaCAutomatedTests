import LoginPage from "../pages/LoginPage"
import {fillLoginFields, verifyLoginSuccessAsClient} from "./helpers/login_helper"
import {wait_for_page_load} from "./helpers/general_helper"

Cypress.Commands.add('login', (email, password) => {
    fillLoginFields(email, password)
    LoginPage.submitButton().click()
})




