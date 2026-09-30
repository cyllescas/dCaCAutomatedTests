class InvernadaBuyerLegajoPage {
  visitAdmin() {
    cy.visit('/__dcac/')
  }

  openInvernadaMenu() {
    return cy.get('.dropdown-toggle').contains('INVERNADA').click()
  }

  soldInvernadaLink() {
    return cy.get('a[href="?vendidas_invernada&secc=i&tit=2"]').filter(':visible')
  }

  openSoldInvernada() {
    this.soldInvernadaLink().click()
    cy.contains('Tropas Vendidas', { timeout: 60000 }).should('be.visible')
    cy.contains('Tropas:', { timeout: 60000 }).should('be.visible')
    cy.contains('Ver Legajo', { timeout: 60000 }).should('be.visible')
  }

  legajoLinks() {
    return cy.get('a[href="#legajo"]').filter(':visible')
  }

  openFirstLegajo() {
    this.legajoLinks().first().click()
    cy.contains('Información Comprador', { timeout: 60000 }).should('be.visible')
  }

  buyerSection() {
    return cy.get('#loader_comprador')
  }

  buyerSectionTitle() {
    return cy.contains('Información Comprador', { timeout: 60000 }).filter(':visible')
  }

  editBuyer() {
    cy.contains('Información Comprador').parent().contains('a', 'Editar').click()
    return this.buyerUserPicker().should('be.visible')
  }

  buyerUserPicker() {
    return cy.get('#sociedades_select_chosen')
  }

  openBuyerUserPicker() {
    this.buyerUserPicker().click()
    this.buyerUserPicker().find('li').filter(':visible').should('have.length.greaterThan', 0)
  }

  selectUnassignedBuyer() {
    this.buyerUserPicker().find('li').filter(':visible').contains('Sin definir').first().click()
  }

  selectFirstAssignedBuyer() {
    this.buyerUserPicker().find('li').filter(':visible').then(($items) => {
      const item = [...$items].find((node) => node.innerText.trim() !== 'Sin definir')
      expect(item, 'an eligible buyer option').to.exist
      cy.wrap(item).click()
    })
  }

  selectedBuyerText() {
    return this.buyerUserPicker().find('a').first().invoke('text').then((text) => text.trim())
  }

  saveBuyerEdit() {
    return cy.contains('a', 'Guardar').filter(':visible').click()
  }

  saveAndAssertSelectedBuyerIsDisplayed() {
    this.selectedBuyerText().then((selectedBuyer) => {
      this.saveBuyerEdit()
      this.buyerSectionTitle().should('be.visible')
      this.readOnlyBuyerValue().should('eq', selectedBuyer)
    })
  }

  cancelBuyerEdit() {
    cy.contains('a', 'Anular edición').filter(':visible').click()
    cy.get('[role="dialog"]').should('contain.text', '¿Eliminar los cambios realizados?')
    cy.get('[role="dialog"]').contains('button', 'Aceptar').click()
    this.buyerSectionTitle().should('be.visible')
  }

  buyerInfoLink() {
    return cy.get('a[href*="?u&cliente="]').filter(':visible').first()
  }

  openBuyerInfo() {
    this.buyerInfoLink().should('be.visible').invoke('removeAttr', 'target').then(($link) => {
      $link[0].click()
    })
  }

  readOnlyBuyerShouldBeAssigned() {
    return cy.contains('Usuario:').parent().should('not.contain.text', 'No disponible')
  }

  readOnlyBuyerValue() {
    return this.buyerSection().contains('Usuario:').parent().invoke('text').then((text) => {
      return text.replace(/\s+/g, ' ').replace(/^\s*Usuario:\s*/, '').trim()
    })
  }

  userProfileHeading() {
    return cy.get('main').should('contain.text', 'Usuario')
  }
}

export default new InvernadaBuyerLegajoPage()
