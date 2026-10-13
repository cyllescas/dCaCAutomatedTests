const OPERATIONS_LOAD_TIMEOUT = 90000

const normalize = (text) => String(text).replace(/\s+/g, ' ').trim().toLowerCase()

// Pendientes de publicacion list (/__dcac/misPublicaciones), reached from the
// "operaciones" link of the confirmation view.
class InvernadaMyPublicationsPendingPage {
  // Each tropa is one `.listado` block holding a single `.id_titulo_lote` ("#<id>").
  // Pendientes has no id search, so the block is found by the exact text of that id
  // ("#354" must not match "#35417"); the text carries surrounding whitespace.
  pendingItem(tropaId) {
    return cy.get('#contenido-listado .listado', { timeout: OPERATIONS_LOAD_TIMEOUT })
      .filter((index, element) => Cypress.$(element).find('.id_titulo_lote').text().trim() === `#${tropaId}`)
      .should('have.length', 1)
  }

  lotId() {
    return cy.get('.id_titulo_lote')
  }

  quantityCategory() {
    return cy.get('.tit_cant_cat')
  }

  weight() {
    return cy.get('.tit_peso')
  }

  breed() {
    return cy.get('.tit_razas')
  }

  society() {
    return cy.get('.razon_social_titulo')
  }

  reportButton() {
    return cy.get('button.modal-informe')
  }

  reportModal() {
    return cy.get('#modal-informe')
  }

  reportSegmentation() {
    return cy.get('#segmentacion_de_tropa')
  }

  reportAverageWeight() {
    return cy.get('#peso_promedio')
  }

  reportCharacteristicsButton() {
    return cy.get('#btn_caracteristicas')
  }

  reportSuggestedQuantity() {
    return cy.get('#cant_sugerida')
  }

  reportCharacteristics() {
    return cy.get('#caracteristicas_de_tropa')
  }

  assertPendingItem(tropaId, expected) {
    this.pendingItem(tropaId).within(() => {
      this.quantityCategory().should(($el) => {
        const text = normalize($el.text())
        expect(text).to.contain(expected.quantity)
        expect(text).to.contain(normalize(expected.category))
      })
      this.weight().should(($el) => expect($el.text()).to.contain(expected.weight))
      this.breed().should(($el) => expect(normalize($el.text())).to.contain(normalize(expected.breed)))
      this.society().should(($el) => expect(normalize($el.text())).to.contain(normalize(expected.society)))
      this.lotId().should('contain.text', `#${tropaId}`)
    })
  }

  // Only the Terneros report has observed selectors (TC-INV-033).
  openReport(tropaId) {
    this.pendingItem(tropaId).within(() => this.reportButton().click())
    return this.reportModal().should('be.visible')
  }

  // `segmentation` is the loaded data (weights and quantities), `weight` the average weight.
  assertReportSegmentation({ segmentation, weight }) {
    this.reportSegmentation().should(($el) => {
      const text = normalize($el.text())
      Object.values(segmentation).forEach((value) => expect(text).to.contain(value))
    })
    this.reportAverageWeight().should(($el) => expect($el.text()).to.contain(weight))
  }

  openReportCharacteristics() {
    return this.reportCharacteristicsButton().click()
  }

  assertReportSuggestedQuantity(quantity) {
    return this.reportSuggestedQuantity().should(($el) => expect(`${$el.val() || ''}${$el.text()}`).to.contain(quantity))
  }

  // `lines` are "Label: value" texts as the report prints them.
  assertReportCharacteristics(lines) {
    return this.reportCharacteristics().should(($el) => {
      const text = normalize($el.text())
      lines.forEach((line) => expect(text, `report line: ${line}`).to.contain(normalize(line)))
    })
  }
}

export default new InvernadaMyPublicationsPendingPage()
