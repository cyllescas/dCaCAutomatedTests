import { MESSAGES } from '../support/data/faena_offer_data'

const VISIBLE_CONTROLS = 'input:visible, select:visible, textarea:visible, label[for]:visible'
const VIDEO_RESULT_TIMEOUT = 90000
const REACT_ORIGIN = 'https://react-stage.dcac.ar'

class FaenaOfferPage {
  // ── Selectores ──

  societySelect() {
    return cy.get('#sociedad_select')
  }

  establishmentSelect() {
    return cy.get("select[name='ng_establecimiento']")
  }

  establishmentMenu() {
    return cy.get('#estab')
  }

  newSocietyNameField() {
    return cy.get('#razonsocial')
  }

  newSocietyCuitField() {
    return cy.get('#cuit')
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

  confirmationMessage() {
    return cy.contains('Su tropa ha sido creada correctamente')
  }

  operationsLink() {
    return cy.get('a').contains(/^operaciones$/)
  }

  offerTitle() {
    return cy.contains('Publicar una tropa de Gordo')
  }

  submitButton() {
    return cy.get('div._boot.btn_agregar_listado.env').contains('Ofrecer tropa')
  }

  radioLabel(id) {
    return cy.get(`label[for='${id}']`)
  }

  confinementDaysField() {
    return cy.get("input[name='ng_dias_encierre']")
  }

  addBreedButton() {
    return cy.get('.agr_raza')
  }

  breedSelectAt(index) {
    // ng_raza, ng_raza2, ng_raza3
    return cy.get(`select[name='${index === 0 ? 'ng_raza' : `ng_raza${index + 1}`}']`)
  }

  visibleBreedSelects() {
    return cy.get("select[name^='ng_raza']:visible")
  }

  minWeightField() {
    return cy.get("input[name='ng_peso_min']")
  }

  maxWeightField() {
    return cy.get("input[name='ng_peso_max']")
  }

  averageWeightField() {
    return cy.get("input[name='ng_peso']")
  }

  loadDateField() {
    return cy.get('#fecha_I')
  }

  commentsField() {
    return cy.get("textarea[name='ng_aclaracion']")
  }

  salePeriodField() {
    return cy.get("input[name='ng_condiciones_plazo_cotizacion']")
  }

  shrinkageField() {
    return cy.get("input[name='ng_condiciones_desbaste']")
  }

  requiredMessages() {
    return cy.get('.alert_input_faltante')
  }

  videoButton() {
    return cy.get('input[type=button].btn_subir_video')
  }

  videoFileInput() {
    return cy.get('#fileuploadVideo')
  }

  videoResult() {
    return cy.get('.videos_subidos')
  }

  weighingSheetButton() {
    return cy.get('.btn_agregar_planilla')
  }

  weighingSheetInput() {
    return cy.get('#selPlanilla')
  }

  weighingSheetLink() {
    return cy.get("a[target='_blank'][href^='/documentos/?ver=1&arch=']")
  }

  // ── Métodos ──

  selectedSocietyName() {
    return this.societySelect().find('option:selected').invoke('text').then((text) => text.trim())
  }

  selectedEstablishmentName() {
    return this.establishmentSelect().find('option:selected').invoke('text').then((text) => text.trim())
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

  openNewEstablishment() {
    return this.establishmentMenu().select('crear').then(() => this.establishmentModal().should('be.visible'))
  }

  chooseRadio(id) {
    return cy.get(`label[for='${id}']`).click()
  }

  // Defaults of the original single case (Vaca gorda / Feedlot / Consumo); kept for the pending/admin flows.
  fillValidOffer(options = {}) {
    return this.fillOffer({
      cage: 'simple',
      category: 'Vaca gorda',
      termination: options.termination || 'feedlot',
      destination: options.destination || 'consumo',
      aptoChina: 'apto_china_no',
      breeds: ['Aberdeen Angus Negro'],
      weights: { min: '350', max: '500', avg: '425' },
      weighing: 'sin_encierre',
      freight: options.freight || 'a_retirar',
      salePeriod: '30',
      shrinkage: '0',
    })
  }

  // Fills the form from an offer profile (see faena_offer_data.js). `omit` lists required
  // keys to leave empty (TC-FAE-017). Optional keys left null/undefined are not touched.
  fillOffer(offer, { omit = [] } = {}) {
    const skip = (key) => omit.includes(key)
    if (!skip('society')) this.selectFirstAvailableSociety()
    if (!skip('society') && !skip('establishment')) this.selectFirstAvailableEstablishment()
    if (offer.cage && !skip('cage')) this.chooseRadio(offer.cage)
    if (offer.category && !skip('category')) this.categorySelect().select(offer.category)
    if (offer.termination && !skip('termination')) {
      this.chooseRadio(offer.termination)
      if (offer.daysOfConfinement) this.confinementDaysField().clear().type(offer.daysOfConfinement)
    }
    if (offer.destination && !skip('destination')) this.chooseRadio(offer.destination)
    if (offer.aptoChina) this.chooseRadio(offer.aptoChina)
    if (offer.breeds && !skip('breeds')) this.selectBreeds(offer.breeds)
    if (offer.weights && !skip('weight')) this.fillWeights(offer.weights)
    if (!skip('loadDate')) this.loadDateField().clear().type(this.futureDate(10))
    if (offer.comments) this.commentsField().type(offer.comments)
    if (offer.salePeriod) this.salePeriodField().clear().type(offer.salePeriod)
    if (offer.weighing) this.chooseRadio(offer.weighing)
    if (offer.shrinkage) this.shrinkageField().clear().type(offer.shrinkage)
    if (offer.freight) this.chooseRadio(offer.freight)
    return cy.wrap(offer)
  }

  futureDate(days) {
    const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    const pad = (value) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  }

  // The "Agregar otra raza" button only adds a row after the previous breed is chosen.
  selectBreeds(breeds) {
    breeds.forEach((breed, index) => {
      if (index > 0) this.addBreedButton().click()
      this.breedSelectAt(index).select(breed)
    })
  }

  fillWeights({ min, max, avg }) {
    if (min) this.minWeightField().clear().type(min)
    if (max) this.maxWeightField().clear().type(max)
    if (avg) this.averageWeightField().clear().type(avg)
  }

  // Yields the names/ids of the visible controls, to compare the form between categories.
  visibleControlNames() {
    return cy.get(VISIBLE_CONTROLS).then(($controls) =>
      [...$controls].map((control) => control.name || control.id || `for:${control.htmlFor}`))
  }

  assertVisibleRequiredMessageCount(count) {
    return cy.get('body').should(($body) => {
      expect($body.find('.alert_input_faltante:visible'), 'visible required messages').to.have.length(count)
    })
  }

  assertRequiredMessage(label) {
    return this.requiredMessages().contains(MESSAGES.required(label)).should('be.visible')
  }

  assertNoRequiredMessage(label) {
    return cy.get('body').should(($body) => {
      const visible = [...$body.find('.alert_input_faltante:visible')].map((node) => node.textContent.trim())
      expect(visible, `required messages (no "${label}")`).to.not.include(MESSAGES.required(label))
    })
  }

  selectedCategoryName() {
    return this.categorySelect().find('option:selected').invoke('text').then((text) => text.trim())
  }

  // Real choices only: the "Seleccionar" placeholder is left out.
  breedOptionNames() {
    return this.breedSelectAt(0).find('option').then(($options) =>
      [...$options].map((option) => option.textContent.trim()).filter((name) => name !== 'Seleccionar'))
  }

  // Keeps the chosen society/establishment names in aliases for the Admin legajo check.
  captureSelectedLocation() {
    this.selectedSocietyName().as('submittedSociety')
    this.selectedEstablishmentName().as('submittedEstablishment')
  }

  assertNoConfinementDays() {
    return cy.get('body').should(($body) => {
      expect($body.find("input[name='ng_dias_encierre']:visible"), 'confinement days field').to.have.length(0)
    })
  }

  assertOfferFormStillShown() {
    this.offerTitle().should('be.visible')
    return cy.get('body').should('not.contain.text', MESSAGES.confirmation)
  }

  attachVideo(file) {
    this.videoButton().click()
    return this.videoFileInput().selectFile(file, { force: true })
  }

  assertVideoRejected() {
    return cy.get('body', { timeout: VIDEO_RESULT_TIMEOUT }).should('contain.text', MESSAGES.videoRejected)
  }

  attachWeighingSheet(file) {
    return this.weighingSheetInput().selectFile({ ...file, contents: Cypress.Buffer.from(file.contents, file.encoding) }, { force: true })
  }

  assertWeighingSheetLinkOpensNewTab() {
    this.weighingSheetLink().should('have.length.at.least', 1)
    return this.weighingSheetLink().first().should('have.attr', 'target', '_blank')
  }

  // Pending-publication card in the React view; the id comes from the lot request.
  assertPendingOffer(lot, { category, weight }) {
    cy.origin(REACT_ORIGIN, { args: { lot: String(lot), category, weight } }, ({ lot, category, weight }) => {
      cy.get('a[href="/operacion/faena/venta/pendiente-publicacion"]', { timeout: 60000 })
        .filter(':visible').first().should('be.visible')
      cy.contains(`#${lot}`, { timeout: 60000 }).should('be.visible')
      cy.get('main').should('contain', category).and('contain', `${weight} Kg`)
    })
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
    return this.submitButton().click()
  }
}

export default new FaenaOfferPage()
