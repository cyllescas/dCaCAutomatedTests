class InvernadaOfferPage {
  societySelect() {
    return cy.get('#sociedad_select')
  }

  establishmentSelect() {
    return cy.get('#estab_soc')
  }

  categorySelect() {
    return cy.get('#categoriasSelect')
  }

  field(name) {
    return cy.get(`[name="${name}"]`)
  }

  visibleField(name) {
    return this.field(name).filter(':visible')
  }

  assertVisibleFields(names, description) {
    names.forEach((name) => {
      this.visibleField(name).should('be.visible', `${description}: ${name}`)
    })
  }

  assertHiddenFields(names, description) {
    names.forEach((name) => {
      this.visibleField(name).should('not.exist', `${description}: ${name}`)
    })
  }

  visibleLabel(label) {
    return cy.contains('.label_form_rapido, label', label).filter(':visible').first()
  }

  assertVisibleLabels(labels, description) {
    labels.forEach((label) => this.visibleLabel(label).should('be.visible', `${description}: ${label}`))
  }

  selectCategory(label) {
    return this.categorySelect().select(label).should('have.value')
  }

  selectFirstOption(name) {
    return this.visibleField(name).find('option').then(($options) => {
      const option = [...$options].find((item) => item.value && item.value !== '0')
      expect(option, `available option for ${name}`).to.exist
      return this.visibleField(name).select(option.value)
    })
  }

  serviceSection() {
    return cy.get('#informe_servicioDiv')
  }

  serviceBranchFields() {
    return cy.get('#fechas_inseminacion, #form_raza_servicio_origen_toros').filter(':visible')
  }

  selectServiceType(label) {
    return cy.contains('label', label).filter(':visible').click()
  }

  selectZone(label) {
    return cy.contains('label', label).filter(':visible').click()
  }

  sanitaryZoneFields() {
    return cy.get('#garrapataDiv, #miomioDiv').filter(':visible')
  }

  selectFirstAvailableSociety() {
    const configured = Cypress.env('INVERNADA_SOCIETY_VALUE')
    if (configured) return this.societySelect().select(configured)

    return this.societySelect().find('option').then(($options) => {
      const option = [...$options].find((item) => item.value && item.value !== 'crear')
      expect(option, 'available invernada society').to.exist
      return this.societySelect().select(option.value)
    })
  }

  selectFirstAvailableEstablishment() {
    const configured = Cypress.env('INVERNADA_ESTABLISHMENT_VALUE')
    if (configured) return this.establishmentSelect().select(configured)

    return this.establishmentSelect().should('be.visible').find('option').then(($options) => {
      const option = [...$options].find((item) => item.value && item.value !== 'crear')
      expect(option, 'available invernada establishment').to.exist
      return this.establishmentSelect().select(option.value)
    })
  }

  societyModal() {
    return cy.get('#modal_crear')
  }

  establishmentModal() {
    return cy.get('#modal-establecimiento-edit')
  }

  openNewSociety() {
    return this.societySelect().select('crear').then(() => this.societyModal().should('be.visible'))
  }

  openNewEstablishment() {
    return this.establishmentSelect().select('crear').then(() => this.establishmentModal().should('be.visible'))
  }

  saveSociety() {
    return this.societyModal().find('button').contains('Guardar').click().then(() => {
      cy.contains('button', 'Aceptar').filter(':visible').click()
    })
  }

  saveEstablishment() {
    return this.establishmentModal().find('button').contains('Guardar').click()
  }

  cancelModal(modal) {
    return modal.find('button').filter(':visible').first().click()
  }

  fillNewSociety() {
    const suffix = Date.now()
    const name = Cypress.env('INVERNADA_NEW_SOCIETY_NAME') || `QA Sociedad Invernada ${suffix}`
    const cuit = Cypress.env('INVERNADA_NEW_SOCIETY_CUIT') || this.validRuntimeCuit(suffix)

    this.openNewSociety()
    this.societyModal().find('#razonsocial').clear().type(name)
    this.societyModal().find('#cuit').clear().type(cuit)
    return { name }
  }

  validRuntimeCuit(seed) {
    const base = `30${String(seed).replace(/\D/g, '').slice(-8).padStart(8, '0')}`
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
    const sum = [...base].reduce((total, digit, index) => total + Number(digit) * weights[index], 0)
    const remainder = 11 - (sum % 11)
    const check = remainder === 11 ? 0 : remainder === 10 ? 9 : remainder
    return `${base}${check}`
  }

  fillNewEstablishment() {
    const name = Cypress.env('INVERNADA_NEW_ESTABLISHMENT_NAME') || `QA Establecimiento Invernada ${Date.now()}`

    this.openNewEstablishment()
    this.establishmentModal().find('input[type="text"]').filter(':visible').first().clear().type(name)
    this.establishmentModal().find('#Provincias, select[name="provincia"]').filter(':visible').first().then(($province) => {
      if (!$province.val()) {
        const option = [...$province[0].options].find((item) => item.value && item.value !== '0')
        if (option) cy.wrap($province).select(option.value)
      }
    })
    this.establishmentModal().find('#Partido, select[name="partido"]').filter(':visible').first()
      .should('not.be.disabled')
      .find('option').then(($options) => {
        const option = [...$options].find((item) => item.value && item.value !== '0')
        expect(option, 'available establishment party').to.exist
        return this.establishmentModal().find('#Partido, select[name="partido"]').filter(':visible').first().select(option.value)
      })
    return { name }
  }

  assertOptionAndSelect(select, name, description) {
    return select.should(($element) => {
      const expected = name.trim().toLowerCase()
      const found = [...$element.find('option')].some((option) => option.textContent.trim().toLowerCase().includes(expected))
      expect(found, `${description} in dropdown`).to.eq(true)
    }).then(($element) => {
      const expected = name.trim().toLowerCase()
      const option = [...$element.find('option')].find((item) => item.textContent.trim().toLowerCase().includes(expected))
      return cy.wrap($element).select(option.value).should('have.value', option.value)
    })
  }

  submitEmptyOffer() {
    return cy.get('.btn_ofrecer.env').click()
  }

  visibleValidationMessages() {
    return cy.get('body').invoke('text').should('match', /Debe completar el campo (Cantidad|Raza|Plazo de venta)/)
  }
}

export default new InvernadaOfferPage()
