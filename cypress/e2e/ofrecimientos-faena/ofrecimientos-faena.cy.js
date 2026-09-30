import OfferPage from '../../pages/OfferPage'
import FaenaOfferPage from '../../pages/FaenaOfferPage'
import { credentialsFor, loginWithSession, skipWhenCredentialsAreMissing, verifyLoginSuccessAsClient } from '../../support/helpers/login_helper'
import { captureSubmittedOffer, validateCreatedLotInAdmin } from '../../support/helpers/faena_offer_helper'

describe('Ofrecimientos de faena @faena @ofrecimientos @regression @smoke', () => {
  const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')
  const adminCredentials = credentialsFor('TEST_ADMIN_USERNAME', 'TEST_ADMIN_PASSWORD')

  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    cy.visit('/__dcac/')
    loginWithSession(credentials.username, credentials.password)
    verifyLoginSuccessAsClient()
  })

  it('permite acceder al formulario de faena', () => {
    cy.get('#btn_vender').click()
    cy.contains('Cotizar lote para Faena').click()

    cy.url().should('include', 'solicitud_directo')
    cy.contains('Publicar una tropa de Gordo').should('be.visible')
    FaenaOfferPage.societySelect().should('be.visible')
    FaenaOfferPage.selectFirstAvailableSociety()
    FaenaOfferPage.establishmentSelect().should('be.visible')
    cy.contains('Ofrecer tropa').should('be.visible')
  })

  it('valida altas vacías de sociedad y establecimiento', () => {
    cy.get('#btn_vender').click()
    OfferPage.offerFaenaButton().click()
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

  it('valida todos los campos obligatorios con el formulario vacío', () => {
    cy.get('#btn_vender').click()
    OfferPage.offerFaenaButton().click()
    FaenaOfferPage.submitEmptyOffer()
    FaenaOfferPage.visibleValidationMessages()
    cy.contains('Publicar una tropa de Gordo').should('be.visible')
  })

  const combinations = [
    ...['a_campo', 'racionado', 'feedlot'].flatMap((termination) =>
      ['consumo', 'hilton', 'UE', 'cuota'].flatMap((destination) =>
        ['a_retirar', 'puesto_planta'].map((freight) => ({ termination, destination, freight })))),
  ]

  combinations.forEach(({ termination, destination, freight }) => {
    it(`crea ofrecimiento con ${termination}, ${destination} y ${freight}`, function () {
      skipWhenCredentialsAreMissing(this, adminCredentials, 'admin')
      cy.intercept('POST', '**/MODULOS/directo/modulo_crearLote/index.php').as('createFaenaLot')
      cy.get('#btn_vender').click()
      OfferPage.offerFaenaButton().click()
      FaenaOfferPage.fillValidOffer({ termination, destination, freight })
      captureSubmittedOffer()
      FaenaOfferPage.submitOffer()
      cy.wait('@createFaenaLot', { timeout: 60000 }).then(({ response }) => {
        expect(response?.statusCode).to.eq(200)
        expect(String(response?.body).trim()).to.match(/^\d+$/)
        cy.wrap(String(response.body).trim()).as('createdLotForAdmin')
      })
      FaenaOfferPage.confirmationMessage().should('be.visible')
      validateCreatedLotInAdmin('createdLotForAdmin', adminCredentials)
    })
  })

  it('crea una sociedad nueva y la deja disponible para seleccionar', () => {
    cy.get('#btn_vender').click()
    OfferPage.offerFaenaButton().click()
    FaenaOfferPage.createSocietyAtRuntime()
    FaenaOfferPage.societySelect().should('not.have.value', '')
  })

  it('crea un establecimiento nuevo y lo deja disponible para seleccionar', () => {
    cy.get('#btn_vender').click()
    OfferPage.offerFaenaButton().click()
    FaenaOfferPage.selectFirstAvailableSociety()
    FaenaOfferPage.createEstablishmentAtRuntime()
    FaenaOfferPage.establishmentSelect().should('not.have.value', '')
  })

  it('crea un ofrecimiento y lo muestra en pendientes de publicación', () => {
    skipWhenCredentialsAreMissing(cy.state('runnable').ctx, adminCredentials, 'admin')
    cy.intercept('POST', '**/MODULOS/directo/modulo_crearLote/index.php').as('createFaenaLot')
    cy.get('#btn_vender').click()
    OfferPage.offerFaenaButton().click()
    FaenaOfferPage.fillValidOffer()
    captureSubmittedOffer()
    FaenaOfferPage.submitOffer()

    cy.wait('@createFaenaLot', { timeout: 60000 }).then(({ response }) => {
      expect(response?.statusCode).to.eq(200)
      expect(String(response?.body).trim()).to.match(/^\d+$/)
      cy.wrap(String(response.body).trim()).as('createdLot')
    })

    FaenaOfferPage.confirmationMessage().should('be.visible')
    FaenaOfferPage.operationsLink().click()

    cy.origin('https://react-stage.dcac.ar', { args: {} }, () => {
      cy.get('a[href="/operacion/faena/venta/pendiente-publicacion"]', { timeout: 60000 })
        .filter(':visible').first().should('be.visible')
      cy.get('main').should('contain', 'Operaciones').and('contain', 'Venta para faena')
    })

    cy.get('@createdLot').then((lot) => {
      cy.origin('https://react-stage.dcac.ar', { args: { lot: String(lot) } }, ({ lot }) => {
        cy.contains(`#${lot}`, { timeout: 60000 }).should('be.visible')
        cy.get('main').should('contain', 'Vaca gorda')
          .and('contain', '425 Kg')
          .and('contain', 'Feedlot')
          .and('contain', 'Consumo')
      })
    })
    validateCreatedLotInAdmin('createdLot', adminCredentials)
  })

  it('busca el ofrecimiento creado por lote y abre su legajo en admin', function () {
    skipWhenCredentialsAreMissing(this, adminCredentials, 'admin')
    cy.intercept('POST', '**/MODULOS/directo/modulo_crearLote/index.php').as('createFaenaLot')
    cy.get('#btn_vender').click()
    OfferPage.offerFaenaButton().click()
    FaenaOfferPage.fillValidOffer()
    FaenaOfferPage.selectedSocietyName().as('submittedSociety')
    FaenaOfferPage.selectedEstablishmentName().as('submittedEstablishment')
    FaenaOfferPage.submitOffer()

    cy.wait('@createFaenaLot', { timeout: 60000 }).then(({ response }) => {
      expect(response?.statusCode).to.eq(200)
      expect(String(response?.body).trim()).to.match(/^\d+$/)
      cy.wrap(String(response.body).trim()).as('createdLotForAdmin')
    })

    validateCreatedLotInAdmin('createdLotForAdmin', adminCredentials)
  })
})
