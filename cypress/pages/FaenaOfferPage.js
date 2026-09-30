class FaenaOfferPage {
  societySelect() {
    return cy.get('#sociedad_select')
  }

  establishmentSelect() {
    return cy.get("select[name='ng_establecimiento']")
  }

  selectedSocietyName() {
    return this.societySelect().find('option:selected').invoke('text').then((text) => text.trim())
  }

  selectedEstablishmentName() {
    return this.establishmentSelect().find('option:selected').invoke('text').then((text) => text.trim())
  }

  establishmentMenu() {
    return cy.get('#estab')
  }

  selectFirstAvailableSociety() {
    const configured = Cypress.env('FAENA_SOCIETY_VALUE')
    if (configured) {
      return this.societySelect().select(configured)
    }

    return this.societySelect().find('option').then(($options) => {
      const option = [...$options].find((item) => item.value && item.value !== 'crear')
      expect(option, 'available society').to.exist
      this.societySelect().select(option.value)
    })
  }

  selectFirstAvailableEstablishment() {
    const configured = Cypress.env('FAENA_ESTABLISHMENT_VALUE')
    if (configured) {
      return this.establishmentSelect().select(configured)
    }

    return this.establishmentSelect().should('be.visible').find('option').then(($options) => {
      const option = [...$options].find((item) => item.value && item.value !== 'crear')
      expect(option, 'available establishment').to.exist
      return this.establishmentSelect().select(option.value).should('have.value', option.value)
    })
  }

  openNewSociety() {
    return this.societySelect().select('crear').then(() => this.societyModal().should('be.visible'))
  }

  newSocietyNameField() {
    return cy.get('#razonsocial')
  }

  newSocietyCuitField() {
    return cy.get('#cuit')
  }

  openNewEstablishment() {
    return this.establishmentMenu().select('crear').then(() => this.establishmentModal().should('be.visible'))
  }

  newEstablishmentNameField() {
    return cy.get('#Nombre')
  }

  establishmentModal() {
    return cy.get('#modal-establecimiento-edit')
  }

  societyModal() {
    return cy.get('#modal_crear')
  }

  saveButton() {
    return cy.get('button').contains('Guardar')
  }

  establishmentSaveButton() {
    return this.establishmentModal().find('button').contains('Guardar')
  }

  societySaveButton() {
    return this.societyModal().find('button').contains('Guardar')
  }

  categorySelect() {
    return cy.get("select[name='ng_categoria']")
  }

  breedSelect() {
    return cy.get("select[name='ng_raza']")
  }

  chooseRadio(id) {
    return cy.get(`label[for='${id}']`).click()
  }

  fillValidOffer(options = {}) {
    this.selectFirstAvailableSociety()
    this.selectFirstAvailableEstablishment()
    this.chooseRadio('simple')
    this.categorySelect().select('Vaca gorda')
    this.chooseRadio(options.termination || 'feedlot')
    this.chooseRadio(options.destination || 'consumo')
    this.chooseRadio('apto_china_no')
    this.breedSelect().select('Aberdeen Angus Negro')
    cy.get("input[name='ng_peso_min']").type('350')
    cy.get("input[name='ng_peso_max']").type('500')
    cy.get("input[name='ng_peso']").type('425')
    cy.get('#fecha_I').type('2026-09-10')
    cy.get("input[name='ng_condiciones_plazo_cotizacion']").type('30')
    this.chooseRadio('sin_encierre')
    cy.get("input[name='ng_condiciones_desbaste']").type('0')
    this.chooseRadio(options.freight || 'a_retirar')
  }

  submitEmptyOffer() {
    return this.submitOffer()
  }

  visibleValidationMessages() {
    return cy.get('body').invoke('text').should('match', /obligatorio|obligatoria|completar|requerido/i)
  }

  createSocietyAtRuntime() {
    const suffix = Date.now()
    const name = Cypress.env('FAENA_NEW_SOCIETY_NAME') || `QA Sociedad ${suffix}`
    const cuit = Cypress.env('FAENA_NEW_SOCIETY_CUIT') || `30${String(suffix).slice(-9)}`

    this.openNewSociety()
    this.newSocietyNameField().clear().type(name)
    this.newSocietyCuitField().clear().type(cuit)
    this.societySaveButton().click()

    return this.societySelect().should(($select) => {
      const options = [...$select.find('option')].map((option) => option.textContent)
      expect(options.some((option) => option.includes(name)), 'new society in dropdown').to.eq(true)
    }).then(($select) => {
      const option = [...$select.find('option')].find((item) => item.textContent.includes(name))
      if ($select.val() !== option.value) cy.wrap($select).select(option.value)
    })
  }

  createEstablishmentAtRuntime() {
    const name = Cypress.env('FAENA_NEW_ESTABLISHMENT_NAME') || `QA Establecimiento ${Date.now()}`
    this.openNewEstablishment()
    this.newEstablishmentNameField().clear().type(name)

    this.establishmentModal().find('select').each(($select) => {
      if ($select.is(':visible') && $select.val() === '') {
        const option = [...$select[0].options].find((item) => item.value)
        if (option) cy.wrap($select).select(option.value)
      }
    })
    this.establishmentSaveButton().click()

    return this.establishmentSelect().should(($select) => {
      const options = [...$select.find('option')].map((option) => option.textContent)
      expect(options.some((option) => option.includes(name)), 'new establishment in dropdown').to.eq(true)
    }).then(($select) => {
      const option = [...$select.find('option')].find((item) => item.textContent.includes(name))
      if ($select.val() !== option.value) cy.wrap($select).select(option.value)
    })
  }

  submitOffer() {
    return cy.get('div._boot.btn_agregar_listado.env').contains('Ofrecer tropa').click()
  }

  confirmationMessage() {
    return cy.contains('Su tropa ha sido creada correctamente')
  }

  operationsLink() {
    return cy.get('a').contains(/^operaciones$/)
  }
}

export default new FaenaOfferPage()
