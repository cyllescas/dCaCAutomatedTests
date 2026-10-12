const OFFER_CREATION_TIMEOUT = 90000

const normalize = (text) => String(text).replace(/\s+/g, ' ').trim().toLowerCase()

// Confirmation view shown after "Ofrecer Tropa".
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
}

export default new InvernadaConfirmationPage()
