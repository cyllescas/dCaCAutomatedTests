import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import InvernadaConfirmationPage from '../../pages/InvernadaConfirmationPage'
import { credentialsFor, skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import { selectExistingInvernadaLocation, visitInvernadaOfferForm } from '../../support/helpers/invernada_offer_helper'
import { captureTropaId, observeLotRequests } from '../../support/helpers/invernada_trace_helper'
import { BASE_OFFER, CALVES_PROFILE, SUBMIT_PROFILES } from '../../support/data/invernada_offer_data'

const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')

// Every case creates a REAL tropa in stage (authorized, not deleted afterwards),
// so isolation is on and nothing here is tagged @smoke.
// INVERNADA_SUBMIT_CATEGORIES limits the data-driven cases, e.g.
//   CYPRESS_INVERNADA_SUBMIT_CATEGORIES="Terneros,Vacas preñadas"   (empty = all 17)
const requestedCategories = String(Cypress.env('INVERNADA_SUBMIT_CATEGORIES') || '')
  .split(',')
  .map((name) => name.trim().toLowerCase())
  .filter(Boolean)

const profiles = requestedCategories.length
  ? SUBMIT_PROFILES.filter((profile) => requestedCategories.includes(profile.category.toLowerCase()))
  : SUBMIT_PROFILES

// Fills the form, submits it and returns what was loaded; the tropa id is
// captured passively from the request the UI sends (see invernada_trace_helper).
function submitProfile(profile) {
  observeLotRequests()
  selectExistingInvernadaLocation()
  const offer = InvernadaOfferPage.fillOffer(profile)
  InvernadaOfferPage.selectedSocietyText().then((society) => {
    offer.society = society
  })
  InvernadaOfferPage.submitOffer()
  return offer
}

describe('Envío de ofrecimientos de invernada legacy @invernada @ofrecimientos @legacy @regression @submit', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitInvernadaOfferForm(credentials)
  })

  it('TC-INV-018 caso 12.3: envía Terneros sin video y la tropa figura en Pendientes', () => {
    cy.url().then((urlBefore) => {
      submitProfile(CALVES_PROFILE)

      captureTropaId().then((tropaId) => {
        InvernadaConfirmationPage.assertOfferCreated()
        InvernadaConfirmationPage.assertNoVideoPrompt()
        cy.url().should('eq', urlBefore)
        InvernadaConfirmationPage.goToOperations()
        InvernadaConfirmationPage.pendingItem(tropaId).should('exist')
      })
    })
  })

  profiles.forEach((profile) => {
    it(`TC-INV-032 caso ${profile.caseNumber}: ofrece ${profile.category} y verifica la tropa en Pendientes (TC-INV-033)`, () => {
      cy.url().then((urlBefore) => {
        const offer = submitProfile(profile)

        captureTropaId().then((tropaId) => {
          InvernadaConfirmationPage.assertOfferCreated()
          cy.url().should('eq', urlBefore)
          InvernadaConfirmationPage.goToOperations()
          cy.then(() => {
            InvernadaConfirmationPage.assertPendingItem(tropaId, {
              quantity: BASE_OFFER.quantity,
              category: profile.category,
              weight: BASE_OFFER.weight,
              breed: offer.breeds[0],
              society: offer.society,
            })
          })
        })
      })
    })
  })

  it('TC-INV-033: el informe de la tropa de Terneros coincide con lo cargado', () => {
    submitProfile(CALVES_PROFILE)

    captureTropaId().then((tropaId) => {
      InvernadaConfirmationPage.assertOfferCreated()
      InvernadaConfirmationPage.goToOperations()
      InvernadaConfirmationPage.openReport(tropaId)
      InvernadaConfirmationPage.assertReportSegmentation(['260', '250', '240', '48'])
      InvernadaConfirmationPage.openReportCharacteristics()
      InvernadaConfirmationPage.assertReportCharacteristics({
        quantity: BASE_OFFER.quantity,
        ageMonths: CALVES_PROFILE.texts.in_edad,
        zone: 'Limpia',
        weaned: 's[ií]',
        castrated: 'no',
      })
    })
  })
})
