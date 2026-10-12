import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import { credentialsFor, skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import { selectExistingInvernadaLocation, visitInvernadaOfferForm } from '../../support/helpers/invernada_offer_helper'
import { CATEGORIES, FIELD_LABELS, OPTION_CASES, SERVICE_TYPES } from '../../support/data/invernada_offer_data'

const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')

// Read-only checks: the form is opened once and reused, so isolation is off.
// Each case resets the category so options cannot come from a previous case.
describe('Opciones de selects y radios de invernada legacy @invernada @ofrecimientos @legacy @regression', { testIsolation: false }, () => {
  before(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitInvernadaOfferForm(credentials)
    selectExistingInvernadaLocation()
  })

  beforeEach(() => {
    InvernadaOfferPage.resetCategory()
  })

  OPTION_CASES.forEach(({ caseNumber, title, category, select, options, radios, serviceRadio }) => {
    it(`TC-INV-024 caso ${caseNumber}: opciones de ${title} en ${category}`, () => {
      InvernadaOfferPage.selectCategory(category)
      if (serviceRadio) InvernadaOfferPage.clickRadio(serviceRadio)
      if (select) InvernadaOfferPage.assertSelectOptions(select, options)
      if (radios) InvernadaOfferPage.assertRadioTexts(radios)
    })
  })

  it('TC-INV-025 caso 34: la raza de inseminación y de servicio ofrece las mismas razas que Raza', () => {
    InvernadaOfferPage.selectCategory(CATEGORIES.PREGNANT_COWS)
    InvernadaOfferPage.assertSameBreedsAs('in_raza_servicio', 're_raza')
    InvernadaOfferPage.clickRadio('natural')
    InvernadaOfferPage.assertLabelsShown(FIELD_LABELS.SERVICE_BREED, SERVICE_TYPES.NATURAL)
    InvernadaOfferPage.assertSameBreedsAs('in_raza_servicio', 're_raza')
  })

  it('TC-INV-025 caso 35: la raza del repaso ofrece las mismas razas que Raza', () => {
    InvernadaOfferPage.selectCategory(CATEGORIES.PREGNANT_COWS)
    InvernadaOfferPage.clickRadio('mas_repaso')
    InvernadaOfferPage.assertSameBreedsAs('in_toro_raza_repaso', 're_raza')
  })
})
