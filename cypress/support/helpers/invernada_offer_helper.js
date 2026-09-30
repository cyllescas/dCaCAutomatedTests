import OfferPage from '../../pages/OfferPage'
import MainClientPage from '../../pages/MainClientPage'
import InvernadaOfferPage from '../../pages/InvernadaOfferPage'

export function openInvernadaOfferForm() {
  MainClientPage.mainCotizarButton().click()
  OfferPage.offerInvernadaButton().click()
  cy.url().should('include', 'solicitud_invernada')
  cy.contains('Publicar una tropa de Invernada').should('be.visible')
}

export function selectExistingInvernadaLocation() {
  InvernadaOfferPage.selectFirstAvailableSociety()
  InvernadaOfferPage.selectFirstAvailableEstablishment()
}
