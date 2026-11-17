import FaenaOfferPage from '../../pages/FaenaOfferPage'
import MainAdminPage from '../../pages/MainAdminPage'
import MainClientPage from '../../pages/MainClientPage'
import OfferPage from '../../pages/OfferPage'
import { loginWithSession, verifyLoginSuccessAsAdmin, verifyLoginSuccessAsClient } from './login_helper'

const LOT_ENDPOINT = '**/MODULOS/directo/modulo_crearLote/index.php*'
const OFFER_LOT_ALIAS = 'faenaOfferLot'

// Restores the client session and walks Cotizar > Faena to the offer form.
export function visitFaenaOfferForm(credentials) {
  cy.visit('/__dcac/')
  loginWithSession(credentials.username, credentials.password)
  verifyLoginSuccessAsClient()
  MainClientPage.mainCotizarButton().click()
  OfferPage.offerFaenaButton().click()
  FaenaOfferPage.offerTitle().should('be.visible')
  FaenaOfferPage.societySelect().should('be.visible')
}

// Register BEFORE submitting. Tags only the final offer request (not the partial one of the video flow);
// the UI request is observed, never stubbed or replayed.
export function observeFaenaLotRequest() {
  cy.intercept('POST', LOT_ENDPOINT, (req) => {
    if (!req.url.includes('parcial=true')) req.alias = OFFER_LOT_ALIAS
  })
}

// The response body of the offer request is the plain lot number; the value stays in memory only.
export function captureFaenaLot() {
  return cy.wait(`@${OFFER_LOT_ALIAS}`, { timeout: 60000 }).then(({ response }) => {
    expect(response?.statusCode).to.eq(200)
    const lot = String(response?.body).trim()
    expect(lot, 'lot number returned by the offer request').to.match(/^\d+$/)
    return lot
  })
}

export function captureSubmittedOffer() {
  FaenaOfferPage.selectedSocietyName().as('submittedSociety')
  FaenaOfferPage.selectedEstablishmentName().as('submittedEstablishment')
}

export function validateCreatedLotInAdmin(lotAlias, adminCredentials, expected) {
  cy.visit('/__dcac/?logout')
  cy.visit('/__dcac/')
  loginWithSession(adminCredentials.username, adminCredentials.password, 'admin')
  verifyLoginSuccessAsAdmin()
  cy.intercept(
    'GET',
    '**/MODULOS/listadosAdminNuevos/ajax/ofrecimientos_ajax.php**'
  ).as('loadFaenaOffers')
  MainAdminPage.faenaDropdownMenu().click()
  MainAdminPage.faenaOffersLink().click()
  cy.wait('@loadFaenaOffers', { timeout: 60000 })
    .its('response.statusCode').should('eq', 200)

  cy.get(`@${lotAlias}`).then((lot) => {
    MainAdminPage.searchFaenaOffer(lot)
    MainAdminPage.faenaOfferResult(lot)
    MainAdminPage.viewLegajoButton().click()
    const checks = expected || ['Vaca gorda', 'Aberdeen Angus Negro', '425', 'Feedlot', 'Consumo']
    cy.get('body').should('contain', String(lot))
    checks.forEach((text) => cy.get('body').should('contain', text))
    cy.get('@submittedSociety').then((society) => {
      cy.get('body').should('contain', society)
    })
    cy.get('@submittedEstablishment').then((establishment) => {
      cy.get('body').should('contain', establishment)
    })
  })

  cy.visit('/__dcac/?logout')
}

function lotNumberFromResponse(body) {
  if (typeof body === 'string' && /^\d+$/.test(body.trim())) return body.trim()
  if (body && typeof body === 'object') {
    const candidate = body.lot ?? body.lote ?? body.lotNumber ?? body.numeroLote ?? body.id
    if (candidate !== undefined && /^\d+$/.test(String(candidate))) return String(candidate)
  }
  return null
}

export function validateCreatedReactLotInAdmin(lotAlias, adminCredentials, expected = {}) {
  cy.visit('/__dcac/?logout')
  cy.visit('/__dcac/')
  loginWithSession(adminCredentials.username, adminCredentials.password, 'admin')
  verifyLoginSuccessAsAdmin()
  cy.intercept('GET', '**/MODULOS/listadosAdminNuevos/ajax/ofrecimientos_ajax.php**').as('loadReactFaenaOffers')
  MainAdminPage.faenaDropdownMenu().click()
  MainAdminPage.faenaOffersLink().click()
  cy.wait('@loadReactFaenaOffers', { timeout: 60000 }).its('response.statusCode').should('eq', 200)

  cy.get(`@${lotAlias}`).then((lot) => {
    MainAdminPage.searchFaenaOffer(lot)
    MainAdminPage.faenaOfferResult(lot)
    MainAdminPage.viewLegajoButton().click()
    cy.get('body').should('contain', String(lot))
    Object.entries(expected).forEach(([field, value]) => {
      if (value !== undefined && value !== null) cy.get('body').should('contain', String(value))
    })
  })

  cy.visit('/__dcac/?logout')
}

export { lotNumberFromResponse }
