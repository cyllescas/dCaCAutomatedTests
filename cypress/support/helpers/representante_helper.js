// Helpers for the Representante (USER_AGENT) suites (specs/ofrecimientos-representante-core.md).
// Selectors live in the Page Objects; this module only reads what they yield.
// Black box: no cy.request; the only cy.intercept is passive (it never stubs and never reads the body).
import FaenaOfferPage from '../../pages/FaenaOfferPage'
import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import MainAgentPage from '../../pages/MainAgentPage'
import {
  AGENT_PATHS,
  CASCADE_TIMEOUTS,
  CLIENT_PLACEHOLDER,
  CLIENT_SOCIETIES_REQUEST,
  CREATE_OPTION_VALUE,
  DCP_LINK,
  FORM_LABELS,
  NON_REAL_OPTION_TEXTS,
} from '../data/representante_data'
import { FAENA_OFFER_PATH } from './faena_offer_helper'
import { INVERNADA_OFFER_PATH } from './invernada_offer_helper'
import { credentialsFor, loginWithSession, verifyLoginSuccessAsAgent } from './login_helper'

// TEST_AGENT_* fall back to USER_AGENT / PASSWORD in cypress.config.js.
export const agentCredentials = () => credentialsFor('TEST_AGENT_USERNAME', 'TEST_AGENT_PASSWORD')

// Each legacy form: its Page Object, path, establishment select and literal labels.
const FORMS = {
  faena: {
    page: FaenaOfferPage,
    path: FAENA_OFFER_PATH,
    establishmentSelect: (options) => FaenaOfferPage.establishmentMenu(options),
    labels: FORM_LABELS.faena,
  },
  invernada: {
    page: InvernadaOfferPage,
    path: INVERNADA_OFFER_PATH,
    establishmentSelect: (options) => InvernadaOfferPage.establishmentSelect(options),
    labels: FORM_LABELS.invernada,
  },
}

const PAGE_TIMEOUT = 60000

const collapse = (text) => String(text || '').replace(/\s+/g, ' ').trim()

// Client names are compared ignoring case, commas, extra spaces and word order (the form and the
// Clients list may render "Apellido, Nombre" differently).
export const normalizeName = (text) => collapse(String(text || '').replace(/,/g, ' ')).toLowerCase()
  .split(' ').filter(Boolean).sort().join(' ')

const sortedNames = (names) => names.map(normalizeName).filter(Boolean).sort()

export const optionList = ($select) => [...$select.find('option')]
  .map((option) => ({ value: option.value, text: collapse(option.textContent) }))

// Real choices only: no empty/"0" value, no "crear" action and no placeholder text.
const NON_REAL_TEXTS = NON_REAL_OPTION_TEXTS.map((text) => text.toLowerCase())
export const realOptions = ($select) => optionList($select).filter((option) =>
  option.value && option.value !== '0' && option.value !== CREATE_OPTION_VALUE && option.text
  && !NON_REAL_TEXTS.includes(option.text.toLowerCase()))

const clientOptions = ($select) => optionList($select).filter((option) => option.value !== CLIENT_PLACEHOLDER.value)

// ── Navigation ──

export function visitAgentHome(credentials) {
  loginWithSession(credentials.username, credentials.password, 'agent')
  verifyLoginSuccessAsAgent()
}

export function visitAgentClients(credentials) {
  loginWithSession(credentials.username, credentials.password, 'agent', { landingPath: AGENT_PATHS.CLIENTS })
  MainAgentPage.assertOnClientsPage()
}

// Lands directly on the legacy form (`faena` | `invernada`) with the client selector rendered.
export function visitAgentOfferForm(form, credentials) {
  loginWithSession(credentials.username, credentials.password, 'agent', { landingPath: FORMS[form].path })
  return FORMS[form].page.clientSelect({ timeout: PAGE_TIMEOUT }).should('be.visible')
}

// Opens /__dcac/misClientes and yields [{ name, societies, societyRowCount }] (see MainAgentPage).
export function clientsFromList() {
  cy.visit(AGENT_PATHS.CLIENTS)
  MainAgentPage.assertOnClientsPage()
  return MainAgentPage.clientRowsData()
}

// ── Client selector ──

// Yields the real client options [{ value, text }] of the form (the "Seleccionar" placeholder is left out).
export function clientOptionsOf(form) {
  return FORMS[form].page.clientSelect({ timeout: PAGE_TIMEOUT })
    .should(($select) => expect(clientOptions($select).length, 'client options').to.be.greaterThan(0))
    .then(($select) => clientOptions($select))
}

