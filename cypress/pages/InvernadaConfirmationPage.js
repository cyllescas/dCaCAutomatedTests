const OFFER_CREATION_TIMEOUT = 90000
const OPERATIONS_LOAD_TIMEOUT = 90000

const normalize = (text) => String(text).replace(/\s+/g, ' ').trim().toLowerCase()

// Confirmation view after "Ofrecer Tropa" and the Pendientes de publicacion list.
class InvernadaConfirmationPage {
  // Submission is asynchronous (3 to 5 s): wait for the confirmation title.
  title() {
    return cy.get('.titulo_tropa_cargada', { timeout: OFFER_CREATION_TIMEOUT })
  }

  operationsLink() {
    return cy.get('.txt_tropa_cargada a')
  }

  // The text lives in the `.btn_topa_cargada` block; its inner `a` was observed
  // empty or missing in some renders, so the block is the assertion target.
  newOfferButton() {
    return cy.get('.btn_topa_cargada')
  }

  assertOfferCreated() {
    this.title().should('be.visible').and('contain.text', 'Su tropa ha sido creada correctamente')
    this.operationsLink().should('be.visible').and('contain.text', 'operaciones')
    this.newOfferButton().should(($button) => {
      expect(normalize($button.text())).to.contain('ingresar nueva tropa')
    })
  }

  // The submission did not go through the "video not finished" prompt.
  assertNoVideoPrompt() {
    return cy.get('body').should(($body) => {
      expect($body.find('#modal_siguiente:visible'), 'video prompt').to.have.length(0)
    })
  }

  goToOperations() {
    return this.operationsLink().click()
  }

  // The new tropa is located by the id of its lot ("#<id>"); Pendientes has no id search.
  pendingItem(tropaId, contains = '.tit_cant_cat') {
    return cy.contains('#contenido-listado .listado .titulo_ticket_inv .id_titulo_lote', `#${tropaId}`, { timeout: OPERATIONS_LOAD_TIMEOUT })
      .should('be.visible')
      .then(($id) => {
        // Nearest ancestor that holds the item data, whatever the exact markup is.
        const item = $id.parents().filter((index, element) => {
          const $element = Cypress.$(element)
          return $element.find(contains).length > 0 && $element.find('.id_titulo_lote').length === 1
        }).first()
        expect(item.length, `list item of tropa #${tropaId}`).to.eq(1)
        return cy.wrap(item)
      })
  }

  assertPendingItem(tropaId, expected) {
    this.pendingItem(tropaId).within(() => {
      cy.get('.tit_cant_cat').should(($el) => {
        const text = normalize($el.text())
        expect(text).to.contain(expected.quantity)
        expect(text).to.contain(normalize(expected.category))
      })
      cy.get('.tit_peso').should(($el) => expect($el.text()).to.contain(expected.weight))
      cy.get('.tit_razas').should(($el) => expect(normalize($el.text())).to.contain(normalize(expected.breed)))
      cy.get('.razon_social_titulo').should(($el) => expect(normalize($el.text())).to.contain(normalize(expected.society)))
      cy.get('.id_titulo_lote').should('contain.text', `#${tropaId}`)
    })
  }

  // Only the Terneros report has observed selectors (TC-INV-033).
  openReport(tropaId) {
    this.pendingItem(tropaId, 'button.modal-informe').find('button.modal-informe').click()
    return cy.get('#modal-informe').should('be.visible')
  }

  assertReportSegmentation(values) {
    cy.get('#segmentacion_de_tropa').should(($el) => {
      const text = normalize($el.text())
      values.forEach((value) => expect(text).to.contain(value))
    })
    cy.get('#peso_promedio').should(($el) => expect($el.text()).to.contain('250'))
  }

  openReportCharacteristics() {
    return cy.get('#btn_caracteristicas').click()
  }

  assertReportCharacteristics({ quantity, ageMonths, zone, weaned, castrated }) {
    cy.get('#cant_sugerida').should(($el) => expect(`${$el.val() || ''}${$el.text()}`).to.contain(quantity))
    cy.get('#caracteristicas_de_tropa').should(($el) => {
      const text = normalize($el.text())
      expect(text).to.match(new RegExp(`${ageMonths}\\s*meses`))
      expect(text).to.contain(normalize(zone))
      expect(text).to.match(new RegExp(`destetados\\W*${weaned}`))
      expect(text).to.match(new RegExp(`capados\\W*${castrated}`))
    })
  }
}

export default new InvernadaConfirmationPage()
