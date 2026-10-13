import { BASE_OFFER, COMMON_DETAILS } from '../support/data/invernada_offer_data'
import { waitForPartialLot } from '../support/helpers/invernada_trace_helper'

const OPTIONS_LOAD_TIMEOUT = 60000
const CATEGORY_PLACEHOLDER = 'Seleccionar'
const VIDEO_RESULT_TIMEOUT = 90000
// The CUIT rejection has no visible signal (OQ-048), so the negative checks
// give the API this long to answer before asserting nothing happened.
const REJECTION_SETTLE_MS = 3000
const VISIBLE_CONTROLS = 'input:visible, select:visible, textarea:visible, label:visible'

const normalize = (text) => String(text).replace(/\s+/g, ' ').trim().toLowerCase()

// Options that carry a real choice (no empty value, "0" or "Seleccionar ..." placeholder).
const selectableOptions = ($select) => [...$select.find('option')]
  .filter((option) => option.value && option.value !== '0' && option.textContent.trim() && !/^seleccionar/i.test(option.textContent.trim()))
  .map((option) => ({ value: option.value, text: option.textContent.trim() }))

const selectableTexts = ($select) => selectableOptions($select).map((option) => option.text)

function formatToday() {
  const date = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

class InvernadaOfferPage {
  societySelect(options) {
    return cy.get('#sociedad_select', options)
  }

  establishmentSelect(options) {
    return cy.get('#estab_soc', options)
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

  // Clears the dynamic fields left by a previous category, so label checks
  // cannot pass on stale content when the page is reused between cases.
  resetCategory() {
    return this.categorySelect().select(CATEGORY_PLACEHOLDER)
  }

  selectCategory(label) {
    this.categorySelect().select(label)
    return this.categorySelect().find('option:selected').should('have.text', label)
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

    return this.selectFirstLoadedOption(this.societySelect({ timeout: OPTIONS_LOAD_TIMEOUT }), 'available invernada society')
  }

  // The options load asynchronously; retry until one besides "crear" is present.
  selectFirstLoadedOption(select, description) {
    let value
    return select
      .should(($select) => {
        const option = [...$select.find('option')].find((item) => item.value && item.value !== '0' && item.value !== 'crear')
        expect(option, description).to.exist
        value = option.value
      })
      .then(($select) => cy.wrap($select).select(value))
  }

  selectFirstAvailableEstablishment() {
    const configured = Cypress.env('INVERNADA_ESTABLISHMENT_VALUE')
    if (configured) return this.establishmentSelect().select(configured)

    return this.selectFirstLoadedOption(
      this.establishmentSelect({ timeout: OPTIONS_LOAD_TIMEOUT }).should('be.visible'),
      'available invernada establishment',
    )
  }

  societyModal() {
    return cy.get('#modal_crear')
  }

  establishmentModal() {
    return cy.get('#modal-establecimiento-edit')
  }

  openNewSociety() {
    // The options load asynchronously; "crear" is not selectable before that.
    this.waitForSocietyOptions()
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
    // Assert the typed value so a truncated name fails here, not after saving.
    this.societyModal().find('#razonsocial').clear().type(name).should('have.value', name)
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

  // ---- Society and establishment forms (TC-INV-012 to TC-INV-016) ----------

  fillSocietyForm(name, cuit) {
    this.openNewSociety()
    this.societyModal().find('#razonsocial').clear().type(name)
    this.societyModal().find('#cuit').clear().type(cuit)
  }

  // CUIT with the check digit deliberately wrong (11 digits, same prefix).
  invalidRuntimeCuit(seed) {
    const valid = this.validRuntimeCuit(seed)
    const wrongCheck = (Number(valid.slice(-1)) + 1) % 10
    return `${valid.slice(0, -1)}${wrongCheck}`
  }

  clickSaveSociety() {
    return this.societyModal().find('#aceptar').click()
  }

  closeSocietyModal() {
    return this.societyModal().find('#cerrar').click()
  }

  closeEstablishmentModal() {
    return this.establishmentModal().find('#cerrar').click()
  }

  assertSocietyModalClosed() {
    return cy.get('body').should(($body) => {
      expect($body.find('#modal_crear:visible'), 'society modal').to.have.length(0)
    })
  }

  assertEstablishmentModalClosed() {
    return cy.get('body').should(($body) => {
      expect($body.find('#modal-establecimiento-edit:visible'), 'establishment modal').to.have.length(0)
    })
  }

  confirmSocietySuggestion() {
    return cy.get('#modal_sugerir', { timeout: 60000 }).should('be.visible').find('#aceptarSug').click()
  }

  // Society rejected (invalid CUIT): the modal stays open, no confirmation
  // appears and the society is not added. The missing error message is NOT
  // asserted (OQ-048): it is a reported defect, not an expectation.
  assertSocietyRejected(name) {
    cy.wait(REJECTION_SETTLE_MS) // no visible signal exists; wait for the API answer before asserting absence
    this.societyModal().should('be.visible')
    cy.get('body').should(($body) => {
      expect($body.find('#modal_sugerir:visible'), 'society confirmation dialog').to.have.length(0)
    })
    this.assertOptionAbsent(this.societySelect(), name)
  }

  assertOptionAbsent(select, name) {
    return select.should(($select) => {
      const found = [...$select.find('option')].some((option) => normalize(option.textContent).includes(normalize(name)))
      expect(found, `option "${name}" in dropdown`).to.eq(false)
    })
  }

  optionCount(select) {
    return select.then(($select) => $select.find('option').length)
  }

  assertSelectedOptionContains(select, text) {
    return select.should(($select) => {
      expect(normalize($select.find('option:selected').text())).to.contain(normalize(text))
    })
  }

  assertOptionTexts(select, expected) {
    return select.should(($select) => {
      expect([...$select.find('option')].map((option) => normalize(option.textContent))).to.deep.eq(expected.map(normalize))
    })
  }

  waitForSocietyOptions() {
    return this.societySelect({ timeout: OPTIONS_LOAD_TIMEOUT }).should(($select) => {
      const loaded = [...$select.find('option')].filter((option) => option.value && option.value !== '0' && option.value !== 'crear')
      expect(loaded.length, 'loaded societies').to.be.greaterThan(0)
    })
  }

  waitForEstablishmentOptions() {
    return this.establishmentSelect({ timeout: OPTIONS_LOAD_TIMEOUT }).should(($select) => {
      const loaded = [...$select.find('option')].filter((option) => option.value && option.value !== '0' && option.value !== 'crear')
      expect(loaded.length, 'loaded establishments').to.be.greaterThan(0)
    })
  }

  // Fills the new establishment modal choosing the first province and party.
  // Returns the chosen texts; read them after the queued commands have run.
  fillEstablishmentForm(name) {
    const chosen = {}
    this.openNewEstablishment()
    this.establishmentModal().find('#Nombre').clear().type(name)
    this.establishmentModal().find('#Provincias').filter(':visible')
      .should(($select) => expect(selectableOptions($select).length, 'provinces').to.be.greaterThan(0))
      .then(($select) => {
        const option = selectableOptions($select)[0]
        chosen.province = option.text
        cy.wrap($select).select(option.value)
      })
    this.establishmentModal().find('#Partido').filter(':visible')
      .should('not.be.disabled')
      .should(($select) => expect(selectableOptions($select).length, 'parties').to.be.greaterThan(0))
      .then(($select) => {
        const option = selectableOptions($select)[0]
        chosen.party = option.text
        cy.wrap($select).select(option.value)
      })
    return chosen
  }

  clickSaveEstablishment() {
    return this.establishmentModal().find('.btn_guardar_est').click()
  }

  assertLocationAutofilled() {
    cy.get('#_provincia').should(($el) => expect($el.text().trim(), 'province text').to.not.be.empty)
    cy.get('#_partido').should(($el) => expect($el.text().trim(), 'party text').to.not.be.empty)
    cy.get('#provincia_input').should('not.have.value', '')
    cy.get('#partido_input').should('not.have.value', '')
  }

  assertLocationShows(location) {
    cy.get('#_provincia').should(($el) => expect(normalize($el.text())).to.contain(normalize(location.province)))
    cy.get('#_partido').should(($el) => expect(normalize($el.text())).to.contain(normalize(location.party)))
  }

  selectedSocietyText() {
    return this.societySelect().then(($select) => $select.find('option:selected').text().trim())
  }

  // ---- Radios, labels and option lists (TC-INV-020 to TC-INV-031) ----------

  radioLabel(id) {
    return cy.get(`label[for="${id}"]`).filter(':visible')
  }

  radioInput(id) {
    return cy.get(`input[id="${id}"]`)
  }

  clickRadio(id) {
    return this.radioLabel(id).click()
  }

  assertRadiosVisible(ids, description) {
    ids.forEach((id) => this.radioLabel(id).should('have.length.greaterThan', 0, `${description}: radio ${id}`))
  }

  assertRadiosHidden(ids, description) {
    ids.forEach((id) => {
      cy.get('body').should(($body) => {
        expect($body.find(`label[for="${id}"]:visible`), `${description}: radio ${id}`).to.have.length(0)
      })
    })
  }

  assertRadioTexts(texts) {
    Object.entries(texts).forEach(([id, text]) => {
      this.radioLabel(id).should(($label) => expect(normalize($label.text()), `radio ${id}`).to.eq(normalize(text)))
    })
  }

  assertRadioChecked(id) {
    return this.radioInput(id).should('be.checked')
  }

  assertFieldsVisible(names, description) {
    names.forEach((name) => this.visibleField(name).should('have.length.greaterThan', 0, `${description}: ${name}`))
  }

  assertFieldsHidden(names, description) {
    names.forEach((name) => {
      cy.get('body').should(($body) => {
        expect($body.find(`[name="${name}"]:visible`), `${description}: ${name}`).to.have.length(0)
      })
    })
  }

  assertVisibleIds(ids, description) {
    ids.forEach((id) => cy.get(`[id="${id}"]`).filter(':visible').should('have.length.greaterThan', 0, `${description}: #${id}`))
  }

  labelsMatching(text) {
    return cy.get('.label_form_rapido, label').filter(':visible')
      .filter((index, element) => normalize(element.textContent).includes(normalize(text)))
  }

  assertLabelsShown(labels, description) {
    labels.forEach((label) => this.labelsMatching(label).should('have.length.greaterThan', 0, `${description}: ${label}`))
  }

  assertLabelsHidden(labels, description) {
    labels.forEach((label) => {
      cy.get('body').should(($body) => {
        const visible = [...$body.find('.label_form_rapido:visible, label:visible')]
          .filter((element) => normalize(element.textContent).includes(normalize(label)))
        expect(visible, `${description}: ${label}`).to.have.length(0)
      })
    })
  }

  assertSelectOptions(name, expected) {
    return this.visibleField(name).should(($select) => {
      expect(selectableTexts($select), `options of ${name}`).to.deep.eq(expected)
    })
  }

  assertCategoryOptions(expected) {
    return this.categorySelect().should(($select) => {
      expect(selectableTexts($select), 'category options').to.have.members(expected)
      expect(selectableTexts($select)).to.have.length(expected.length)
    })
  }

  // Compares the real choices of `name` with those of `reference`; `name` may
  // carry an extra empty first option (`0=`).
  assertSameBreedsAs(name, reference) {
    return this.visibleField(reference).then(($reference) => {
      const expected = selectableTexts($reference)
      expect(expected.length, `options of ${reference}`).to.be.greaterThan(0)
      return this.visibleField(name).should(($select) => {
        expect(selectableTexts($select), `options of ${name}`).to.deep.eq(expected)
        expect($select.find('option').first().text().trim(), `first option of ${name}`).to.eq('')
      })
    })
  }

  // Counts what the user can see/operate, to prove a click added nothing.
  visibleControlCount() {
    return cy.get(VISIBLE_CONTROLS).then(($elements) => $elements.length)
  }

  assertVisibleControlCount(expected) {
    return cy.get(VISIBLE_CONTROLS).should(($elements) => {
      expect($elements.length, 'visible controls').to.eq(expected)
    })
  }

  breedButton() {
    return cy.get('.btn_agregar_listado.agr_raza').filter(':visible')
  }

  clickAddBreed() {
    return this.breedButton().first().click()
  }

  selectNthOption(name, position) {
    return this.visibleField(name)
      .should(($select) => expect(selectableOptions($select).length, `options of ${name}`).to.be.greaterThan(position))
      .then(($select) => {
        const option = selectableOptions($select)[position]
        return cy.wrap($select).select(option.value).then(() => option.text)
      })
  }

  // ---- Common fields (TC-INV-019, 021) -------------------------------------

  typeQuantity(value) {
    return this.visibleField('re_cantidad').clear().type(value)
  }

  typeAverageWeight(value) {
    return this.visibleField('re_peso').clear().type(value)
  }

  // ---- Offer filling and submission (TC-INV-018, 032, 033) -----------------

  // Sets today's date; the widgets may be read-only pickers, so the value is set and the page notified.
  setDate(target) {
    const selector = target.id ? `#${target.id}` : `[name="${target.name}"]`
    const today = formatToday()
    return cy.get(selector).filter(':visible').invoke('val', today).trigger('input').trigger('change').should('have.value', today)
  }

  // Quality, health, uniformity and remarks. Not every category shows quality or
  // health (MEJ shows neither), so each one is filled only where the form offers it.
  fillCommonDetails() {
    this.visibleField('in_estado_corporal').select(COMMON_DETAILS.bodyCondition)
    cy.get('body').then(($body) => {
      if ($body.find('[name="in_calidad"]:visible').length) this.visibleField('in_calidad').select(COMMON_DETAILS.quality)
      COMMON_DETAILS.radios.forEach((id) => {
        if ($body.find(`label[for="${id}"]:visible`).length) this.clickRadio(id)
      })
    })
    this.visibleField('re_aclaracion_cliente').clear().type(COMMON_DETAILS.clarification)
  }

  // Fills the whole form for a profile. The returned object is filled while
  // the commands run: read it inside cy.then() after calling this method.
  fillOffer(profile, { skipQuantity = false } = {}) {
    const chosen = { breeds: [], category: profile.category }

    this.selectCategory(profile.category)
    if (!skipQuantity) this.typeQuantity(BASE_OFFER.quantity)
    this.typeAverageWeight(BASE_OFFER.weight)
    Object.entries(BASE_OFFER.segmentation).forEach(([name, value]) => this.visibleField(name).clear().type(value))

    this.selectNthOption('re_raza', 0).then((text) => chosen.breeds.push(text))
    for (let index = 1; index < profile.breeds; index += 1) {
      this.clickAddBreed()
      this.selectNthOption(`re_raza${index + 1}`, index).then((text) => chosen.breeds.push(text))
    }
    this.selectFirstOption('in_plazo_select')

    Object.entries(profile.texts || {}).forEach(([name, value]) => this.visibleField(name).clear().type(value))
    Object.entries(profile.selects || {}).forEach(([name, text]) => this.visibleField(name).select(text))
    const radios = profile.radios || []
    const dates = profile.dates || []
    radios.forEach((id) => this.clickRadio(id))
    dates.forEach(({ target }) => this.setDate(target))
    this.fillCommonDetails()
    return chosen
  }

  submitOffer() {
    return cy.get('.btn_ofrecer.env').click()
  }

  assertQuantityRequired() {
    return cy.get('.alert_input_faltante.required-re_cantidad').should('be.visible').and('contain.text', 'Debe completar el campo Cantidad')
  }

  // The form stays on screen and no confirmation view replaces it.
  assertOfferFormStillShown() {
    this.categorySelect().should('be.visible')
    return cy.get('body').should(($body) => {
      expect($body.find('.titulo_tropa_cargada:visible'), 'confirmation title').to.have.length(0)
    })
  }

  // ---- Video (TC-INV-017) --------------------------------------------------

  videoButton() {
    return cy.get('.btn_subir_video')
  }

  videoResult() {
    return cy.get('#seccion_archivos', { timeout: VIDEO_RESULT_TIMEOUT })
  }

  // Real flow: the button creates the partial lot first (POST ?parcial=true) and
  // only then the file can be attached; attaching earlier uploads to lote=undefined.
  // `waitForLot: false` is for a replacement, where the partial lot is reused.
  attachVideo(file, { waitForLot = true } = {}) {
    // In-memory files ({ contents, fileName }) have no path to check.
    if (typeof file === 'string') {
      cy.task('fileExists', file).then((exists) => {
        expect(exists, `video fixture not found: ${file}`).to.be.true
      })
    }
    this.videoButton().click()
    if (waitForLot) waitForPartialLot()
    return cy.get('#Filedata').selectFile(file, { force: true })
  }

  assertVideoAccepted() {
    this.videoResult().should('contain.text', 'Video cargado correctamente')
    return this.videoResult().find('a').should('contain.text', 'Eliminar video cargado')
  }

  assertVideoRejected() {
    this.videoResult().should('contain.text', 'compruebe que el formato sea el correcto')
    return this.videoResult().find('a').should('not.exist')
  }

  assertNoVideoLoaded() {
    return this.videoResult().should('contain.text', 'Aún no se han cargado archivos')
  }

  // "Eliminar video cargado" raises a native confirm; returns the captured texts.
  deleteLoadedVideo() {
    const dialogs = []
    cy.on('window:confirm', (text) => {
      dialogs.push(text)
      return true
    })
    this.videoResult().find('a').contains('Eliminar video cargado').click()
    return dialogs
  }

  submitEmptyOffer() {
    return cy.get('.btn_ofrecer.env').click()
  }

  visibleValidationMessages() {
    return cy.get('body').invoke('text').should('match', /Debe completar el campo (Cantidad|Raza|Plazo de venta)/)
  }
}

export default new InvernadaOfferPage()
