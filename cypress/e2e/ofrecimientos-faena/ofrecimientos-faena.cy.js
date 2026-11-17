import FaenaOfferPage from '../../pages/FaenaOfferPage'
import { credentialsFor, skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import {
  captureFaenaLot,
  observeFaenaLotRequest,
  validateCreatedLotInAdmin,
  visitFaenaOfferForm,
} from '../../support/helpers/faena_offer_helper'

const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')
const adminCredentials = credentialsFor('TEST_ADMIN_USERNAME', 'TEST_ADMIN_PASSWORD')

describe('Ofrecimientos de faena: acceso y altas @faena @ofrecimientos @regression @smoke', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitFaenaOfferForm(credentials)
  })

  it('permite acceder al formulario de faena', () => {
    FaenaOfferPage.societySelect().should('be.visible')
    FaenaOfferPage.selectFirstAvailableSociety()
    FaenaOfferPage.establishmentSelect().should('be.visible')
    FaenaOfferPage.submitButton().should('be.visible')
  })

  it('valida altas vacías de sociedad y establecimiento', () => {
    FaenaOfferPage.selectFirstAvailableSociety()

    FaenaOfferPage.openNewEstablishment()
    FaenaOfferPage.establishmentSaveButton().click()
    FaenaOfferPage.establishmentModal().should('contain', 'Debe completar el campo nombre')

    FaenaOfferPage.establishmentModal().find('button').first().click()
    FaenaOfferPage.openNewSociety()
    FaenaOfferPage.societySaveButton().click()
    FaenaOfferPage.societyModal().should('contain', 'Debe completar el campo Razon Social')
    FaenaOfferPage.societyModal().should('contain', 'Debe completar el cuit con 11 dígitos')
  })
})

// These cases create real tropas / society data in stage: no @smoke.
describe('Ofrecimientos de faena: altas y trazabilidad @faena @ofrecimientos @regression', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitFaenaOfferForm(credentials)
  })

  it('crea una sociedad nueva y la deja disponible para seleccionar', () => {
    FaenaOfferPage.createSocietyAtRuntime()
    FaenaOfferPage.societySelect().should('not.have.value', '')
  })

  it('crea un establecimiento nuevo y lo deja disponible para seleccionar', () => {
    FaenaOfferPage.selectFirstAvailableSociety()
    FaenaOfferPage.createEstablishmentAtRuntime()
    FaenaOfferPage.establishmentSelect().should('not.have.value', '')
  })

  it('crea un ofrecimiento y lo muestra en pendientes de publicación', function () {
    skipWhenCredentialsAreMissing(this, adminCredentials, 'admin')
    observeFaenaLotRequest()
    FaenaOfferPage.fillValidOffer()
    FaenaOfferPage.captureSelectedLocation()
    FaenaOfferPage.submitOffer()

    captureFaenaLot().then((lot) => {
      cy.wrap(lot).as('createdLot')
      FaenaOfferPage.confirmationMessage().should('be.visible')
      FaenaOfferPage.operationsLink().click()
      FaenaOfferPage.assertPendingOffer(lot, { category: 'Vaca gorda', weight: '425' })
    })
    validateCreatedLotInAdmin('createdLot', adminCredentials)
  })

  it('busca el ofrecimiento creado por lote y abre su legajo en admin', function () {
    skipWhenCredentialsAreMissing(this, adminCredentials, 'admin')
    observeFaenaLotRequest()
    FaenaOfferPage.fillValidOffer()
    FaenaOfferPage.captureSelectedLocation()
    FaenaOfferPage.submitOffer()

    captureFaenaLot().then((lot) => cy.wrap(lot).as('createdLotForAdmin'))
    validateCreatedLotInAdmin('createdLotForAdmin', adminCredentials)
  })
})
