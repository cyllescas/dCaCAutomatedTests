import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import { credentialsFor, loginWithSession, skipWhenCredentialsAreMissing, verifyLoginSuccessAsClient } from '../../support/helpers/login_helper'
import { openInvernadaOfferForm, selectExistingInvernadaLocation, visitInvernadaOfferForm } from '../../support/helpers/invernada_offer_helper'
import { CATEGORIES } from '../../support/data/invernada_offer_data'

const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')

describe('Ofrecimientos de invernada legacy @invernada @ofrecimientos @legacy @regression @smoke', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
  })

  // The only case that walks the menu; the rest start from the form URL.
  it('TC-INV-001 permite acceder al formulario de invernada', () => {
    loginWithSession(credentials.username, credentials.password)
    verifyLoginSuccessAsClient()
    openInvernadaOfferForm()
    InvernadaOfferPage.societySelect().should('be.visible')
    selectExistingInvernadaLocation()
    InvernadaOfferPage.establishmentSelect().should('be.visible')
    InvernadaOfferPage.categorySelect().should('be.visible')
  })

  context('con el formulario abierto', () => {
    beforeEach(() => {
      visitInvernadaOfferForm(credentials)
    })

    it('TC-INV-002 valida los campos obligatorios observados con el formulario vacío', () => {
      selectExistingInvernadaLocation()
      InvernadaOfferPage.categorySelect().select(CATEGORIES.CALVES)
      InvernadaOfferPage.submitEmptyOffer()
      InvernadaOfferPage.visibleValidationMessages()
    })
  })
})
