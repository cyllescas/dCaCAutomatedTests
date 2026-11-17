import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import { credentialsFor, skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import { selectExistingInvernadaLocation, visitInvernadaOfferForm } from '../../support/helpers/invernada_offer_helper'
import { CATEGORIES, CATEGORY_FIELD_CASES, COMMON_FIELDS, FIELD_LABELS, SERVICE_TYPES, ZONES } from '../../support/data/invernada_offer_data'

const credentials = credentialsFor('TEST_CLIENT_USERNAME', 'TEST_CLIENT_PASSWORD')

// Read-only checks: one form load for the whole file. `resetCategory()` runs
// before each case so a field cannot look visible because of a previous case,
// and every conditional case first provokes the state it then reverses.
describe('Campos por categoría y condicionales de invernada legacy @invernada @ofrecimientos @legacy @regression', { testIsolation: false }, () => {
  before(function () {
    skipWhenCredentialsAreMissing(this, credentials, 'cliente')
    visitInvernadaOfferForm(credentials)
    selectExistingInvernadaLocation()
  })

  beforeEach(() => {
    InvernadaOfferPage.resetCategory()
  })

  context('TC-INV-026 campos por categoría', () => {
    CATEGORY_FIELD_CASES.forEach(({ caseNumber, category, fields, radios, labels = [], absentFields = [], absentRadios = [] }) => {
      it(`TC-INV-026 caso ${caseNumber}: campos de ${category}`, () => {
        InvernadaOfferPage.selectCategory(category)

        InvernadaOfferPage.assertFieldsVisible([...COMMON_FIELDS.fields, ...fields], category)
        InvernadaOfferPage.assertRadiosVisible([...COMMON_FIELDS.radios, ...radios], category)
        InvernadaOfferPage.assertVisibleLabels(labels, category)
        InvernadaOfferPage.assertFieldsHidden(absentFields, `${category} sin campo`)
        InvernadaOfferPage.assertRadiosHidden(absentRadios, `${category} sin opción`)
      })
    })
  })

  context('TC-INV-027 Destetados y Capados', () => {
    beforeEach(() => {
      InvernadaOfferPage.selectCategory(CATEGORIES.CALVES)
    })

    it('TC-INV-027 caso 53: Destetados Sí muestra la fecha de destete', () => {
      InvernadaOfferPage.clickRadio('destetados')

      InvernadaOfferPage.assertFieldsVisible(['in_fecha_destete'], 'Destetados Sí')
      InvernadaOfferPage.assertLabelsShown(FIELD_LABELS.WEANING_DATE, 'Destetados Sí')
    })

    it('TC-INV-027 caso 54: Destetados No oculta la fecha de destete', () => {
      InvernadaOfferPage.clickRadio('destetados')
      InvernadaOfferPage.assertFieldsVisible(['in_fecha_destete'], 'Destetados Sí')
      InvernadaOfferPage.clickRadio('no_destetados')

      InvernadaOfferPage.assertFieldsHidden(['in_fecha_destete'], 'Destetados No')
    })

    it('TC-INV-027 caso 55: Capados Sí muestra la fecha de capados', () => {
      InvernadaOfferPage.clickRadio('capados')

      InvernadaOfferPage.assertFieldsVisible(['in_fecha_capado'], 'Capados Sí')
      InvernadaOfferPage.assertLabelsShown(FIELD_LABELS.CASTRATION_DATE, 'Capados Sí')
    })

    it('TC-INV-027 caso 56: Capados No oculta la fecha de capados', () => {
      InvernadaOfferPage.clickRadio('capados')
      InvernadaOfferPage.assertFieldsVisible(['in_fecha_capado'], 'Capados Sí')
      InvernadaOfferPage.clickRadio('no_capados')

      InvernadaOfferPage.assertFieldsHidden(['in_fecha_capado'], 'Capados No')
    })
  })

  // Also covers TC-INV-006: Lucha and Sucia show Garrapata and Mio-Mio, Limpia hides them.
  it('TC-INV-028 caso 59: Lucha y Sucia muestran Garrapata y Mio-Mio y la zona Limpia los oculta', () => {
    InvernadaOfferPage.selectCategory(CATEGORIES.CALVES)
    InvernadaOfferPage.clickRadio('lucha')
    InvernadaOfferPage.assertLabelsShown(FIELD_LABELS.TICK_AND_MIOMIO, `Zona ${ZONES.LUCHA}`)
    InvernadaOfferPage.assertRadiosVisible(['si_garrapata', 'no_garrapata', 'si_miomio', 'no_miomio'], `Zona ${ZONES.LUCHA}`)
    InvernadaOfferPage.sanitaryZoneFields().should('have.length', 2)
    InvernadaOfferPage.clickRadio('sucia')
    InvernadaOfferPage.assertLabelsShown(FIELD_LABELS.TICK_AND_MIOMIO, `Zona ${ZONES.SUCIA}`)
    InvernadaOfferPage.assertRadiosVisible(['si_garrapata', 'no_garrapata', 'si_miomio', 'no_miomio'], `Zona ${ZONES.SUCIA}`)
    InvernadaOfferPage.sanitaryZoneFields().should('have.length', 2)
    InvernadaOfferPage.clickRadio('limpia')

    InvernadaOfferPage.assertRadiosHidden(['si_garrapata', 'no_garrapata', 'si_miomio', 'no_miomio'], `Zona ${ZONES.LIMPIA}`)
    InvernadaOfferPage.assertLabelsHidden(FIELD_LABELS.TICK_AND_MIOMIO, `Zona ${ZONES.LIMPIA}`)
  })

  context('TC-INV-029 tipo de servicio e inseminación', () => {
    beforeEach(() => {
      InvernadaOfferPage.selectCategory(CATEGORIES.PREGNANT_COWS)
    })

    it('TC-INV-029 caso 60: Inseminación muestra el tipo con A tiempo fijo marcado', () => {
      InvernadaOfferPage.clickRadio('inseminacion')

      InvernadaOfferPage.assertRadiosVisible(['fijo', 'deteccion'], 'Inseminación')
      InvernadaOfferPage.assertRadioChecked('fijo')
    })

    it('TC-INV-029 caso 61: A tiempo fijo muestra la fecha de inseminación', () => {
      InvernadaOfferPage.clickRadio('inseminacion')
      InvernadaOfferPage.clickRadio('fijo')

      InvernadaOfferPage.assertLabelsShown(FIELD_LABELS.INSEMINATION_DATE, 'A tiempo fijo')
      InvernadaOfferPage.assertVisibleIds(['fecha_servicio_input'], 'A tiempo fijo')
    })

    it('TC-INV-029 caso 62: Con detección muestra inicio y fin de inseminación', () => {
      InvernadaOfferPage.clickRadio('inseminacion')
      InvernadaOfferPage.clickRadio('deteccion')

      InvernadaOfferPage.assertLabelsShown(FIELD_LABELS.INSEMINATION_RANGE, 'Con detección')
    })

    it('TC-INV-029 caso 63: Servicio Natural muestra inicio, fin, raza y origen', () => {
      InvernadaOfferPage.serviceSection().should('be.visible')
      InvernadaOfferPage.clickRadio('natural')

      InvernadaOfferPage.assertLabelsShown(FIELD_LABELS.NATURAL_SERVICE, SERVICE_TYPES.NATURAL)
    })

    it('TC-INV-029 caso 64: Servicio Natural reetiqueta los controles de inseminación', () => {
      InvernadaOfferPage.clickRadio('inseminacion')
      InvernadaOfferPage.assertLabelsShown(FIELD_LABELS.INSEMINATION_BREED_AND_BULL, SERVICE_TYPES.INSEMINATION)
      InvernadaOfferPage.clickRadio('natural')

      InvernadaOfferPage.assertLabelsHidden(FIELD_LABELS.INSEMINATION_BREED_AND_BULL, SERVICE_TYPES.NATURAL)
      InvernadaOfferPage.assertFieldsVisible(['in_raza_servicio', 'in_toro'], 'controles reutilizados')
    })

    it('TC-INV-029 caso 65: Inseminación + repaso muestra los datos de inseminación y de repaso', () => {
      InvernadaOfferPage.clickRadio('mas_repaso')

      InvernadaOfferPage.assertLabelsShown(FIELD_LABELS.INSEMINATION_PLUS_REPASO, SERVICE_TYPES.INSEMINATION_PLUS_REPASO)
      InvernadaOfferPage.assertRadiosVisible(['fijo', 'deteccion'], SERVICE_TYPES.INSEMINATION_PLUS_REPASO)
      InvernadaOfferPage.assertFieldsVisible(
        ['in_raza_servicio', 'in_toro', 'in_inicio_repaso', 'in_fin_repaso', 'in_toro_raza_repaso', 'in_toro_origen_repaso'],
        SERVICE_TYPES.INSEMINATION_PLUS_REPASO,
      )
    })

    it('TC-INV-029 caso 66: Con detección en repaso muestra inicio y fin de inseminación', () => {
      InvernadaOfferPage.clickRadio('mas_repaso')
      InvernadaOfferPage.clickRadio('deteccion')

      InvernadaOfferPage.assertLabelsShown(FIELD_LABELS.INSEMINATION_RANGE, 'Con detección en repaso')
    })
  })

  it('TC-INV-031 caso 68: elegir Sí en plan sanitario no muestra campos nuevos', () => {
    InvernadaOfferPage.selectCategory(CATEGORIES.CALVES)
    InvernadaOfferPage.visibleControlCount().then((controlsBefore) => {
      InvernadaOfferPage.clickRadio('si_plan')

      InvernadaOfferPage.assertVisibleControlCount(controlsBefore)
    })
  })
})
