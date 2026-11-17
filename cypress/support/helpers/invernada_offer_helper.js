import OfferPage from '../../pages/OfferPage'
import MainClientPage from '../../pages/MainClientPage'
import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import { loginWithSession } from './login_helper'

export const INVERNADA_OFFER_PATH = '/__dcac/venderHacienda?solicitud_invernada&rapido'

// Walks the menu (Cotizar > Invernada/Cría). Use it only for the case that
// validates the navigation; every other case should use visitInvernadaOfferForm.
export function openInvernadaOfferForm() {
  MainClientPage.mainCotizarButton().click()
  OfferPage.offerInvernadaButton().click()
  cy.url().should('include', 'solicitud_invernada')
  cy.contains('Publicar una tropa de Invernada').should('be.visible')
}

// Restores the authenticated session and lands directly on the offer form.
export function visitInvernadaOfferForm(credentials) {
  loginWithSession(credentials.username, credentials.password, 'client', { landingPath: INVERNADA_OFFER_PATH })
  InvernadaOfferPage.societySelect().should('be.visible')
}

export function selectExistingInvernadaLocation() {
  InvernadaOfferPage.selectFirstAvailableSociety()
  InvernadaOfferPage.selectFirstAvailableEstablishment()
}
