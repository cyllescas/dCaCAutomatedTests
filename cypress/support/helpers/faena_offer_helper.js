import FaenaOfferPage from '../../pages/FaenaOfferPage'
import MainAdminPage from '../../pages/MainAdminPage'
import { loginWithSession, verifyLoginSuccessAsAdmin } from './login_helper'

export function captureSubmittedOffer() {
  FaenaOfferPage.selectedSocietyName().as('submittedSociety')
  FaenaOfferPage.selectedEstablishmentName().as('submittedEstablishment')
}

export function validateCreatedLotInAdmin(lotAlias, adminCredentials) {
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
    cy.get('body').should('contain', String(lot))
      .and('contain', 'Vaca gorda')
      .and('contain', 'Aberdeen Angus Negro')
      .and('contain', '425')
      .and('contain', 'Feedlot')
      .and('contain', 'Consumo')
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
