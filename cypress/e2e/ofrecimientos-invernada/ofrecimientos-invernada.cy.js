import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import { credentialsFor, loginWithSession, skipWhenCredentialsAreMissing, verifyLoginSuccessAsClient } from '../../support/helpers/login_helper'
import { openInvernadaOfferForm, selectExistingInvernadaLocation } from '../../support/helpers/invernada_offer_helper'

const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')

const CATEGORIES = {
  CALVES: 'Terneros',
  CALVES_AND_HEIFER_CALVES: 'Terneros y Terneras',
  STEERS_AND_HEIFERS: 'Novillitos y Vaquillonas',
  COWS_WITH_CALF: 'Vacas con cría',
  PREGNANT_COWS: 'Vacas preñadas',
  HEIFERS_FOR_BREEDING: 'Vaquillonas para madre',
  BULLS: 'Toros',
}

const SERVICE_TYPES = {
  NATURAL: 'Servicio Natural',
}

const ZONES = {
  LUCHA: 'Lucha',
  SUCIA: 'Sucia',
}

const FIELD_LABELS = {
  BULLS_ORIGIN: 'Origen de los toros',
  GENDER_SPLIT: ['Machos', 'Hembras'],
  NATURAL_SERVICE: ['Inicio del servicio', 'Fin del servicio', 'Raza de servicio', 'Origen de los toros'],
}

describe('Ofrecimientos de invernada legacy @invernada @ofrecimientos @legacy @regression @smoke', () => {
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
    InvernadaOfferPage.categorySelect().select(CATEGORIES.CALVES)
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
  { label: CATEGORIES.CALVES, labels: [] },
  { label: CATEGORIES.CALVES_AND_HEIFER_CALVES, labels: FIELD_LABELS.GENDER_SPLIT },
  { label: CATEGORIES.STEERS_AND_HEIFERS, labels: FIELD_LABELS.GENDER_SPLIT },
  { label: CATEGORIES.COWS_WITH_CALF, labels: ['Edad', 'Peso promedio'] },
  { label: CATEGORIES.PREGNANT_COWS, labels: ['Tipo de Servicio'] },
  { label: CATEGORIES.HEIFERS_FOR_BREEDING, labels: ['Definidas'] },
  { label: CATEGORIES.BULLS, labels: ['Apto para Vaquillonas', FIELD_LABELS.BULLS_ORIGIN] },
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
    InvernadaOfferPage.selectCategory(CATEGORIES.PREGNANT_COWS)
    InvernadaOfferPage.serviceSection().should('be.visible')
    InvernadaOfferPage.selectServiceType(SERVICE_TYPES.NATURAL)
    InvernadaOfferPage.assertVisibleLabels(FIELD_LABELS.NATURAL_SERVICE, SERVICE_TYPES.NATURAL)
  })

  it('muestra Garrapata y Mio-Mio para Zona Lucha y Sucia', () => {
    InvernadaOfferPage.selectCategory(CATEGORIES.CALVES)
    InvernadaOfferPage.selectZone(ZONES.LUCHA)
    InvernadaOfferPage.sanitaryZoneFields().should('have.length', 2)
    InvernadaOfferPage.selectZone(ZONES.SUCIA)
    InvernadaOfferPage.sanitaryZoneFields().should('have.length', 2)
  })
})