export function assertClientSelectorShown(form) {
  const { page } = FORMS[form]
  page.clientSelect().should('be.visible').and(($select) => {
    const [first] = optionList($select)
    expect(first?.text, 'first client option').to.eq(CLIENT_PLACEHOLDER.text)
    expect(first?.value, 'value of the first client option').to.eq(CLIENT_PLACEHOLDER.value)
  })
  return page.newClientButton().should('be.visible')
}

// Same clients, same count, in the form selector and in the Clients list.
export function assertClientOptionsMatchList(options, rows) {
  const fromForm = sortedNames(options.map((option) => option.text))
  const fromList = sortedNames(rows.map((row) => row.name))
  expect(fromForm.length, 'client options vs Clients rows').to.eq(fromList.length)
  expect(fromForm, 'client options vs Clients rows').to.deep.eq(fromList)
}

// Signals when the society request of the chosen client has answered; never reads or asserts the body.
function observeClientSocietyResponses() {
  const tracker = { lastResponseAt: 0 }
  cy.intercept(CLIENT_SOCIETIES_REQUEST, (req) => {
    req.on('after:response', () => {
      tracker.lastResponseAt = Date.now()
    })
  }).as('clientSocieties')
  return tracker
}

// Chooses a client and waits by condition until its societies render, the society request answered and
// the page had time to render, or 10 s passed. Yields the real societies [{ value, text }] (maybe empty).
function selectClientAndSettle(page, value, tracker) {
  let selectedAt = 0
  cy.then(() => {
    selectedAt = Date.now()
  })
  page.chooseClient(value)
  return page.societySelect({ timeout: CASCADE_TIMEOUTS.SOCIETIES_PER_CLIENT_MS + 5000 })
    .should(($select) => {
      const now = Date.now()
      const loaded = realOptions($select).length > 0
      const answered = tracker.lastResponseAt >= selectedAt
        && now - tracker.lastResponseAt >= CASCADE_TIMEOUTS.RENDER_AFTER_RESPONSE_MS
      const expired = now - selectedAt >= CASCADE_TIMEOUTS.SOCIETIES_PER_CLIENT_MS
      expect(loaded || answered || expired, 'society list settled after choosing the client').to.eq(true)
    })
    .then(($select) => realOptions($select))
}

// Walks the client options until one loads real societies (TST-AGT-001). Yields
// { value, text, societies, emptyClientValues, clients }. Skips the test when no client loads any
// (runtime data, OQ-073), instead of failing.
export function findClientWithSocieties(form, testContext) {
  const { page } = FORMS[form]
  const tracker = observeClientSocietyResponses()
  return clientOptionsOf(form).then((clients) => {
    const emptyClientValues = []
    const tryAt = (index) => {
      if (index >= clients.length) {
        Cypress.log({
          name: 'skip',
          message: `No client of the ${form} form loads sociedades in stage (missing runtime data, TST-AGT-001 / OQ-073)`,
        })
        testContext.skip()
        return undefined
      }
      const client = clients[index]
      return selectClientAndSettle(page, client.value, tracker).then((societies) => {
        if (societies.length) return { ...client, societies, emptyClientValues: [...emptyClientValues], clients }
        emptyClientValues.push(client.value)
        return tryAt(index + 1)
      })
    }
    return tryAt(0)
  })
}

// ── Society selector ──

// Before choosing a client: only the given non-real options (placeholder + "crear"), no real societies.
export function assertInitialSocietyOptions(form) {
  const { page, labels } = FORMS[form]
  const firstText = form === 'faena' ? labels.NO_SOCIETIES : labels.SOCIETY_PLACEHOLDER
  return page.societySelect({ timeout: PAGE_TIMEOUT }).should(($select) => {
    const options = optionList($select)
    expect(options.map((option) => option.text), 'society options without client').to.deep.eq([firstText, labels.NEW_SOCIETY])
    expect(options[1].value, `value of "${labels.NEW_SOCIETY}"`).to.eq(CREATE_OPTION_VALUE)
    expect(realOptions($select).length, 'real societies without client').to.eq(0)
  })
}

// After choosing the client: placeholder first, the client's societies, and "+ Nueva Sociedad" (crear).
export function assertSocietyOptionsForClient(form, client) {
  const { page, labels } = FORMS[form]
  return page.societySelect().should(($select) => {
    const options = optionList($select)
    expect(options[0]?.text, 'first society option').to.eq(labels.SOCIETY_PLACEHOLDER)
    expect(realOptions($select).map((option) => option.value), 'societies of the client')
      .to.deep.eq(client.societies.map((option) => option.value))
    const create = options.find((option) => option.value === CREATE_OPTION_VALUE)
    expect(create?.text, 'new society option').to.eq(labels.NEW_SOCIETY)
  })
}

