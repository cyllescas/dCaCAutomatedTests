import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import { credentialsFor, skipWhenCredentialsAreMissing } from '../../support/helpers/login_helper'
import { selectExistingInvernadaLocation, visitInvernadaOfferForm } from '../../support/helpers/invernada_offer_helper'
import { CATEGORY_FIELD_CASES, COMMON_FIELDS } from '../../support/data/invernada_offer_data'

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
    CATEGORY_FIELD_CASES.forEach(({ caseNumber, category, fields, radios, absentFields = [], absentRadios = [] }) => {
      it(`TC-INV-026 caso ${caseNumber}: campos de ${category}`, () => {
        InvernadaOfferPage.selectCategory(category)

        InvernadaOfferPage.assertFieldsVisible([...COMMON_FIELDS.fields, ...fields], category)
        InvernadaOfferPage.assertRadiosVisible([...COMMON_FIELDS.radios, ...radios], category)
        InvernadaOfferPage.assertFieldsHidden(absentFields, `${category} sin campo`)
        InvernadaOfferPage.assertRadiosHidden(absentRadios, `${category} sin opción`)
      })
    })
  })

  context('TC-INV-027 Destetados y Capados', () => {
    beforeEach(() => {
      InvernadaOfferPage.selectCategory('Terneros')
    })

    it('TC-INV-027 caso 53: Destetados Sí muestra la fecha de destete', () => {
      InvernadaOfferPage.clickRadio('destetados')

      InvernadaOfferPage.assertFieldsVisible(['in_fecha_destete'], 'Destetados Sí')
      InvernadaOfferPage.assertLabelsShown(['Fecha de destete'], 'Destetados Sí')
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
      InvernadaOfferPage.assertLabelsShown(['Fecha de capados'], 'Capados Sí')
    })

    it('TC-INV-027 caso 56: Capados No oculta la fecha de capados', () => {
      InvernadaOfferPage.clickRadio('capados')
      InvernadaOfferPage.assertFieldsVisible(['in_fecha_capado'], 'Capados Sí')
      InvernadaOfferPage.clickRadio('no_capados')

      InvernadaOfferPage.assertFieldsHidden(['in_fecha_capado'], 'Capados No')
    })
  })

  it('TC-INV-028 caso 59: la zona Limpia oculta Garrapata y Mio-Mio', () => {
    InvernadaOfferPage.selectCategory('Terneros')
    InvernadaOfferPage.clickRadio('lucha')
    InvernadaOfferPage.assertLabelsShown(['Garrapata', 'Mio-Mio'], 'Zona Lucha')
    InvernadaOfferPage.assertRadiosVisible(['si_garrapata', 'no_garrapata', 'si_miomio', 'no_miomio'], 'Zona Lucha')
    InvernadaOfferPage.clickRadio('limpia')

    InvernadaOfferPage.assertRadiosHidden(['si_garrapata', 'no_garrapata', 'si_miomio', 'no_miomio'], 'Zona Limpia')
    InvernadaOfferPage.assertLabelsHidden(['Garrapata', 'Mio-Mio'], 'Zona Limpia')
  })

  context('TC-INV-029 tipo de servicio e inseminación', () => {
    beforeEach(() => {
      InvernadaOfferPage.selectCategory('Vacas preñadas')
    })

    it('TC-INV-029 caso 60: Inseminación muestra el tipo con A tiempo fijo marcado', () => {
      InvernadaOfferPage.clickRadio('inseminacion')

      InvernadaOfferPage.assertRadiosVisible(['fijo', 'deteccion'], 'Inseminación')
      InvernadaOfferPage.assertRadioChecked('fijo')
    })

    it('TC-INV-029 caso 61: A tiempo fijo muestra la fecha de inseminación', () => {
      InvernadaOfferPage.clickRadio('inseminacion')
      InvernadaOfferPage.clickRadio('fijo')

      InvernadaOfferPage.assertLabelsShown(['Fecha de Inseminación'], 'A tiempo fijo')
      InvernadaOfferPage.assertVisibleIds(['fecha_servicio_input'], 'A tiempo fijo')
    })

    it('TC-INV-029 caso 62: Con detección muestra inicio y fin de inseminación', () => {
      InvernadaOfferPage.clickRadio('inseminacion')
      InvernadaOfferPage.clickRadio('deteccion')

      InvernadaOfferPage.assertLabelsShown(['Inicio de inseminación', 'Fin de inseminación'], 'Con detección')
    })

    it('TC-INV-029 caso 63: Servicio Natural muestra inicio, fin, raza y origen', () => {
      InvernadaOfferPage.clickRadio('natural')

      InvernadaOfferPage.assertLabelsShown(['Inicio del servicio', 'Fin del servicio', 'Raza de servicio', 'Origen de los toros'], 'Servicio Natural')
    })

    it('TC-INV-029 caso 64: Servicio Natural reetiqueta los controles de inseminación', () => {
      InvernadaOfferPage.clickRadio('inseminacion')
      InvernadaOfferPage.assertLabelsShown(['Raza de inseminación', 'Toro de inseminación'], 'Inseminación')
      InvernadaOfferPage.clickRadio('natural')

      InvernadaOfferPage.assertLabelsHidden(['Raza de inseminación', 'Toro de inseminación'], 'Servicio Natural')
      InvernadaOfferPage.assertFieldsVisible(['in_raza_servicio', 'in_toro'], 'controles reutilizados')
    })

    it('TC-INV-029 caso 65: Inseminación + repaso muestra los datos de inseminación y de repaso', () => {
      InvernadaOfferPage.clickRadio('mas_repaso')

      InvernadaOfferPage.assertLabelsShown(
        ['Raza de inseminación', 'Toro de inseminación', 'Inicio del repaso', 'Fin del repaso', 'Raza de servicio', 'Origen de los toros'],
        'Inseminación + repaso',
      )
      InvernadaOfferPage.assertRadiosVisible(['fijo', 'deteccion'], 'Inseminación + repaso')
      InvernadaOfferPage.assertFieldsVisible(
        ['in_raza_servicio', 'in_toro', 'in_inicio_repaso', 'in_fin_repaso', 'in_toro_raza_repaso', 'in_toro_origen_repaso'],
        'Inseminación + repaso',
      )
    })

    it('TC-INV-029 caso 66: Con detección en repaso muestra inicio y fin de inseminación', () => {
      InvernadaOfferPage.clickRadio('mas_repaso')
      InvernadaOfferPage.clickRadio('deteccion')

      InvernadaOfferPage.assertLabelsShown(['Inicio de inseminación', 'Fin de inseminación'], 'Con detección en repaso')
    })
  })

  it('TC-INV-031 caso 68: elegir Sí en plan sanitario no muestra campos nuevos', () => {
    InvernadaOfferPage.selectCategory('Terneros')
    InvernadaOfferPage.visibleControlCount().then((controlsBefore) => {
      InvernadaOfferPage.clickRadio('si_plan')

      InvernadaOfferPage.assertVisibleControlCount(controlsBefore)
    })
  })
})
