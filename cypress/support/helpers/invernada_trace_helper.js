// Passive observation of the requests the offer form sends by itself.
//
// POLICY NOTE (pending validation by the QA team, see specs/ofrecimientos-invernada.md,
// "Network observation"): these intercepts only READ what the UI already sends.
// They never stub, modify, replay or call the API on their own. If the team
// decides this observation is not acceptable, remove `captureTropaId()` and
// the `waitForPartialLot()` use in InvernadaOfferPage.attachVideo; the UI
// assertions of the specs do not depend on them, except for the Pendientes
// lookup of TC-INV-033, which would then need another way to find the tropa.

export const OFFER_LOT_ALIAS = 'offerLotRequest'
export const PARTIAL_LOT_ALIAS = 'partialLotRequest'

const LOT_ENDPOINT = '**/MODULOS/invernada/modulo_crearLote/index.php*'

// Register BEFORE the action that triggers the request. The video flow posts
// with `?parcial=true`; "Ofrecer Tropa" posts without a query.
export function observeLotRequests() {
  cy.intercept('POST', LOT_ENDPOINT, (req) => {
    // Only tags the request; it is not answered here, so it goes to the server.
    req.alias = req.url.includes('parcial=true') ? PARTIAL_LOT_ALIAS : OFFER_LOT_ALIAS
  })
}

export function waitForPartialLot() {
  return cy.wait(`@${PARTIAL_LOT_ALIAS}`, { timeout: 60000 })
}

// The response body of the "Ofrecer Tropa" request is the plain lot id (e.g. 35568).
export function captureTropaId() {
  return cy.wait(`@${OFFER_LOT_ALIAS}`, { timeout: 60000 }).then(({ response }) => {
    const tropaId = String(response.body).trim()
    expect(tropaId, 'tropa id returned by the offer request').to.match(/^\d+$/)
    return tropaId
  })
}
