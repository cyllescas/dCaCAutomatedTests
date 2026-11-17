import { LEGAJO_TEXTS } from '../support/data/legajo_admin_data'

const LEGAJO_LOAD_TIMEOUT = 180000
const ROOT = '#agregarinvernada #a_new_form'

const normalize = (text) => String(text || '').replace(/\s+/g, ' ').trim()
// "Descarte :" and "Descarte:" are the same label; the trailing colon is optional.
const normalizeLabel = (text) => normalize(text).replace(/\s*:$/, '').toLowerCase()

// Value of a label: the text of the siblings that follow it up to the next label
// (a `span`, plus `span.aviso_col_2` for the unit). Undefined when the label is absent.
function readValue($root, label, position = 0) {
  const wanted = normalizeLabel(label)
  const labels = [...$root.find('label')].filter((element) => Cypress.$(element).is(':visible') && normalizeLabel(element.textContent) === wanted)
  const element = labels[position]
  if (!element) return readGroupTitleValue($root, wanted, position)
  const parts = []
  for (let sibling = element.nextElementSibling; sibling && sibling.tagName !== 'LABEL' && parts.length < 3; sibling = sibling.nextElementSibling) {
    parts.push(normalize(sibling.textContent))
  }
  return normalize(parts.join(' '))
}

// "Categoría:" and "Peso promedio:" are not `label`s: they are `div.group_title` ("Categoría:<span>Terneros</span>").
function readGroupTitleValue($root, wanted, position) {
  const titles = [...$root.find('.group_title')].filter((element) => Cypress.$(element).is(':visible')
    && !Cypress.$(element).find('.group_title').length
    && normalizeLabel(element.textContent).startsWith(`${wanted}`) && normalize(element.textContent).replace(/\s*:/, ':').toLowerCase().startsWith(`${wanted}:`))
  const element = titles[position]
  if (!element) return undefined
  return normalize(normalize(element.textContent).replace(/^[^:]*:/, ''))
}

// Diagnostic for a label that is not a visible `label`: shows the elements whose own text starts with it.
function describeCandidates($root, label) {
  const wanted = normalizeLabel(label)
  const found = [...$root.find('*')]
    .filter((element) => normalizeLabel(element.textContent).startsWith(wanted) && normalize(element.textContent).length < 80)
    .slice(-2)
    .map((element) => `<${element.tagName.toLowerCase()} class="${element.className}" visible=${Cypress.$(element).is(':visible')}> ${normalize(element.parentElement && element.parentElement.outerHTML).slice(0, 300)}`)
  return found.length ? `candidates: ${found.join(' | ')}` : 'no element starts with this text'
}

// Admin legajo of a tropa (`#agregarinvernada`). Read-only: never use Guardar, Publicar, Editar or Eliminar.
class AdminInvernadaLegajoPage {
  // ── Selectores ──

  root() {
    return cy.get(ROOT, { timeout: LEGAJO_LOAD_TIMEOUT })
  }

  businessId() {
    return cy.get(`${ROOT} .a_id_negocio`, { timeout: LEGAJO_LOAD_TIMEOUT })
  }

  suggestedQuantity() {
    return cy.get('#agregarinvernada #cant_sugerida')
  }

  society() {
    return cy.get('#agregarinvernada #sociedadNombre')
  }

  clarificationTitle() {
    return this.root().find('h4').filter((index, element) => normalize(element.textContent) === LEGAJO_TEXTS.CLARIFICATION_TITLE)
  }

  planSanitaryTick() {
    return this.root().find('img[src="/imagenes/tick.png"]')
  }

  multimediaTitle() {
    return cy.get('#multimedias_invernada .a_new_title_1 strong')
  }

  videoLoadedIndicator() {
    return cy.get('#multimedias_invernada b.video_cargado')
  }

  multimediaSection() {
    return cy.get('#multimedias_invernada #section_3')
  }

  multimediaItems() {
    return cy.get('#multimedias_invernada #section_3 .multimedia_invernada')
  }

  closeButton() {
    return cy.get('a[onclick="cerrarLote();location.reload();"]')
  }

  // ── Métodos ──

  // Waits until the legajo shown is the one of the tropa (OQ-065: opening it from the search must be verified).
  assertOpenedFor(tropaId) {
    return this.businessId().parent().should(($parent) => {
      expect(normalize($parent.text()), 'business id of the legajo').to.contain(String(tropaId))
    })
  }

