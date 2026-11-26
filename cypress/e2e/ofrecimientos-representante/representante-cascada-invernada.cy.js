// specs/ofrecimientos-representante-core.md — AGT-01, Cliente -> Sociedad -> Establecimiento in the
// legacy Invernada form of the Representante (TC-AGT-020..023, 025, 027).
// Not automated: TC-AGT-024 (missing_authorized_data), TC-AGT-026 (blocked_by_open_question OQ-074),
// TC-AGT-028 (blocked_by_open_question OQ-073).
// Clients and societies are discovered at runtime; when no client loads societies the case is skipped.
// Only the empty form is submitted; ".agr_cliente", "+ Nueva Sociedad" and "+ Nuevo Establecimiento" are never used.
import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import { MESSAGES } from '../../support/data/faena_offer_data'
import { FORM_LABELS, INVERNADA_REQUIRED_LABELS } from '../../support/data/representante_data'
import { openInvernadaOfferForm } from '../../support/helpers/invernada_offer_helper'
import { skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import {
  agentCredentials,
  assertClientOptionsMatchList,
  assertClientSelectorShown,
  assertEstablishmentSelectorShown,
  assertInitialSocietyOptions,
  assertOnlySocietyPlaceholderAndCreate,
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

const FORM = 'invernada'
const credentials = agentCredentials()

describe('Representante: cascada Cliente > Sociedad > Establecimiento en Invernada legacy @representante @agent @regression', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'representante')
  })

  it('TC-AGT-020: el Representante ve el selector de Cliente con sus clientes en Invernada', () => {
    visitAgentHome(credentials)
    openInvernadaOfferForm()

    assertClientSelectorShown(FORM)
    InvernadaOfferPage.newClientButton().should('contain.text', FORM_LABELS.invernada.NEW_CLIENT)
    clientOptionsOf(FORM).then((options) => {
      clientsFromList().then((rows) => assertClientOptionsMatchList(options, rows))
    })
  })

  it('TC-AGT-021: sin cliente, Sociedad no lista sociedades reales y Establecimiento no se muestra', () => {
    visitAgentOfferForm(FORM, credentials)

    assertInitialSocietyOptions(FORM)
    InvernadaOfferPage.assertEstablishmentHidden()
  })

  it('TC-AGT-022: elegir un cliente lista todas sus sociedades', function () {
    visitAgentOfferForm(FORM, credentials)

    findClientWithSocieties(FORM, this).then((client) => {
      assertSocietyOptionsForClient(FORM, client)
      clientsFromList().then((rows) => assertSocietiesMatchClientsList(client, rows))
    })
  })

  it('TC-AGT-023: elegir una sociedad muestra el selector de establecimientos', function () {
    visitAgentOfferForm(FORM, credentials)

    findClientWithSocieties(FORM, this).then((client) => {
      client.societies.forEach((society) => {
        selectSociety(FORM, society)
        assertEstablishmentSelectorShown(FORM).then((establishments) => {
          if (establishments.length) InvernadaOfferPage.waitForEstablishmentOptions()
        })
      })
    })
  })

  it('TC-AGT-025: cambiar de cliente reinicia la Sociedad', function () {
    visitAgentOfferForm(FORM, credentials)

    findClientWithSocieties(FORM, this).then((client) => {
      selectSociety(FORM, client.societies[0])

      switchToAnotherClient(FORM, client).then(({ knownEmpty }) => {
        assertSocietiesReset(FORM, client)
        // The exact "placeholder + crear" list is only expected for a client already seen without societies.
        if (knownEmpty) assertOnlySocietyPlaceholderAndCreate(FORM)
      })
    })
  })

  it('TC-AGT-027: el envío vacío del Representante exige Sociedad, Establecimiento y los obligatorios de la tropa', () => {
    visitAgentOfferForm(FORM, credentials)

    InvernadaOfferPage.submitEmptyOffer()

    InvernadaOfferPage.societyRequiredMessage().should('be.visible')
      .and('contain.text', MESSAGES.required(INVERNADA_REQUIRED_LABELS.SOCIETY))
    InvernadaOfferPage.establishmentRequiredMessage().should('be.visible')
      .and('contain.text', MESSAGES.required(INVERNADA_REQUIRED_LABELS.ESTABLISHMENT))
    InvernadaOfferPage.assertQuantityRequired()
    InvernadaOfferPage.categoryRequiredMessage().should('be.visible')
      .and('contain.text', MESSAGES.required(INVERNADA_REQUIRED_LABELS.CATEGORY))
    InvernadaOfferPage.saleTermRequiredMessage().should('be.visible')
      .and('contain.text', MESSAGES.required(INVERNADA_REQUIRED_LABELS.SALE_TERM))
    InvernadaOfferPage.assertVisibleRequiredMessage(INVERNADA_REQUIRED_LABELS.BREED)
    InvernadaOfferPage.assertOfferFormStillShown()
  })
})
