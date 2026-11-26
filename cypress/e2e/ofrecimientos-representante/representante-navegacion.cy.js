// specs/ofrecimientos-representante-core.md — AGT-07, navigation of the Representante (TC-AGT-001..006).
// Not automated: TC-AGT-007 (blocked_by_open_question OQ-040/OQ-072), TC-AGT-010 (manual_only).
// TC-AGT-008/009 were retired in the human review (2026-11-26).
// Never clicks #btn_pagar, DCP REACT, Crear Nuevo Cliente, Descargar Listado or #nueva_sociedad.
import MainAgentPage from '../../pages/MainAgentPage'
import MainClientPage from '../../pages/MainClientPage'
import { skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import { agentCredentials, assertDcpLink, visitAgentClients, visitAgentHome } from '../../support/helpers/representante_helper'
import { AGENT_TEXTS, noMatchSearchTerm } from '../../support/data/representante_data'

const credentials = agentCredentials()

describe('Representante: navegación y accesos del rol @representante @agent @regression', () => {
  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'representante')
  })

  describe('Header del Representante', () => {
    beforeEach(() => {
      visitAgentHome(credentials)
    })

    it('TC-AGT-001: el header del Representante muestra los accesos propios del rol', () => {
      MainAgentPage.topBanner().should('be.visible')
      MainAgentPage.userMenu().should('be.visible')
      MainAgentPage.buyButton().should('be.visible')
      MainClientPage.mainCotizarButton().should('be.visible')
      MainAgentPage.clientsNavLink().filter(':visible').first().should('contain.text', AGENT_TEXTS.CLIENTS_LINK)
      MainAgentPage.dcpButton().should('be.visible')
    })

    it('TC-AGT-006: el header ofrece el acceso a deCampoPagos (DCP) en la misma pestaña', () => {
      assertDcpLink()
    })
  })

  describe('Clientes del Representante', () => {
    it('TC-AGT-002: Clientes abre el listado de clientes del Representante', () => {
      visitAgentHome(credentials)

      MainAgentPage.openClients()

      MainAgentPage.assertOnClientsPage()
      MainAgentPage.clientRows().should('have.length.greaterThan', 0)
      MainAgentPage.assertEveryClientRowHasDetails()
    })

    it('TC-AGT-003: la búsqueda sin coincidencias no muestra clientes y vaciarla restaura el listado', () => {
      visitAgentClients(credentials)

      MainAgentPage.visibleClientRowCount().then((initialRows) => {
        expect(initialRows, 'initial client rows').to.be.greaterThan(0)

        MainAgentPage.searchClients(noMatchSearchTerm())
        MainAgentPage.assertVisibleClientRowCount(0)

        MainAgentPage.clearClientSearch()
        MainAgentPage.assertVisibleClientRowCount(initialRows)
      })
    })

    it('TC-AGT-004: la búsqueda parcial por nombre muestra sólo clientes que contienen el término', () => {
      visitAgentClients(credentials)

      MainAgentPage.clientRowsData().then((rows) => {
        const term = rows[0].name.slice(0, 4).trim()
        expect(term, 'search term taken from the first client').to.not.be.empty

        MainAgentPage.searchClients(term)

        MainAgentPage.assertVisibleClientRowsContain(term)
      })
    })

    it('TC-AGT-005: Ver Perfil de un cliente abre sus datos y sus sociedades, y vuelve al listado', () => {
      visitAgentClients(credentials)

      MainAgentPage.clientRowsData().then((rows) => {
        // Use a client that lists at least one named sociedad, so "Mis Sociedades" has something to show.
        // Rows whose society rows all have empty names (OQ-076) show "No posee sociedades vinculadas".
        const withSocieties = rows.findIndex((row) => row.societies.length > 0)
        expect(withSocieties, 'Clients row with at least one named sociedad').to.be.at.least(0)
        MainAgentPage.openClientProfileAt(withSocieties)
      })
      MainAgentPage.assertOnClientProfile()

      MainAgentPage.openClientSocieties()
      MainAgentPage.assertOnClientSocieties()

      MainAgentPage.backToClients()
      MainAgentPage.assertOnClientsPage()
    })
  })
})
