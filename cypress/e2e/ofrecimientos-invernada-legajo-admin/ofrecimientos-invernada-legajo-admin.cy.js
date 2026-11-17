import InvernadaConfirmationPage from '../../pages/InvernadaConfirmationPage'
import { credentialsFor, skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import { visitInvernadaOfferForm } from '../../support/helpers/invernada_offer_helper'
import { captureTropaId } from '../../support/helpers/invernada_trace_helper'
import {
  assertLegajoMatches, assertListingRow, assertLoadedInPending, openLegajoByListing, openLegajoBySearch,
  submitLegajoOffer, viewLegajoFromListing,
} from '../../support/helpers/legajo_admin_helper'
import { LEG_TERNEROS_MIN, LEG_TERNERAS_FULL, LEG_VACAS_FULL, LEG_VACAS_MIN } from '../../support/data/invernada_offer_data'

const clientCredentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')
const adminCredentials = credentialsFor('TEST_ADMIN_USERNAME', 'TEST_ADMIN_PASSWORD')

// Every flow creates a REAL tropa in stage (authorized, never deleted), so nothing here is tagged @smoke.
// INVERNADA_LEGAJO_FLOWS limits the flows while debugging, e.g. CYPRESS_INVERNADA_LEGAJO_FLOWS="F1,F3" (empty = all).
const requestedFlows = String(Cypress.env('INVERNADA_LEGAJO_FLOWS') || '')
  .split(',')
  .map((flow) => flow.trim().toUpperCase())
  .filter(Boolean)

const flowTitles = {
  F1: `${LEG_TERNEROS_MIN.caseNumber}: F1 Terneros mínimo, camino 1 (listado + Ver Legajo)`,
  F2: `${LEG_TERNERAS_FULL.caseNumber}: F2 Terneras completo con video, camino 2 (buscador)`,
  F3: `${LEG_VACAS_MIN.caseNumber}: F3 Vacas con cría mínimo, camino 2 (buscador)`,
  F4: `${LEG_VACAS_FULL.caseNumber}: F4 Vacas con cría completo con video, camino 1 (listado + Ver Legajo)`,
}

const flows = [LEG_TERNEROS_MIN, LEG_TERNERAS_FULL, LEG_VACAS_MIN, LEG_VACAS_FULL]
  .filter((profile) => !requestedFlows.length || requestedFlows.includes(profile.flow))

describe('Ofrecimiento de invernada legacy verificado en el legajo Admin @invernada @ofrecimientos @legacy @admin @e2e', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, clientCredentials, 'cliente')
    skipWhenCredentialsAreMissing(this, adminCredentials, 'admin')
    visitInvernadaOfferForm(clientCredentials)
  })

  flows.forEach((profile) => {
    it(`${flowTitles[profile.flow]} (TC-LEG-005 a 009, TC-LEG-011)`, () => {
      // Client offers; the tropaId is captured passively from the request the UI sends.
      const offer = submitLegajoOffer(profile)

      captureTropaId().then((tropaId) => {
        InvernadaConfirmationPage.assertOfferCreated()
        InvernadaConfirmationPage.assertNoVideoPrompt()
        InvernadaConfirmationPage.goToOperations()

        // TC-LEG-011: the vendor verifies the item and the report in Pendientes.
        cy.then(() => assertLoadedInPending(tropaId, profile, offer))

        // Switch to the Admin session and reach the legajo by the path of the plan's matrix.
        cy.then(() => {
          if (profile.adminPath === 'listing') {
            // TC-LEG-005 (OQ-059, OQ-064, OQ-066): data of the listing div before "Ver Legajo".
            openLegajoByListing(tropaId, adminCredentials)
            assertListingRow(tropaId, profile, offer)
            viewLegajoFromListing(tropaId)
          } else {
            // OQ-065: the search is not exclusive to tropaId, so opening the tropa's legajo is asserted.
            openLegajoBySearch(tropaId, adminCredentials)
          }
          // TC-LEG-006 to TC-LEG-009 (OQ-057 to OQ-061, OQ-062 open, OQ-063): full legajo comparison.
          assertLegajoMatches(profile, offer, tropaId)
        })
      })
    })
  })
})