// The societies of the form equal the non-empty society names of the same client in the Clients list.
// Empty names in the list are left out of the comparison (OQ-076).
export function assertSocietiesMatchClientsList(client, rows) {
  const row = rows.find((item) => normalizeName(item.name) === normalizeName(client.text))
  expect(row, 'Clients row of the client chosen in the form').to.exist
  const fromForm = sortedNames(client.societies.map((option) => option.text))
  const fromList = sortedNames(row.societies)
  expect(fromForm.length, 'societies in the form vs the Clients list').to.eq(fromList.length)
  expect(fromForm, 'societies in the form vs the Clients list').to.deep.eq(fromList)
}

export function selectSociety(form, society) {
  return FORMS[form].page.societySelect().select(society.value).should('have.value', society.value)
}

// Changes to another client: a client already seen without societies when there is one, otherwise the
// next client, otherwise back to "Seleccionar". Yields { value, knownEmpty }.
export function switchToAnotherClient(form, client) {
  const other = client.clients.find((option) => option.value !== client.value)
  const target = client.emptyClientValues[0] ?? other?.value ?? CLIENT_PLACEHOLDER.value
  const knownEmpty = client.emptyClientValues.length > 0
  const choice = target === CLIENT_PLACEHOLDER.value ? CLIENT_PLACEHOLDER.text : target
  return FORMS[form].page.chooseClient(choice).then(() => ({ value: target, knownEmpty }))
}

// None of the previous client's societies stays selected or listed.
export function assertSocietiesReset(form, previous) {
  const values = previous.societies.map((option) => option.value)
  const names = previous.societies.map((option) => normalizeName(option.text))
  return FORMS[form].page.societySelect({ timeout: CASCADE_TIMEOUTS.SOCIETIES_PER_CLIENT_MS }).should(($select) => {
    expect(values.includes($select.val()), 'selected value is a society of the previous client').to.eq(false)
    const listed = optionList($select)
      .filter((option) => values.includes(option.value) || names.includes(normalizeName(option.text))).length
    expect(listed, 'societies of the previous client still listed').to.eq(0)
  })
}

// Only the placeholder and "+ Nueva Sociedad" (crear) remain.
export function assertOnlySocietyPlaceholderAndCreate(form) {
  const { page, labels } = FORMS[form]
  return page.societySelect({ timeout: CASCADE_TIMEOUTS.SOCIETIES_PER_CLIENT_MS }).should(($select) => {
    const options = optionList($select)
    expect(options.map((option) => option.text), 'society options').to.deep.eq([labels.SOCIETY_PLACEHOLDER, labels.NEW_SOCIETY])
    expect(options[1].value, `value of "${labels.NEW_SOCIETY}"`).to.eq(CREATE_OPTION_VALUE)
  })
}

// ── Establishment selector ──

// Visible, "Seleccionar un establecimiento" first and "+ Nuevo establecimiento" (crear); real ones may be 0.
// Yields the real establishments.
export function assertEstablishmentSelectorShown(form) {
  const { labels } = FORMS[form]
  return FORMS[form].establishmentSelect({ timeout: CASCADE_TIMEOUTS.ESTABLISHMENTS_MS })
    .should('be.visible')
    .and(($select) => {
      const options = optionList($select)
      expect(options[0]?.text, 'first establishment option').to.eq(labels.ESTABLISHMENT_PLACEHOLDER)
      if (form === 'invernada') expect(options[0]?.value, 'value of the establishment placeholder').to.eq('')
      const create = options.find((option) => option.value === CREATE_OPTION_VALUE)
      expect(create?.text, 'new establishment option').to.eq(labels.NEW_ESTABLISHMENT)
    })
    .then(($select) => realOptions($select))
}

// ── deCampoPagos ──

// Parses the #btn_pagar href in memory and asserts origin, pathname and same-tab only. The href carries
// tokens (TST-AGT-002): it is never logged, aliased or printed in an assertion message.
export function assertDcpLink() {
  return MainAgentPage.dcpButton().should('be.visible').then(($link) => {
    const link = $link[0]
    let url
    try {
      url = new URL(link.getAttribute('href') || '', Cypress.config('baseUrl'))
    } catch (error) {
      throw new Error('The DCP link href is not a valid URL')
    }
    expect(url.origin, 'DCP link origin').to.eq(DCP_LINK.ORIGIN)
    expect(url.pathname, 'DCP link pathname').to.eq(DCP_LINK.PATHNAME)
    expect(link.getAttribute('target'), 'DCP link target').to.not.eq('_blank')
  })
}
