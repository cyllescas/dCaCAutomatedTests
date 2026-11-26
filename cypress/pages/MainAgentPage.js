import { AGENT_PATHS, AGENT_TEXTS } from '../support/data/representante_data'

// Selectors observed for the Representante on 2026-11-25 (specs/ofrecimientos-representante-core.md).
const CLIENT_ROWS = '.listado_p > .fila_listado'
const PAGE_TIMEOUT = 60000

const normalizeText = (text) => String(text || '').replace(/\s+/g, ' ').trim()

// Society names of a client row: `.sociedades` holds a table (Nombre Sociedad | Tel); the name is the
// first td of every data row. Header rows (th only, or the literal header text) are skipped.
function rowSocietyNames(row) {
  return [...row.querySelectorAll('.sociedades table tr')]
    .map((tr) => tr.querySelector('td'))
    .filter(Boolean)
    .map((td) => normalizeText(td.textContent))
    .filter((name, index) => !(index === 0 && /^nombre sociedad$/i.test(name)))
}

class MainAgentPage{
    mainTopNavbar(){
        return cy.get('#top')
    }
    topBanner(){
        return cy.get('.top-banner', { timeout: 60000 })
    }
    userMenu(){
        return cy.get('#div_log_out', { timeout: 60000 })
    }
    clientsNavLink(){
        return cy.get('a[href="/__dcac/misClientes"]', { timeout: 60000 })
    }
    mainBody(){
        return cy.get('#new_wraper', { timeout: 60000 });
    }
    mainTitleTendenciasDelMercado(){
        return cy.get('.contenedor_primario_escritorio > .titulo_secciones_home', { timeout: 60000 });
    }

    // ── Header of the Representante (MAP-AGT-001) ──

    loggedMenu(){
        return cy.get('.menu_logueado', { timeout: PAGE_TIMEOUT })
    }
    buyButton(){
        return cy.get('#btn_comprar', { timeout: PAGE_TIMEOUT })
    }
    // deCampoPagos access. Never click it, never log its href (it carries tokens, TST-AGT-002).
    dcpButton(){
        return cy.get('#btn_pagar', { timeout: PAGE_TIMEOUT })
    }
    performanceLink(){
        return cy.get('a[href="/__dcac/misPublicaciones/Resultados_rep"]')
    }
    profilePopupLinks(){
        return cy.get('a.a_perfil_pop')
    }

    // ── Clients page /__dcac/misClientes (MAP-AGT-002) ──

    clientsTitle(){
        return cy.get('.span_titulo_clientes', { timeout: PAGE_TIMEOUT })
    }
    clientSearchField(){
        return cy.get('#buscar_string', { timeout: PAGE_TIMEOUT })
    }
    clientSearchButton(){
        return cy.get('button.btn_buscar')
    }
    clientRows(){
        return cy.get(CLIENT_ROWS, { timeout: PAGE_TIMEOUT })
    }
    clientViewProfileButtonAt(index){
        return this.clientRows().eq(index).contains('a.btn.btn-live', AGENT_TEXTS.VIEW_PROFILE)
    }
    clientSocietiesLink(){
        return cy.get(`a[href^="${AGENT_PATHS.CLIENT_SOCIETIES_PREFIX}"]`, { timeout: PAGE_TIMEOUT })
    }
    societyViewButtons(){
        return cy.get('a.btn_ver_sociedad', { timeout: PAGE_TIMEOUT })
    }
    backToClientsLink(){
        return cy.contains(`a[href="${AGENT_PATHS.CLIENTS}"]`, AGENT_TEXTS.BACK_TO_CLIENTS, { timeout: PAGE_TIMEOUT })
    }

    // ── Methods ──

    // The header may render the link more than once (desktop/mobile); use the visible one.
    openClients(){
        return this.clientsNavLink().filter(':visible').first().click()
    }

