// Global search of the Admin (visible on the home and other screens): tropaId, ENTER, option Invernada.
const INVERNADA_OPTION = /^\s*invernada\s*$/i

class AdminSearchPage {
  searchInput() {
    return cy.get('#busca_i', { timeout: 60000 })
  }

  options() {
    return cy.get('#busca label.btn.btn-danger')
  }

  invernadaOption() {
    return this.options().filter((index, element) => INVERNADA_OPTION.test(element.textContent))
  }

  // The search is by number only (OQ-065: it is not exclusive to tropaId).
  searchTropa(tropaId) {
    this.searchInput().clear().type(`${tropaId}{enter}`)
    return this.invernadaOption().should('be.visible').first().click()
  }
}

export default new AdminSearchPage()
