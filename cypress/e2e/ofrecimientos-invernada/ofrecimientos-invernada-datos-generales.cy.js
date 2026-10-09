import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import { credentialsFor, skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import { selectExistingInvernadaLocation, skipWhenFileIsMissing, visitInvernadaOfferForm } from '../../support/helpers/invernada_offer_helper'
import { observeLotRequests } from '../../support/helpers/invernada_trace_helper'
import { ALL_CATEGORIES, CALVES_PROFILE, VIDEO_FILES, VIDEO_MESSAGES } from '../../support/data/invernada_offer_data'

const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')

// Read-only checks share the page; the category is reset where it matters.
describe('Datos generales de invernada legacy (sólo lectura) @invernada @ofrecimientos @legacy @regression', { testIsolation: false }, () => {
  before(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitInvernadaOfferForm(credentials)
    selectExistingInvernadaLocation()
  })

  it('TC-INV-019 caso 13: acepta una cantidad válida', () => {
    InvernadaOfferPage.typeQuantity('50')
    InvernadaOfferPage.visibleField('re_cantidad').should('have.value', '50')
  })

  it('TC-INV-020 caso 18: la lista de categorías contiene las 17 categorías', () => {
    InvernadaOfferPage.assertCategoryOptions(ALL_CATEGORIES)
  })

  it('TC-INV-021 caso 19: el peso promedio no tiene restricción', () => {
    InvernadaOfferPage.typeAverageWeight('100')
    InvernadaOfferPage.visibleField('re_peso').should('have.value', '100')
  })
})

// Each case needs a clean page (the error messages are not cleared, OQ-049, and
// the razas are added to the form), so isolation stays on.
describe('Datos generales de invernada legacy (con estado) @invernada @ofrecimientos @legacy @regression', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitInvernadaOfferForm(credentials)
    selectExistingInvernadaLocation()
  })

  it('TC-INV-019 caso 14: la cantidad vacía muestra el mensaje y no envía la tropa', () => {
    InvernadaOfferPage.fillOffer(CALVES_PROFILE, { skipQuantity: true })
    InvernadaOfferPage.submitOffer()

    InvernadaOfferPage.assertQuantityRequired()
    InvernadaOfferPage.assertOfferFormStillShown()
  })

  it('TC-INV-023 casos 22 y 23: permite hasta tres razas', () => {
    InvernadaOfferPage.selectNthOption('re_raza', 0)
    InvernadaOfferPage.clickAddBreed()
    InvernadaOfferPage.selectNthOption('re_raza2', 1)
    InvernadaOfferPage.clickAddBreed()
    InvernadaOfferPage.selectNthOption('re_raza3', 2)
    InvernadaOfferPage.clickAddBreed()

    InvernadaOfferPage.assertFieldsVisible(['re_raza', 're_raza2', 're_raza3'], 'tres razas')
    InvernadaOfferPage.breedButton().should('have.length.greaterThan', 0)
  })
})

// TC-INV-017: the validation only runs with society and establishment selected.
// The oracle is #seccion_archivos; the progress bar always says "Archivo cargado".
describe('Carga de video de invernada legacy @invernada @ofrecimientos @legacy @regression', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitInvernadaOfferForm(credentials)
    observeLotRequests()
    selectExistingInvernadaLocation()
  })

  it('TC-INV-017 caso 12: acepta un video válido de 29 s', function () {
    skipWhenFileIsMissing(this, VIDEO_FILES.valid())

    InvernadaOfferPage.attachVideo(VIDEO_FILES.valid())

    InvernadaOfferPage.assertVideoAccepted()
  })

  it('TC-INV-017 caso 12.5: acepta un video de 9 s', function () {
    skipWhenFileIsMissing(this, VIDEO_FILES.short())

    InvernadaOfferPage.attachVideo(VIDEO_FILES.short())

    InvernadaOfferPage.assertVideoAccepted()
  })

  it('TC-INV-017 caso 12.1: rechaza un video de 4 s con un mensaje visible', function () {
    skipWhenFileIsMissing(this, VIDEO_FILES.rejected())

    InvernadaOfferPage.attachVideo(VIDEO_FILES.rejected())

    InvernadaOfferPage.assertVideoRejected()
  })

  it('TC-INV-017 caso 12.2: rechaza un archivo que no es video', () => {
    InvernadaOfferPage.attachVideo({
      contents: Cypress.Buffer.from('QA archivo de texto que no es un video'),
      fileName: 'QA-no-es-video.txt',
      mimeType: 'text/plain',
    })

    InvernadaOfferPage.assertVideoRejected()
  })

  it('TC-INV-017 caso 12.4: permite reemplazar un archivo rechazado por un video válido', function () {
    skipWhenFileIsMissing(this, VIDEO_FILES.valid())

    InvernadaOfferPage.attachVideo({
      contents: Cypress.Buffer.from('QA archivo de texto que no es un video'),
      fileName: 'QA-no-es-video.txt',
      mimeType: 'text/plain',
    })
    InvernadaOfferPage.assertVideoRejected()
    InvernadaOfferPage.videoButton().should('be.visible')
    InvernadaOfferPage.attachVideo(VIDEO_FILES.valid(), { waitForLot: false })

    InvernadaOfferPage.assertVideoAccepted()
  })

  it('TC-INV-017 caso 12.4: permite eliminar el video cargado tras confirmar', function () {
    skipWhenFileIsMissing(this, VIDEO_FILES.valid())

    InvernadaOfferPage.attachVideo(VIDEO_FILES.valid())
    InvernadaOfferPage.assertVideoAccepted()
    const dialogs = InvernadaOfferPage.deleteLoadedVideo()

    InvernadaOfferPage.assertNoVideoLoaded()
    cy.then(() => expect(dialogs).to.include(VIDEO_MESSAGES.deleteConfirm))
  })
})