    assertOnClientsPage(){
        cy.location('pathname', { timeout: PAGE_TIMEOUT }).should('eq', AGENT_PATHS.CLIENTS)
        this.clientsTitle().should('be.visible').and(($title) => {
            expect(normalizeText($title.text()), 'clients title').to.eq(AGENT_TEXTS.CLIENTS_TITLE)
        })
        return this.clientSearchField().should('be.visible')
    }

    searchClients(term){
        this.clientSearchField().clear().type(term)
        return this.clientSearchButton().click()
    }

    clearClientSearch(){
        this.clientSearchField().clear()
        return this.clientSearchButton().click()
    }

    // The search filters on the page itself: count only the rows the user can see.
    visibleClientRowCount(){
        this.clientRows().should('have.length.greaterThan', 0)
        return cy.get('body').then(($body) => $body.find(`${CLIENT_ROWS}:visible`).length)
    }

    assertVisibleClientRowCount(expected){
        return cy.get('body', { timeout: PAGE_TIMEOUT }).should(($body) => {
            expect($body.find(`${CLIENT_ROWS}:visible`).length, 'visible client rows').to.eq(expected)
        })
    }

    // Every visible row contains `term` (case-insensitive) and at least one row is shown.
    assertVisibleClientRowsContain(term){
        const expected = term.toLowerCase()
        return cy.get('body', { timeout: PAGE_TIMEOUT }).should(($body) => {
            const texts = [...$body.find(`${CLIENT_ROWS}:visible`)].map((row) => normalizeText(row.textContent).toLowerCase())
            expect(texts.length, 'visible client rows').to.be.greaterThan(0)
            const unmatched = texts.filter((text) => !text.includes(expected)).length
            expect(unmatched, 'visible rows without the search term').to.eq(0)
        })
    }

    // Each row shows a non-empty client name, the sociedades column and one "Ver Perfil" link.
    assertEveryClientRowHasDetails(){
        return this.clientRows().should(($rows) => {
            expect($rows.length, 'client rows').to.be.greaterThan(0)
            ;[...$rows].forEach((row, index) => {
                expect(normalizeText(row.querySelector('.clientes')?.textContent), `client name of row ${index + 1}`).to.not.be.empty
                expect(row.querySelectorAll('.sociedades').length, `sociedades column of row ${index + 1}`).to.be.greaterThan(0)
                const profileLinks = [...row.querySelectorAll('a.btn.btn-live')]
                    .filter((link) => normalizeText(link.textContent) === AGENT_TEXTS.VIEW_PROFILE)
                expect(profileLinks.length, `"Ver Perfil" links of row ${index + 1}`).to.eq(1)
            })
        })
    }

    // Yields [{ name, societies, societyRowCount }] for every row. `societies` keeps only the non-empty
    // names (some rows show empty names, OQ-076); `societyRowCount` counts every society row.
    clientRowsData(){
        return this.clientRows().should('have.length.greaterThan', 0).then(($rows) => [...$rows].map((row) => {
            const names = rowSocietyNames(row)
            return {
                name: normalizeText(row.querySelector('.clientes')?.textContent),
                societies: names.filter(Boolean),
                societyRowCount: names.length,
            }
        }))
    }

    openClientProfileAt(index){
        return this.clientViewProfileButtonAt(index).click()
    }

    assertOnClientProfile(){
        return cy.location('pathname', { timeout: PAGE_TIMEOUT }).should('match', new RegExp(`^${AGENT_PATHS.CLIENT_PROFILE_PREFIX}`))
    }

    openClientSocieties(){
        return this.clientSocietiesLink().filter(':visible').first().click()
    }

    assertOnClientSocieties(){
        cy.location('pathname', { timeout: PAGE_TIMEOUT }).should('match', new RegExp(`^${AGENT_PATHS.CLIENT_SOCIETIES_PREFIX}`))
        return this.societyViewButtons().should('have.length.greaterThan', 0)
    }

    backToClients(){
        return this.backToClientsLink().click()
    }

}
export default new MainAgentPage();
