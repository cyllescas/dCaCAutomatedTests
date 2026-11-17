import FaenaOfferPage from '../../pages/FaenaOfferPage'
import { credentialsFor, skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import { visitFaenaOfferForm } from '../../support/helpers/faena_offer_helper'
import { BASE_OFFER, REQUIRED_FIELDS, VIDEO_FILES, WEIGHING_SHEET_PNG } from '../../support/data/faena_offer_data'

const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')

// No tropa is created: every submit here is blocked by the form validation (TC-FAE-014 .. 018, 021, 022).
describe('Campos, razas y validaciones del formulario de faena legacy @faena @ofrecimientos @legacy @regression', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitFaenaOfferForm(credentials)
  })

  it('TC-FAE-014: Días de encierre aparece con Racionado y Feedlot y no con A campo', () => {
    FaenaOfferPage.chooseRadio('a_campo')
    FaenaOfferPage.assertNoConfinementDays()
    FaenaOfferPage.chooseRadio('racionado')
    FaenaOfferPage.confinementDaysField().should('be.visible')
    FaenaOfferPage.chooseRadio('feedlot')
    FaenaOfferPage.confinementDaysField().should('be.visible')
    FaenaOfferPage.chooseRadio('a_campo')
    FaenaOfferPage.assertNoConfinementDays()
  })

  it('TC-FAE-014: Días de encierre no es obligatorio', () => {
    FaenaOfferPage.chooseRadio('feedlot')
    FaenaOfferPage.submitOffer()
    FaenaOfferPage.assertRequiredMessage('Sociedad')
    FaenaOfferPage.assertNoRequiredMessage('Días de encierre')
    FaenaOfferPage.assertNoRequiredMessage('Terminación')
  })

  it('TC-FAE-015: admite hasta 3 razas y no agrega una cuarta', () => {
    FaenaOfferPage.selectBreeds(['Hereford', 'Braford', 'Charolais'])
    FaenaOfferPage.visibleBreedSelects().should('have.length', 3)
    FaenaOfferPage.addBreedButton().click()
    FaenaOfferPage.visibleBreedSelects().should('have.length', 3)
  })

  it('TC-FAE-016: el formulario vacío informa sólo los 9 obligatorios', () => {
    FaenaOfferPage.submitEmptyOffer()
    REQUIRED_FIELDS.forEach(({ label }) => FaenaOfferPage.assertRequiredMessage(label))
    FaenaOfferPage.assertVisibleRequiredMessageCount(REQUIRED_FIELDS.length)
    FaenaOfferPage.assertOfferFormStillShown()
  })

  REQUIRED_FIELDS.forEach(({ key, label }) => {
    it(`TC-FAE-017: sin ${label} se informa el campo y no se crea la tropa`, () => {
      FaenaOfferPage.fillOffer(BASE_OFFER, { omit: [key] })
      FaenaOfferPage.submitOffer()
      FaenaOfferPage.assertRequiredMessage(label)
      FaenaOfferPage.assertOfferFormStillShown()
    })
  })

  it('TC-FAE-018: con sólo peso mínimo y máximo sigue faltando el Peso', () => {
    FaenaOfferPage.fillOffer({ ...BASE_OFFER, weights: { min: '300', max: '500' } })
    FaenaOfferPage.submitOffer()
    FaenaOfferPage.assertRequiredMessage('Peso')
    FaenaOfferPage.assertOfferFormStillShown()
  })

  it('TC-FAE-018: el peso promedio solo satisface el obligatorio de Peso', () => {
    // The load date is left empty so the form is never submitted successfully.
    FaenaOfferPage.fillOffer({ ...BASE_OFFER, weights: { avg: '350' } }, { omit: ['loadDate'] })
    FaenaOfferPage.submitOffer()
    FaenaOfferPage.assertRequiredMessage('Disponibilidad de Carga')
    FaenaOfferPage.assertNoRequiredMessage('Peso')
    FaenaOfferPage.assertOfferFormStillShown()
  })

  it('TC-FAE-021: la planilla de pesada queda como enlace que abre en una pestaña nueva', () => {
    FaenaOfferPage.selectFirstAvailableSociety()
    FaenaOfferPage.selectFirstAvailableEstablishment()
    FaenaOfferPage.attachWeighingSheet(WEIGHING_SHEET_PNG)
    FaenaOfferPage.assertWeighingSheetLinkOpensNewTab()
  })

  it('TC-FAE-022: un video de 4 segundos es rechazado', () => {
    FaenaOfferPage.selectFirstAvailableSociety()
    FaenaOfferPage.selectFirstAvailableEstablishment()
    FaenaOfferPage.attachVideo(VIDEO_FILES.rejected())
    FaenaOfferPage.assertVideoRejected()
  })
})
