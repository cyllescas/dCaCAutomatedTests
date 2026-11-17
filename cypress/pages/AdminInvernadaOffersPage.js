const LISTING_LOAD_TIMEOUT = 180000
// The menu text carries a counter badge ("INVERNADA 247"): the exact word plus optional digits.
const INVERNADA_MENU = /^\s*INVERNADA\s*\d*\s*$/

// Admin home > INVERNADA > Ofrecimientos: one `div#fila_<tropaId>` per tropa.
class AdminInvernadaOffersPage {
  // ── Selectores ──

  // Exact menu text inside its container: other menus (FAENA, ...) share `a.dropdown-toggle`.
  invernadaMenu() {
    return cy.get('nav#navbar a.dropdown-toggle', { timeout: 60000 })
      .filter((index, element) => INVERNADA_MENU.test(element.textContent))
  }

  offersLink() {
    return cy.get('a[href="?ofrecimientos_a&secc=i&tit=0"]')
  }

  // `div.loading-listado` ("Cargando...") stays in the DOM once loaded: only its visibility counts.
  loadingIndicator() {
    return cy.get('body', { timeout: LISTING_LOAD_TIMEOUT, log: false })
  }

  // Each tropa row is `div#fila_<id>.listado_body.fila` (observed with an extra `_boot` class).
  firstRow() {
    return cy.get('#listadoOfrecimientos [id^="fila_"]', { timeout: LISTING_LOAD_TIMEOUT, log: false })
  }

  listing() {
    return cy.get('#listadoOfrecimientos', { timeout: LISTING_LOAD_TIMEOUT })
  }

  row(tropaId) {
    return cy.get(`#fila_${tropaId}`, { timeout: LISTING_LOAD_TIMEOUT })
  }

  society(tropaId) {
    return this.row(tropaId).find('a[href*="pag=sociedad"]')
  }

  quantity(tropaId) {
    return this.row(tropaId).find('.cantidad')
  }

  category(tropaId) {
    return this.row(tropaId).find('.categoria')
  }

  weight(tropaId) {
    return this.row(tropaId).find('.peso')
  }

  establishment(tropaId) {
    return this.row(tropaId).find('.nombre')
  }

  viewLegajoButton(tropaId) {
    return this.row(tropaId).find('a[onclick^="cargar_form_invernada"]')
  }

  // ── Métodos ──

  openOfferings() {
    this.invernadaMenu().click()
    this.offersLink().filter(':visible').click()
    cy.task('trace', 'admin: Ofrecimientos link clicked, waiting for rows', { log: false })
    // The listing is slow: "Cargando..." must disappear before looking for a row.
    // Rows first (cheap), then the loading message must be gone: the page holds 100 tropas.
    this.firstRow().should('exist')
    cy.task('trace', 'admin: first row present, waiting for "Cargando..." to go', { log: false })
    return this.loadingIndicator().should(($body) => {
      expect($body.find('.loading-listado:visible'), 'visible "Cargando..." indicator').to.have.length(0)
    })
  }

  // OQ-066: pages of 100, newest first. A missing row is reported clearly.
  assertRowListed(tropaId) {
    return this.listing().should(($listing) => {
      expect($listing.find(`#fila_${tropaId}`).length, `tropa #${tropaId} listed in the first page of Ofrecimientos`).to.eq(1)
    })
  }

  openLegajo(tropaId) {
    return this.viewLegajoButton(tropaId).click()
  }
}

export default new AdminInvernadaOffersPage()
