class FaenaReactOfferPage {
  selectors() {
    return {
      society: '#society',
      establishment: '#establishment',
      category: '#category',
      breedPicker: '.sc-hynwKY',
      quantity: '#quantity',
      minWeight: '#minWeight',
      averageWeight: '#averageWeight',
      maxWeight: '#maxWeight',
      confinementDays: '#confinementDays',
      dateCarga: '#dateCarga',
      desbaste: '#desbaste',
      distancia: '#distancia',
      comentario: '#comentario',
      videoInputs: 'input[type="file"]',
      submit: 'button',
    }
  }

  society() { return cy.get('#society') }
  establishment() { return cy.get('#establishment') }
  category() { return cy.get('#category') }
  breedPicker() { return cy.get('.sc-hynwKY') }
  submitButton() { return cy.contains('button', 'Cotizar Tropa') }

  selectFirstOption(selector, optionName) {
    return cy.get(selector).click().then(() => {
      const options = optionName
        ? cy.contains(`[name="${selector.slice(1)}"]`, optionName)
        : cy.get(`[name="${selector.slice(1)}"]`).not('.add').first()
      return options.click()
    })
  }

  selectFirstSociety() {
    return this.society().click().then(() => cy.get('[name="society"]').not('.add').first().click())
  }

  selectFirstEstablishment() {
    return this.establishment().should('not.have.class', 'disabled').click()
      .then(() => cy.get('[name="establishment"]').not('.add').first().click())
  }

  selectCategory(name = 'Vaca gorda') {
    return this.category().click().then(() => cy.contains('[name="category"]', name).click())
  }

  selectBreed(name = 'Aberdeen Angus Negro') {
    return this.breedPicker().click().then(() => cy.contains(name, { exact: true }).click())
  }

  clickChoice(name) { return cy.contains('button', name, { exact: true }).click() }

  fillOffer({ termination = 'Feedlot', destination = 'Consumo', freight = null } = {}) {
    this.selectFirstSociety()
    this.selectFirstEstablishment()
    this.selectCategory()
    cy.get('#quantity').clear().type('50')
    this.selectBreed()
    cy.get('#minWeight').clear().type('350')
    cy.get('#averageWeight').clear().type('425')
    cy.get('#maxWeight').clear().type('500')
    this.clickChoice(termination)
    this.clickChoice(destination)
    this.clickChoice('No')
    this.clickChoice('Sin Encierre')
    cy.get('#desbaste').clear().type('0')
    this.clickChoice('Establecimiento')
    cy.get('#distancia').clear().type('10')
    cy.get('#comentario').clear().type(`QA React ${Date.now()}`)
    if (freight) cy.contains('button', freight, { exact: true }).click()
    return this
  }

  openNewSociety() { return this.society().click().then(() => cy.contains('+ Agregar nueva sociedad').click()) }
  openNewEstablishment() { return this.establishment().click().then(() => cy.contains('+ Agregar nuevo establecimiento').click()) }
  cancelInlineForm() { return cy.contains('button', 'Cancelar', { exact: true }).click() }
}

export default new FaenaReactOfferPage()
