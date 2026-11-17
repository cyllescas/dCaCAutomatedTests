import FaenaOfferPage from '../../pages/FaenaOfferPage'
import { credentialsFor, skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import {
  captureFaenaLot,
  observeFaenaLotRequest,
  validateCreatedLotInAdmin,
  visitFaenaOfferForm,
} from '../../support/helpers/faena_offer_helper'
import { BASE_OFFER, CATEGORY_PUBLISH_CASES, EXTRA_PUBLISH_CASES } from '../../support/data/faena_offer_data'

const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')
const adminCredentials = credentialsFor('TEST_ADMIN_USERNAME', 'TEST_ADMIN_PASSWORD')

// Every case creates a REAL tropa in stage (authorized, not deleted afterwards): nothing here is tagged @smoke.
// FAENA_PUBLISH_CASES limits the run, e.g. CYPRESS_FAENA_PUBLISH_CASES="1,4,A" (empty = all).
const requested = String(Cypress.env('FAENA_PUBLISH_CASES') || '')
  .split(',')
  .map((id) => id.trim().toUpperCase())
  .filter(Boolean)
const selected = (id) => !requested.length || requested.includes(String(id).toUpperCase())

// Fills, submits and verifies one offer: confirmation, pending publication and (optionally) the Admin legajo.
function publishAndVerify(offer, { adminCheck = false } = {}) {
  const merged = { ...BASE_OFFER, ...offer }
  observeFaenaLotRequest()
  FaenaOfferPage.fillOffer(merged)
  FaenaOfferPage.captureSelectedLocation()
  FaenaOfferPage.submitOffer()

  captureFaenaLot().then((lot) => {
    cy.wrap(lot).as('createdLot')
    FaenaOfferPage.confirmationMessage().should('be.visible')
    FaenaOfferPage.operationsLink().click()
    FaenaOfferPage.assertPendingOffer(lot, { category: merged.category, weight: merged.weights.avg })
  })

  if (adminCheck) {
    cy.then(function () {
      skipWhenCredentialsAreMissing(this, adminCredentials, 'admin')
    })
    validateCreatedLotInAdmin('createdLot', adminCredentials, [merged.category, merged.weights.avg])
  }
}

describe('Publicación de ofrecimientos de faena legacy @faena @ofrecimientos @legacy @regression @submit', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitFaenaOfferForm(credentials)
  })

  CATEGORY_PUBLISH_CASES.filter(({ n }) => selected(n)).forEach((offer) => {
    it(`TC-FAE-019 caso ${offer.n}: ofrece ${offer.category} (${offer.termination}, ${offer.destination}, ${offer.freight})`, () => {
      publishAndVerify(offer, { adminCheck: Boolean(offer.adminCheck) })
    })
  })

  EXTRA_PUBLISH_CASES.filter(({ id }) => selected(id)).forEach((offer) => {
    it(`TC-FAE-020 ${offer.id}: ${offer.title}`, () => {
      publishAndVerify(offer)
    })
  })
})
