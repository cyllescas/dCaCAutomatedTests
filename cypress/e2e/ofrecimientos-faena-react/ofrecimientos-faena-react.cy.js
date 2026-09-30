import FaenaReactOfferPage from '../../pages/FaenaReactOfferPage'
import { lotNumberFromResponse, validateCreatedReactLotInAdmin } from '../../support/helpers/faena_offer_helper'
import { credentialsFor, loginWithSession, skipWhenCredentialsAreMissing, verifyLoginSuccessAsClient } from '../../support/helpers/login_helper'

const reactOrigin = 'https://react-stage.dcac.ar'
const selectors = FaenaReactOfferPage.selectors()

describe('Ofrecimientos de faena React @faena @ofrecimientos @react @regression @smoke', () => {
  const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')
  const adminCredentials = credentialsFor('TEST_ADMIN_USERNAME', 'TEST_ADMIN_PASSWORD')

  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    cy.visit('/__dcac/')
    loginWithSession(credentials.username, credentials.password)
    verifyLoginSuccessAsClient()
  })

  it('permite seleccionar sociedad y establecimiento en React', () => {
    cy.origin(reactOrigin, { args: { selectors } }, ({ selectors }) => {
      cy.visit('/cotizar/faena')
      cy.contains('Cotizar tropa para Faena', { timeout: 60000 }).should('be.visible')
      cy.get(selectors.society).click()
      cy.get('[name="society"]').not('.add').first().click()
      cy.get(selectors.establishment).should('not.have.class', 'disabled').click()
      cy.get('[name="establishment"]').not('.add').first().click()
    })
  })

  it('valida el formulario React vacío', () => {
    cy.origin(reactOrigin, { args: { selectors } }, ({ selectors }) => {
      cy.visit('/cotizar/faena')
      cy.contains(selectors.submit, 'Cotizar Tropa').click()
      cy.contains('Este campo es obligatorio').should('be.visible')
      cy.contains('Debe haber al menos una raza').should('be.visible')
      cy.url().should('include', '/cotizar/faena')
    })
  })

  it('muestra una sociedad nueva como opción del desplegable', () => {
    const suffix = Date.now()
    cy.origin(reactOrigin, { args: { name: `QA Sociedad ${suffix}`, cuit: `30${String(suffix).slice(-9)}`, selectors } }, ({ name, cuit, selectors }) => {
      cy.visit('/cotizar/faena')
      cy.get(selectors.society).click()
      cy.contains('+ Agregar nueva sociedad').click()
      cy.contains('Razón social *').parent().find('input').type(name)
      cy.contains('CUIT *').parent().find('input').type(cuit)
      cy.contains('button', 'Agregar Sociedad', { exact: true }).click()
      cy.get(selectors.society).should('contain', name)
      cy.get('[name="society"]').contains(name).should('be.visible')
    })
  })

  it('muestra un establecimiento nuevo como opción del desplegable', () => {
    const name = `QA Establecimiento ${Date.now()}`
    cy.origin(reactOrigin, { args: { name, selectors } }, ({ name, selectors }) => {
      cy.visit('/cotizar/faena')
      cy.get(selectors.society).click()
      cy.get('[name="society"]').not('.add').first().click()
      cy.get(selectors.establishment).click()
      cy.contains('+ Agregar nuevo establecimiento').click()
      cy.contains('Nombre del establecimiento *').parent().find('input').type(name)
      cy.contains('button', 'Agregar Establecimiento', { exact: true }).click()
      cy.get(selectors.establishment).should('contain', name)
      cy.get('[name="establishment"]').contains(name).should('be.visible')
    })
  })

  const terminations = ['De Campo', 'Racionada', 'Feedlot']
  const destinations = ['Consumo', 'Exportación Hilton', 'Exportación NO Hilton', 'Cuota 481']

  terminations.forEach((termination) => destinations.forEach((destination) => {
    it(`envía ofrecimiento completo con ${termination} y ${destination}`, function () {
      skipWhenCredentialsAreMissing(this, adminCredentials, 'admin')
      cy.intercept('POST', '**/v1/MisOperaciones/faena/ofrecimiento').as('createReactFaenaOffer')
      cy.origin(reactOrigin, { args: { termination, destination, selectors } }, ({ termination, destination, selectors }) => {
        cy.visit('/cotizar/faena')
        cy.get(selectors.society).click()
        cy.get('[name="society"]').not('.add').first().click()
        cy.get(selectors.establishment).should('not.have.class', 'disabled').click()
        cy.get('[name="establishment"]').not('.add').first().click()
        cy.get(selectors.category).click()
        cy.contains('[name="category"]', 'Vaca gorda').click()
        cy.get(selectors.quantity).clear().type('50')
        cy.get(selectors.breedPicker).click()
        cy.contains('Aberdeen Angus Negro', { exact: true }).click()
        cy.get(selectors.minWeight).clear().type('350')
        cy.get(selectors.averageWeight).clear().type('425')
        cy.get(selectors.maxWeight).clear().type('500')
        cy.contains('button', termination, { exact: true }).click()
        cy.contains('button', destination, { exact: true }).click()
        cy.contains('button', 'No', { exact: true }).click()
        cy.contains('button', 'Sin Encierre', { exact: true }).click()
        cy.get(selectors.desbaste).clear().type('0')
        cy.contains('button', 'Establecimiento', { exact: true }).click()
        cy.get(selectors.distancia).clear().type('10')
        cy.get(selectors.comentario).clear().type(`QA React ${Date.now()}`)
        cy.contains(selectors.submit, 'Cotizar Tropa').click()
        cy.contains('Cotización en Proceso', { timeout: 60000 }).should('be.visible')
        cy.contains('Ir a Mis Operaciones').should('be.visible')
      })
      cy.wait('@createReactFaenaOffer', { timeout: 60000 }).then(({ response }) => {
        const lot = lotNumberFromResponse(response?.body)
        expect(lot, 'React created lot number').to.match(/^\d+$/)
        cy.wrap(lot).as('createdReactLot')
      })
      validateCreatedReactLotInAdmin('createdReactLot', adminCredentials, {
        'Vaca gorda': 'Vaca gorda',
        'Aberdeen Angus Negro': 'Aberdeen Angus Negro',
        '50': '50',
        '350': '350',
        '425': '425',
        '500': '500',
        [termination]: termination,
        [destination]: destination,
      })
    })
  }))
})
