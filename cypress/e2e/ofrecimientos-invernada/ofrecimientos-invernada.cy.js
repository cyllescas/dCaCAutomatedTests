import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import { credentialsFor, loginWithSession, skipWhenCredentialsAreMissing, verifyLoginSuccessAsClient } from '../../support/helpers/login_helper'
import { openInvernadaOfferForm, selectExistingInvernadaLocation } from '../../support/helpers/invernada_offer_helper'

describe('Ofrecimientos de invernada legacy @invernada @ofrecimientos @legacy @regression @smoke', () => {
  const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')

  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    cy.visit('/__dcac/')
    loginWithSession(credentials.username, credentials.password)
    verifyLoginSuccessAsClient()
  })

  it('TC-INV-001 permite acceder al formulario de invernada', () => {
    openInvernadaOfferForm()
    InvernadaOfferPage.societySelect().should('be.visible')
    selectExistingInvernadaLocation()
    InvernadaOfferPage.establishmentSelect().should('be.visible')
    InvernadaOfferPage.categorySelect().should('be.visible')
  })

  it('valida los campos obligatorios observados con el formulario vacío', () => {
    openInvernadaOfferForm()
    selectExistingInvernadaLocation()
    InvernadaOfferPage.categorySelect().select('Terneros')
    InvernadaOfferPage.submitEmptyOffer()
    InvernadaOfferPage.visibleValidationMessages()
  })

  it('TC-INV-007 permite cancelar el alta de sociedad y establecimiento sin persistir', () => {
    openInvernadaOfferForm()
    selectExistingInvernadaLocation()

    InvernadaOfferPage.openNewSociety()
    InvernadaOfferPage.cancelModal(InvernadaOfferPage.societyModal())
    InvernadaOfferPage.openNewEstablishment()
    InvernadaOfferPage.cancelModal(InvernadaOfferPage.establishmentModal())
  })

  it('guarda una sociedad nueva y la muestra como opción del listado', () => {
    openInvernadaOfferForm()
    const society = InvernadaOfferPage.fillNewSociety()
    InvernadaOfferPage.saveSociety()
    InvernadaOfferPage.assertOptionAndSelect(InvernadaOfferPage.societySelect(), society.name, 'new society')
  })

  it('guarda un establecimiento nuevo y lo muestra como opción del listado', () => {
    openInvernadaOfferForm()
    InvernadaOfferPage.selectFirstAvailableSociety()
    const establishment = InvernadaOfferPage.fillNewEstablishment()
    InvernadaOfferPage.saveEstablishment()
    InvernadaOfferPage.assertOptionAndSelect(InvernadaOfferPage.establishmentSelect(), establishment.name, 'new establishment')
  })
})

const dynamicCategoryCases = [
  { label: 'Terneros', labels: [] },
  { label: 'Terneros y Terneras', labels: ['Machos', 'Hembras'] },
  { label: 'Novillitos y Vaquillonas', labels: ['Machos', 'Hembras'] },
  { label: 'Vacas con cría', labels: ['Edad', 'Peso promedio'] },
  { label: 'Vacas preñadas', labels: ['Tipo de Servicio'] },
  { label: 'Vaquillonas para madre', labels: ['Definidas'] },
  { label: 'Toros', labels: ['Apto para Vaquillonas', 'Origen de los toros'] },
]

describe('Campos dinámicos del ofrecimiento de invernada @invernada @ofrecimientos @legacy @regression', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    cy.visit('/__dcac/')
    loginWithSession(credentials.username, credentials.password)
    verifyLoginSuccessAsClient()
    openInvernadaOfferForm()
    selectExistingInvernadaLocation()
  })

  dynamicCategoryCases.forEach(({ label, labels }) => {
    it(`muestra los campos dinámicos de ${label}`, () => {
      InvernadaOfferPage.selectCategory(label)
      if (labels.length) InvernadaOfferPage.assertVisibleLabels(labels, label)
    })
  })

  it('muestra las dependencias de Servicio Natural para una categoría preñada', () => {
    InvernadaOfferPage.selectCategory('Vacas preñadas')
    InvernadaOfferPage.serviceSection().should('be.visible')
    InvernadaOfferPage.selectServiceType('Servicio Natural')
    InvernadaOfferPage.serviceBranchFields().should('have.length.at.least', 2)
  })

  it('muestra Garrapata y Mio-Mio para Zona Lucha y Sucia', () => {
    InvernadaOfferPage.selectCategory('Terneros')
    InvernadaOfferPage.selectZone('Lucha')
    InvernadaOfferPage.sanitaryZoneFields().should('have.length', 2)
    InvernadaOfferPage.selectZone('Sucia')
    InvernadaOfferPage.sanitaryZoneFields().should('have.length', 2)
  })
})
