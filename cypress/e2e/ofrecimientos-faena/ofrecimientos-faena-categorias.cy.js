import FaenaOfferPage from '../../pages/FaenaOfferPage'
import { credentialsFor, skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import { visitFaenaOfferForm } from '../../support/helpers/faena_offer_helper'
import { EXPECTED_FORM_CONTROLS, FAENA_BREEDS, FAENA_CATEGORIES } from '../../support/data/faena_offer_data'

const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')

// No tropa is published here: the form is only walked (TC-FAE-012 / TC-FAE-013).
describe('Categorías y razas del formulario de faena legacy @faena @ofrecimientos @legacy @regression', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitFaenaOfferForm(credentials)
    FaenaOfferPage.selectFirstAvailableSociety()
    FaenaOfferPage.establishmentSelect().should('be.visible')
  })

  FAENA_CATEGORIES.forEach((category) => {
    it(`TC-FAE-012: la categoría ${category} se puede seleccionar y muestra los mismos campos`, () => {
      FaenaOfferPage.categorySelect().select(category)
      FaenaOfferPage.selectedCategoryName().should('eq', category)
      FaenaOfferPage.visibleControlNames().should('have.members', EXPECTED_FORM_CONTROLS)
    })
  })

  it('TC-FAE-013: la lista de razas tiene las 24 opciones esperadas', () => {
    FaenaOfferPage.breedOptionNames().should('deep.equal', FAENA_BREEDS)
  })
})
