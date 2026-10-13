// The 17 categories of the offer form, in the order the form lists them.
export const CATEGORIES = {
  CALVES: 'Terneros',
  HEIFER_CALVES: 'Terneras',
  CALVES_AND_HEIFER_CALVES: 'Terneros y Terneras',
  YOUNG_STEERS: 'Novillitos',
  HEIFERS: 'Vaquillonas',
  STEERS_AND_HEIFERS: 'Novillitos y Vaquillonas',
  STEERS: 'Novillos',
  INVERNADA_COWS: 'Vacas de invernada',
  COWS_WITH_CALF: 'Vacas con cría',
  MEJ: 'MEJ',
  CUT_COWS_WITH_CALF: 'Vacas CUT con cría',
  CUT_PREGNANT_COWS: 'Vacas CUT preñadas',
  PREGNANT_COWS: 'Vacas preñadas',
  HEIFERS_WITH_CALF: 'Vaquillonas con cría',
  PREGNANT_HEIFERS: 'Vaquillonas preñadas',
  HEIFERS_FOR_BREEDING: 'Vaquillonas para madre',
  BULLS: 'Toros',
}

export const SERVICE_TYPES = {
  INSEMINATION: 'Inseminación',
  NATURAL: 'Servicio Natural',
  INSEMINATION_PLUS_REPASO: 'Inseminación + repaso',
}

export const ZONES = {
  LIMPIA: 'Limpia',
  LUCHA: 'Lucha',
  SUCIA: 'Sucia',
}

export const FIELD_LABELS = {
  BULLS_ORIGIN: 'Origen de los toros',
  AGE_AND_AVERAGE_WEIGHT: ['Edad', 'Peso promedio'],
  SERVICE_TYPE: ['Tipo de Servicio'],
  DEFINED: ['Definidas'],
  BULLS_FOR_HEIFERS: 'Apto para Vaquillonas',
  WEANING_DATE: ['Fecha de destete'],
  CASTRATION_DATE: ['Fecha de capados'],
  TICK_AND_MIOMIO: ['Garrapata', 'Mio-Mio'],
  INSEMINATION_DATE: ['Fecha de Inseminación'],
  INSEMINATION_RANGE: ['Inicio de inseminación', 'Fin de inseminación'],
  INSEMINATION_BREED_AND_BULL: ['Raza de inseminación', 'Toro de inseminación'],
  SERVICE_BREED: ['Raza de servicio'],
  INSEMINATION_PLUS_REPASO: ['Raza de inseminación', 'Toro de inseminación', 'Inicio del repaso', 'Fin del repaso', 'Raza de servicio', 'Origen de los toros'],
  GENDER_SPLIT: ['Machos', 'Hembras'],
  NATURAL_SERVICE: ['Inicio del servicio', 'Fin del servicio', 'Raza de servicio', 'Origen de los toros'],
}

// ---------------------------------------------------------------------------
// TC-INV-017: video fixtures. The files are local and not versioned; the cases
// fail when a file is missing (no skip), so CI must provide them.
// ---------------------------------------------------------------------------
export const VIDEO_FILES = {
  valid: () => Cypress.env('INVERNADA_VIDEO_PATH') || 'cypress/fixtures/video_ofrecimiento.mp4',
  short: () => 'cypress/fixtures/video_ofrecimiento_corto.mp4',
  rejected: () => Cypress.env('INVERNADA_VIDEO_SHORT_PATH') || 'cypress/fixtures/video_ofrecimiento_4seg.mp4',
}

export const LOCATION_LABELS = {
  SOCIETY_PLACEHOLDER: 'Seleccionar una sociedad',
  ESTABLISHMENT_PLACEHOLDER: 'Seleccionar un establecimiento',
  NEW_ESTABLISHMENT: '+ Nuevo Establecimiento',
}

export const VIDEO_MESSAGES = {
  success: 'Video cargado correctamente',
  failure: 'compruebe que el formato sea el correcto',
  empty: 'Aún no se han cargado archivos',
  deleteConfirm: '¿Desea borrar el archivo?',
}