  // Compares label/value pairs in ONE retried assertion and reports every mismatch.
  // entry: { label, position?, expected: string | { contains: string | string[] } }
  assertValues(entries) {
    // The legajo is already loaded: a short bound keeps a mismatch from waiting minutes.
    return cy.get(ROOT, { timeout: 30000, log: false }).should(($root) => {
      const mismatches = []
      entries.forEach(({ label, position = 0, expected }) => {
        const actual = readValue($root, label, position)
        const description = `${label}[${position}]`
        if (actual === undefined) return mismatches.push(`${description}: label not found. ${describeCandidates($root, label)}`)
        if (typeof expected === 'string') {
          if (actual !== normalize(expected)) mismatches.push(`${description}: expected "${expected}" but was "${actual}"`)
          return undefined
        }
        ;[].concat(expected.contains).forEach((part) => {
          if (!actual.toLowerCase().includes(normalize(part).toLowerCase())) mismatches.push(`${description}: expected to contain "${part}" but was "${actual}"`)
        })
        return undefined
      })
      expect(mismatches, 'legajo values').to.deep.eq([])
    })
  }

  // Segmentation: `.seg_tropa .col_3.<part>` holds a label ("Peso Kgs Aprox:" or "Cantidad:"),
  // a `span.aviso_col_2` with the part name and a plain `span` with the value.
  // entries: { part, label, expected }. Every pair is compared exactly.
  assertSegmentation(entries) {
    return cy.get(ROOT, { timeout: 30000, log: false }).should(($root) => {
      const mismatches = []
      entries.forEach(({ part, label, expected }) => {
        const block = [...$root.find(`.seg_tropa .col_3.${part}`)]
          .find((element) => normalizeLabel(Cypress.$(element).children('label').text()) === normalizeLabel(label))
        const actual = block ? normalize(Cypress.$(block).children('span:not(.aviso_col_2)').text()) : undefined
        if (actual !== String(expected)) mismatches.push(`${part} ${label} expected "${expected}" but was "${actual}"`)
      })
      expect(mismatches, 'legajo segmentation').to.deep.eq([])
    })
  }

  assertLabelsAbsent(labels) {
    return this.root().should(($root) => {
      const present = labels.filter((label) => readValue($root, label) !== undefined)
      expect(present, 'labels that do not belong to the category').to.deep.eq([])
    })
  }

  assertClarification(text) {
    // The text is a node of the block that holds the `h4` (`div.comentarios`), not a sibling element.
    return this.clarificationTitle().parent().should(($block) => {
      const shown = normalize($block.text()).replace(LEGAJO_TEXTS.CLARIFICATION_TITLE, '').trim()
      expect(shown, 'client clarification').to.eq(normalize(text))
    })
  }

  assertSuggestedQuantity(quantity) {
    return this.suggestedQuantity().should(($el) => expect(`${$el.val() || ''}${$el.text()}`.trim()).to.contain(String(quantity)))
  }

  assertSociety(name) {
    return this.society().should(($el) => {
      expect(normalize(`${$el.val() || ''} ${$el.text()}`).toLowerCase()).to.contain(normalize(name).toLowerCase())
    })
  }

  assertPlanSanitary() {
    return this.planSanitaryTick().should('exist')
  }

  assertNoMultimedia() {
    this.videoLoadedIndicator().should('not.exist')
    return this.multimediaItems().should('not.exist')
  }

  expandMultimedia() {
    this.multimediaTitle().click()
    return this.multimediaSection().should('be.visible')
  }

  // `video_cargado` "Si", then 1 video + 6 images, all "Oculto" (OQ-063).
  assertMultimedia({ videos, images }) {
    this.videoLoadedIndicator().should(($el) => expect(normalize($el.text())).to.eq(LEGAJO_TEXTS.MEDIA_VIDEO_LOADED))
    this.expandMultimedia()
    return this.multimediaItems().should(($items) => {
      const texts = [...$items].map((item) => normalize(item.textContent))
      const count = (type) => texts.filter((text) => new RegExp(`Tipo:\\s*${type}`, 'i').test(text)).length
      expect(count(LEGAJO_TEXTS.MEDIA_VIDEO_TYPE), 'video items').to.eq(videos)
      expect(count(LEGAJO_TEXTS.MEDIA_IMAGE_TYPE), 'image items').to.eq(images)
      expect(texts, 'all items hidden').to.have.length(videos + images)
      texts.forEach((text) => expect(text).to.contain(LEGAJO_TEXTS.MEDIA_HIDDEN))
    })
  }
}

export default new AdminInvernadaLegajoPage()
