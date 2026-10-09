import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import { credentialsFor, skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import { selectExistingInvernadaLocation, visitInvernadaOfferForm } from '../../support/helpers/invernada_offer_helper'

const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')

const timestamp = () => new Date().toISOString().replace(/\D/g, '').slice(0, 12)

// Full isolation: these cases create or open data entry dialogs, so each one
// starts from a freshly loaded form.
describe('Sociedades y establecimientos de invernada legacy @invernada @ofrecimientos @legacy @regression', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitInvernadaOfferForm(credentials)
  })

  it('TC-INV-012 caso 4: rechaza una sociedad con CUIT inválido sin crearla', () => {
    const name = `QA-CUITinvalido-${timestamp()}`
    InvernadaOfferPage.fillSocietyForm(name, InvernadaOfferPage.invalidRuntimeCuit(Date.now()))
    InvernadaOfferPage.clickSaveSociety()

    InvernadaOfferPage.assertSocietyRejected(name)
  })

  it('TC-INV-013 caso 5: cerrar el alta de sociedad no persiste la sociedad', () => {
    InvernadaOfferPage.waitForSocietyOptions()
    InvernadaOfferPage.optionCount(InvernadaOfferPage.societySelect()).then((optionsBefore) => {
      const name = `QA-Cerrar-${timestamp()}`
      InvernadaOfferPage.fillSocietyForm(name, InvernadaOfferPage.validRuntimeCuit(Date.now()))
      InvernadaOfferPage.closeSocietyModal()

      InvernadaOfferPage.assertSocietyModalClosed()
      InvernadaOfferPage.assertSelectedOptionContains(InvernadaOfferPage.societySelect(), 'Seleccionar una sociedad')
      InvernadaOfferPage.assertOptionAbsent(InvernadaOfferPage.societySelect(), name)
      InvernadaOfferPage.societySelect().find('option').should('have.length', optionsBefore)
    })
  })

  it('TC-INV-014 caso 10: cerrar el alta de establecimiento no persiste el establecimiento', () => {
    InvernadaOfferPage.selectFirstAvailableSociety()
    InvernadaOfferPage.waitForEstablishmentOptions()
    InvernadaOfferPage.optionCount(InvernadaOfferPage.establishmentSelect()).then((optionsBefore) => {
      const name = `QA-EstabCerrar-${timestamp()}`
      InvernadaOfferPage.openNewEstablishment()
      InvernadaOfferPage.establishmentModal().find('#Nombre').clear().type(name)
      InvernadaOfferPage.closeEstablishmentModal()

      InvernadaOfferPage.assertEstablishmentModalClosed()
      InvernadaOfferPage.assertSelectedOptionContains(InvernadaOfferPage.establishmentSelect(), 'Seleccionar un establecimiento')
      InvernadaOfferPage.assertOptionAbsent(InvernadaOfferPage.establishmentSelect(), name)
      InvernadaOfferPage.establishmentSelect().find('option').should('have.length', optionsBefore)
    })
  })

  it('TC-INV-015 casos 3, 8 y 9: la sociedad nueva queda seleccionada, sólo ofrece alta de establecimiento y permite crear uno', () => {
    const stamp = timestamp()
    const societyName = `QA-Sociedad-${stamp}`
    const establishmentName = `QA-Estab-${stamp}`

    InvernadaOfferPage.fillSocietyForm(societyName, InvernadaOfferPage.validRuntimeCuit(Date.now()))
    InvernadaOfferPage.clickSaveSociety()
    InvernadaOfferPage.confirmSocietySuggestion()

    InvernadaOfferPage.assertSelectedOptionContains(InvernadaOfferPage.societySelect(), societyName)
    InvernadaOfferPage.establishmentSelect().should('not.be.disabled')
    InvernadaOfferPage.assertOptionTexts(InvernadaOfferPage.establishmentSelect(), [
      'Seleccionar un establecimiento',
      '+ Nuevo Establecimiento',
    ])

    const location = InvernadaOfferPage.fillEstablishmentForm(establishmentName)
    InvernadaOfferPage.clickSaveEstablishment()

    InvernadaOfferPage.assertSelectedOptionContains(InvernadaOfferPage.establishmentSelect(), establishmentName)
    cy.then(() => InvernadaOfferPage.assertLocationShows(location))
  })

  it('TC-INV-016 caso 11: provincia y partido se autocompletan al elegir el establecimiento', () => {
    selectExistingInvernadaLocation()

    InvernadaOfferPage.assertLocationAutofilled()
  })
})