// ---------------------------------------------------------------------------
// TC-INV-020 / TC-INV-024 / TC-INV-025: observed option lists.
// ---------------------------------------------------------------------------
// Radios are hidden inputs; the visible control is `label[for=<id>]`.
export const OPTION_CASES = [
  { caseNumber: 24, title: 'Marca Líquida', category: CATEGORIES.CALVES, radios: { si_marca: 'Sí', no_marca: 'No' } },
  { caseNumber: 25, title: 'Calidad', category: CATEGORIES.CALVES, select: 'in_calidad', options: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'] },
  { caseNumber: 26, title: 'Estado Corporal', category: CATEGORIES.CALVES, select: 'in_estado_corporal', options: ['2', '2.5', '3', '3.5', '4', '4.5', '5'] },
  {
    caseNumber: 27,
    title: 'Tratamiento Nutricional',
    category: CATEGORIES.CALVES,
    select: 'in_tratamiento_nutricional',
    options: ['Campo Natural', 'Racionados', 'A Corral', 'Praderas y/o Verdeos', 'Otro'],
  },
  { caseNumber: 28, title: 'Zona', category: CATEGORIES.CALVES, radios: { limpia: 'Limpia', lucha: 'Lucha', sucia: 'Sucia' } },
  {
    caseNumber: 29,
    title: 'Dentición',
    category: CATEGORIES.INVERNADA_COWS,
    select: 'in_denticion',
    options: [
      'Diente de leche', '2 Dientes', '4 Dientes', '6 Dientes', 'Boca Llena', '1/2 Diente Arriba', '1/2 Diente',
      '1/2 Diente Abajo', 'Liso', '(Aclarar en los comentarios)',
    ],
  },
  {
    caseNumber: 30,
    title: 'Tipo de Rodeo',
    category: CATEGORIES.INVERNADA_COWS,
    select: 'in_tipo_rodeo',
    options: ['Rodeo General', 'Puro controlado', 'Puro Pedigree', 'Angus MAS'],
  },
  { caseNumber: 31, title: 'Uniformidad de la cría', category: CATEGORIES.COWS_WITH_CALF, radios: { parejo_cria: 'Parejo', desparejo_cria: 'Desparejo' } },
  {
    caseNumber: 32,
    title: 'Tipo de servicio',
    category: CATEGORIES.PREGNANT_COWS,
    radios: { inseminacion: 'Inseminación', natural: 'Servicio Natural', mas_repaso: 'Inseminación + repaso' },
  },
  {
    caseNumber: 33,
    title: 'Inseminación',
    category: CATEGORIES.PREGNANT_COWS,
    serviceRadio: 'inseminacion',
    radios: { fijo: 'A tiempo fijo', deteccion: 'Con detección' },
  },
]

// ---------------------------------------------------------------------------
// TC-INV-026: fields observed per category. `common` applies to every category.
// `fields` are [name] attributes; `radios` are ids of hidden radio inputs
// (assert `label[for=<id>]`). `labels` are visible texts (TC-INV-003/004/005). Units (Meses/Años) have no observed selector and
// are not asserted.
// ---------------------------------------------------------------------------
export const COMMON_FIELDS = {
  fields: ['in_estado_corporal', 'in_descarte', 're_aclaracion_cliente'],
  radios: ['parejo', 'desparejo'],
}

const WEIGHING = ['in_desbaste', 'in_distancia_pesada']
const YOUNG_STOCK = {
  fields: ['in_edad', 'in_calidad', 'in_tratamiento_nutricional', ...WEIGHING],
  radios: ['si_marca', 'limpia', 'si_plan', 'muy_buena', 'sociedad'],
}
const WITH_CALF = {
  fields: ['in_tipo_rodeo', 'in_edad', 'in_denticion', 'in_calidad', 'in_tratamiento_nutricional', 'in_edad_cria', 'in_peso_promedio_cria'],
  radios: ['si_marca', 'limpia', 'parejo_cria', 'muy_buena'],
}
const PREGNANT = {
  fields: ['in_tipo_rodeo', 'in_edad', 'in_tratamiento_nutricional', 'in_calidad', 'in_raza_servicio', 'in_toro'],
  radios: ['si_marca', 'limpia', 'inseminacion', 'muy_buena'],
}
const withExtra = (base, extra = {}) => ({
  fields: [...base.fields, ...(extra.fields || [])],
  radios: [...base.radios, ...(extra.radios || [])],
})

export const CATEGORY_FIELD_CASES = [
  { caseNumber: 36, category: CATEGORIES.CALVES, ...withExtra(YOUNG_STOCK, { radios: ['destetados', 'capados'] }) },
  { caseNumber: 37, category: CATEGORIES.HEIFER_CALVES, ...withExtra(YOUNG_STOCK, { radios: ['destetados'] }), absentRadios: ['capados'] },
  {
    caseNumber: 38,
    category: CATEGORIES.CALVES_AND_HEIFER_CALVES,
    ...withExtra(YOUNG_STOCK, { fields: ['in_cantidad_machos', 'in_cantidad_hembras'], radios: ['destetados', 'capados'] }),
    labels: FIELD_LABELS.GENDER_SPLIT,
  },
  { caseNumber: 39, category: CATEGORIES.YOUNG_STEERS, ...YOUNG_STOCK },
  { caseNumber: 40, category: CATEGORIES.HEIFERS, ...YOUNG_STOCK },
  {
    caseNumber: 41,
    category: CATEGORIES.STEERS_AND_HEIFERS,
    ...withExtra(YOUNG_STOCK, { fields: ['in_cantidad_machos', 'in_cantidad_hembras'] }),
    labels: FIELD_LABELS.GENDER_SPLIT,
  },
  { caseNumber: 42, category: CATEGORIES.STEERS, ...YOUNG_STOCK },
  {
    caseNumber: 43,
    category: CATEGORIES.INVERNADA_COWS,
    fields: ['in_edad', 'in_denticion', 'in_calidad', 'in_tipo_rodeo', 'in_tratamiento_nutricional', ...WEIGHING],
    radios: ['si_marca', 'limpia', 'muy_buena', 'sociedad'],
  },
  { caseNumber: 44, category: CATEGORIES.COWS_WITH_CALF, ...WITH_CALF, labels: FIELD_LABELS.AGE_AND_AVERAGE_WEIGHT },
  { caseNumber: 45, category: CATEGORIES.CUT_COWS_WITH_CALF, ...WITH_CALF },
  // OQ-043: MEJ only shows the common fields (user observation reproduced).
  {
    caseNumber: 46,
    category: CATEGORIES.MEJ,
    fields: [],
    radios: [],
    absentFields: ['in_edad', 'in_calidad', 'in_tratamiento_nutricional', 'in_tipo_rodeo', 'in_denticion'],
  },
  { caseNumber: 47, category: CATEGORIES.PREGNANT_COWS, ...withExtra(PREGNANT, { fields: ['in_denticion'] }), labels: FIELD_LABELS.SERVICE_TYPE },
  { caseNumber: 48, category: CATEGORIES.CUT_PREGNANT_COWS, ...withExtra(PREGNANT, { fields: ['in_denticion'] }) },
  { caseNumber: 49, category: CATEGORIES.HEIFERS_WITH_CALF, ...WITH_CALF },
  { caseNumber: 50, category: CATEGORIES.PREGNANT_HEIFERS, ...PREGNANT, absentFields: ['in_denticion'] },
  {
    caseNumber: 51,
    category: CATEGORIES.HEIFERS_FOR_BREEDING,
    fields: ['in_edad', 'in_calidad', 'in_tipo_rodeo', 'in_tratamiento_nutricional'],
    radios: ['si_marca', 'si_definidos', 'limpia', 'muy_buena'],
    labels: FIELD_LABELS.DEFINED,
  },
  {
    caseNumber: 52,
    category: CATEGORIES.BULLS,
    fields: ['in_edad', 'in_tratamiento_nutricional', 'in_denticion', 'in_tipo_rodeo', 'in_calidad', 'in_toro_origen_text'],
    radios: ['si_analisis', 'limpia', 'si_apto_vaquillonas'],
    labels: [FIELD_LABELS.BULLS_FOR_HEIFERS, FIELD_LABELS.BULLS_ORIGIN],
  },
]

// Details every submission fills when the category shows them (MEJ has no quality
// or health): quality and body condition selects, health and uniformity radios and the client remarks.
// Quality and body condition are given as option text with a decimal: a whole number such as '3'
// would match an option VALUE (not its text) and select a different option.
export const COMMON_DETAILS = {
  quality: '7.5',
  bodyCondition: '3.5',
  radios: ['muy_buena', 'parejo'],
  clarification: 'QA aclaración del cliente',
}

// What the report shows for COMMON_DETAILS ("Label: value"); `report` in a profile adds its own lines.
export const COMMON_REPORT_LINES = [
  'Cantidad: 50', 'Calidad: 7.5', 'Sanidad: Muy buena', 'Estado Corporal: 3.5', 'Uniformidad: Parejo', 'Zona: Limpia',
]

// ---------------------------------------------------------------------------
// TC-INV-032 / TC-INV-033: submission profiles (cases 69 to 85).
// Base data: quantity 50, weight 250, segmentation 260/1, 250/48, 240/1, first
// available breed and sale term. Every date is today's date, set
// by the page. `radios` are ids of hidden radio inputs (click label).
// ---------------------------------------------------------------------------
export const BASE_OFFER = {
  quantity: '50',
  weight: '250',
  segmentation: {
    in_cabeza_peso: '260', in_cabeza_cantidad: '1',
    in_cuerpo_peso: '250', in_cuerpo_cantidad: '48',
    in_cola_peso: '240', in_cola_cantidad: '1',
  },
}

const DATE_WEANING = { name: 'in_fecha_destete' }
const DATE_CASTRATION = { name: 'in_fecha_capado' }
const DATE_SERVICE = { id: 'fecha_servicio_input' }
const DATE_INSEMINATION_START = { id: 'fecha_inicio_servicio_input' }
const DATE_INSEMINATION_END = { name: 'in_fecha_servicio2' }
const DATE_REPASO_START = { name: 'in_inicio_repaso' }
const DATE_REPASO_END = { name: 'in_fin_repaso' }

export const SUBMIT_PROFILES = [
  {
    caseNumber: 69,
    category: CATEGORIES.CALVES,
    breeds: 1,
    texts: { in_edad: '7' },
    radios: ['destetados', 'capados', 'limpia'],
    dates: [{ target: DATE_WEANING }, { target: DATE_CASTRATION }],
    report: ['Edad: 7 Meses', 'Capados: Sí', 'Destetados: Sí'],
    video: true,
  },
  {
    caseNumber: 70,
    category: CATEGORIES.HEIFER_CALVES,
    breeds: 2,
    texts: { in_edad: '7' },
    radios: ['no_destetados', 'lucha', 'no_garrapata', 'no_miomio'],
  },
  {
    caseNumber: 71,
    category: CATEGORIES.CALVES_AND_HEIFER_CALVES,
    breeds: 1,
    texts: { in_edad: '7', in_cantidad_machos: '25', in_cantidad_hembras: '25' },
    radios: ['destetados', 'no_capados', 'sucia', 'si_garrapata', 'no_miomio'],
    dates: [{ target: DATE_WEANING }],
  },
  { caseNumber: 72, category: CATEGORIES.YOUNG_STEERS, breeds: 1, texts: { in_edad: '14' }, selects: { in_tratamiento_nutricional: 'Praderas y/o Verdeos' }, radios: ['limpia'] },
  { caseNumber: 73, category: CATEGORIES.HEIFERS, breeds: 3, texts: { in_edad: '14' }, radios: ['limpia'] },
  {
    caseNumber: 74,
    category: CATEGORIES.STEERS_AND_HEIFERS,
    breeds: 1,
    texts: { in_edad: '14', in_cantidad_machos: '30', in_cantidad_hembras: '20' },
    radios: ['limpia'],
  },
  { caseNumber: 75, category: CATEGORIES.STEERS, breeds: 1, texts: { in_edad: '20' }, selects: { in_tratamiento_nutricional: 'A Corral' }, radios: ['limpia'] },
  {
    caseNumber: 76,
    category: CATEGORIES.INVERNADA_COWS,
    breeds: 1,
    texts: { in_edad: '6' },
    selects: { in_denticion: 'Boca Llena', in_tipo_rodeo: 'Rodeo General' },
    radios: ['limpia'],
    report: ['Edad: 6 Años', 'Denticion: Boca Llena', 'Tipo Rodeo: Rodeo General'],
  },
  {
    caseNumber: 77,
    category: CATEGORIES.COWS_WITH_CALF,
    breeds: 1,
    texts: { in_edad: '5', in_edad_cria: '4', in_peso_promedio_cria: '120' },
    radios: ['parejo_cria'],
    report: ['Edad: 5 Años'],
    video: true,
  },
  {
    caseNumber: 78,
    category: CATEGORIES.CUT_COWS_WITH_CALF,
    breeds: 1,
    texts: { in_edad: '8', in_edad_cria: '4', in_peso_promedio_cria: '120' },
    radios: ['desparejo_cria'],
  },
  { caseNumber: 79, category: CATEGORIES.MEJ, breeds: 1 },
  {
    caseNumber: 80,
    category: CATEGORIES.PREGNANT_COWS,
    breeds: 1,
    texts: { in_edad: '5' },
    radios: ['inseminacion', 'fijo'],
    dates: [{ target: DATE_SERVICE }],
    report: ['Edad: 5 Años', 'Tipo de Servicio: Inseminación', 'Inseminación Tipo: A tiempo fijo'],
  },
  {
    caseNumber: 81,
    category: CATEGORIES.CUT_PREGNANT_COWS,
    breeds: 1,
    texts: { in_edad: '8' },
    radios: ['natural'],
    dates: [{ target: DATE_INSEMINATION_START }, { target: DATE_INSEMINATION_END }],
  },
  {
    caseNumber: 82,
    category: CATEGORIES.HEIFERS_WITH_CALF,
    breeds: 1,
    texts: { in_edad: '26', in_edad_cria: '3', in_peso_promedio_cria: '100' },
    radios: ['parejo_cria'],
  },
  {
    caseNumber: 83,
    category: CATEGORIES.PREGNANT_HEIFERS,
    breeds: 1,
    texts: { in_edad: '20' },
    radios: ['mas_repaso', 'deteccion'],
    dates: [
      { target: DATE_INSEMINATION_START },
      { target: DATE_INSEMINATION_END },
      { target: DATE_REPASO_START },
      { target: DATE_REPASO_END },
    ],
  },
  { caseNumber: 84, category: CATEGORIES.HEIFERS_FOR_BREEDING, breeds: 1, texts: { in_edad: '15' }, selects: { in_tipo_rodeo: 'Puro controlado' } },
  { caseNumber: 85, category: CATEGORIES.BULLS, breeds: 1, texts: { in_edad: '3' }, selects: { in_tipo_rodeo: 'Puro Pedigree', in_denticion: '4 Dientes' } },
]

// TC-INV-018 and TC-INV-033 use the Terneros profile of the TC-INV-033 table
// (Destetados Sí, Capados No, Zona Limpia, Edad 7).
export const CALVES_PROFILE = {
  category: CATEGORIES.CALVES,
  breeds: 1,
  texts: { in_edad: '7' },
  radios: ['destetados', 'no_capados', 'limpia'],
  dates: [{ target: DATE_WEANING }],
}
