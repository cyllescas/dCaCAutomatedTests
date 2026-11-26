// specs/ofrecimientos-representante-core.md — AGT-01, Cliente -> Sociedad -> Establecimiento in the
// legacy Faena form of the Representante (TC-AGT-011..014, 016, 018).
// Not automated: TC-AGT-015 (missing_authorized_data), TC-AGT-017 (blocked_by_open_question OQ-074),
// TC-AGT-019 (blocked_by_open_question OQ-073).
// Clients and societies are discovered at runtime; when no client loads societies the case is skipped.
// Only the empty form is submitted; ".agr_cliente", "+ Nueva Sociedad" and "+ Nuevo establecimiento" are never used.
import FaenaOfferPage from '../../pages/FaenaOfferPage'
import { MESSAGES } from '../../support/data/faena_offer_data'
import { openFaenaOfferForm } from '../../support/helpers/faena_offer_helper'
import { skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import {
  agentCredentials,
  assertClientOptionsMatchList,
  assertClientSelectorShown,
  assertEstablishmentSelectorShown,
  assertInitialSocietyOptions,
  assertSocietiesMatchClientsList,
  assertSocietiesReset,
  assertSocietyOptionsForClient,
  clientOptionsOf,
  clientsFromList,
  findClientWithSocieties,
  selectSociety,
  switchToAnotherClient,
  visitAgentHome,
  visitAgentOfferForm,
} from '../../support/helpers/representante_helper'

const FORM = 'faena'
const credentials = agentCredentials()

describe('Representante: cascada Cliente > Sociedad > Establecimiento en Faena legacy @representante @agent @regression', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'representante')
  })

  it('TC-AGT-011: el Representante ve el selector de Cliente con sus clientes', () => {
    visitAgentHome(credentials)
    openFaenaOfferForm()

    assertClientSelectorShown(FORM)
    clientOptionsOf(FORM).then((options) => {
      clientsFromList().then((rows) => assertClientOptionsMatchList(options, rows))
    })
  })

  it('TC-AGT-012: sin cliente, Sociedad no lista sociedades reales y Establecimiento no se muestra', () => {
    visitAgentOfferForm(FORM, credentials)

    assertInitialSocietyOptions(FORM)
    FaenaOfferPage.assertEstablishmentMenuHidden()
  })

  it('TC-AGT-013: elegir un cliente lista todas sus sociedades', function () {
    visitAgentOfferForm(FORM, credentials)

    findClientWithSocieties(FORM, this).then((client) => {
      assertSocietyOptionsForClient(FORM, client)
      clientsFromList().then((rows) => assertSocietiesMatchClientsList(client, rows))
    })
  })

  it('TC-AGT-014: elegir una sociedad muestra el selector de establecimientos', function () {
    visitAgentOfferForm(FORM, credentials)

    findClientWithSocieties(FORM, this).then((client) => {
      client.societies.forEach((society) => {
        selectSociety(FORM, society)
        assertEstablishmentSelectorShown(FORM)
      })
    })
  })

  it('TC-AGT-016: cambiar de cliente reinicia la Sociedad', function () {
    visitAgentOfferForm(FORM, credentials)

    findClientWithSocieties(FORM, this).then((client) => {
      selectSociety(FORM, client.societies[0])

      switchToAnotherClient(FORM, client)

      assertSocietiesReset(FORM, client)
    })
  })

  it('TC-AGT-018: el envío vacío exige Sociedad y Establecimiento', () => {
    visitAgentOfferForm(FORM, credentials)

    FaenaOfferPage.submitOffer()

    FaenaOfferPage.societyRequiredMessage().should('be.visible').and('contain.text', MESSAGES.required('Sociedad'))
    FaenaOfferPage.establishmentRequiredMessage().should('be.visible').and('contain.text', MESSAGES.required('Establecimiento'))
    FaenaOfferPage.assertOfferFormStillShown()
  })
})
