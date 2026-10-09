import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import { credentialsFor, skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import { selectExistingInvernadaLocation, visitInvernadaOfferForm } from '../../support/helpers/invernada_offer_helper'
import { CATEGORIES, FIELD_LABELS, SERVICE_TYPES, ZONES } from '../../support/data/invernada_offer_data'

const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')

const dynamicCategoryCases = [
  { id: 'TC-INV-003', label: CATEGORIES.CALVES, labels: [] },
  { id: 'TC-INV-003', label: CATEGORIES.CALVES_AND_HEIFER_CALVES, labels: FIELD_LABELS.GENDER_SPLIT },
  { id: 'TC-INV-003', label: CATEGORIES.STEERS_AND_HEIFERS, labels: FIELD_LABELS.GENDER_SPLIT },
  { id: 'TC-INV-004', label: CATEGORIES.COWS_WITH_CALF, labels: ['Edad', 'Peso promedio'] },
  { id: 'TC-INV-005', label: CATEGORIES.PREGNANT_COWS, labels: ['Tipo de Servicio'] },
  { id: 'TC-INV-026', label: CATEGORIES.HEIFERS_FOR_BREEDING, labels: ['Definidas'] },
  { id: 'TC-INV-003', label: CATEGORIES.BULLS, labels: ['Apto para Vaquillonas', FIELD_LABELS.BULLS_ORIGIN] },
]

// Read-only checks: the form is opened once and reused across cases, so
// isolation is off. Each case resets the category to avoid stale fields.
describe('Campos dinámicos del ofrecimiento de invernada @invernada @ofrecimientos @legacy @regression', { testIsolation: false }, () => {
  before(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitInvernadaOfferForm(credentials)
    selectExistingInvernadaLocation()
  })

  beforeEach(() => {
    InvernadaOfferPage.resetCategory()
  })

  dynamicCategoryCases.forEach(({ id, label, labels }) => {
    it(`${id} muestra los campos dinámicos de ${label}`, () => {
      InvernadaOfferPage.selectCategory(label)
      if (labels.length) InvernadaOfferPage.assertVisibleLabels(labels, label)
    })
  })

  it('TC-INV-005 muestra las dependencias de Servicio Natural para una categoría preñada', () => {
    InvernadaOfferPage.selectCategory(CATEGORIES.PREGNANT_COWS)
    InvernadaOfferPage.serviceSection().should('be.visible')
    InvernadaOfferPage.selectServiceType(SERVICE_TYPES.NATURAL)
    InvernadaOfferPage.assertVisibleLabels(FIELD_LABELS.NATURAL_SERVICE, SERVICE_TYPES.NATURAL)
  })

  it('TC-INV-006 muestra Garrapata y Mio-Mio para Zona Lucha y Sucia', () => {
    InvernadaOfferPage.selectCategory(CATEGORIES.CALVES)
    InvernadaOfferPage.selectZone(ZONES.LUCHA)
    InvernadaOfferPage.sanitaryZoneFields().should('have.length', 2)
    InvernadaOfferPage.selectZone(ZONES.SUCIA)
    InvernadaOfferPage.sanitaryZoneFields().should('have.length', 2)
  })
})
