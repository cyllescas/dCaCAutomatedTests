export const CATEGORIES = {
  CALVES: 'Terneros',
  CALVES_AND_HEIFER_CALVES: 'Terneros y Terneras',
  STEERS_AND_HEIFERS: 'Novillitos y Vaquillonas',
  COWS_WITH_CALF: 'Vacas con cría',
  PREGNANT_COWS: 'Vacas preñadas',
  HEIFERS_FOR_BREEDING: 'Vaquillonas para madre',
  BULLS: 'Toros',
}

export const SERVICE_TYPES = {
  NATURAL: 'Servicio Natural',
}

export const ZONES = {
  LUCHA: 'Lucha',
  SUCIA: 'Sucia',
}

export const FIELD_LABELS = {
  BULLS_ORIGIN: 'Origen de los toros',
  GENDER_SPLIT: ['Machos', 'Hembras'],
  NATURAL_SERVICE: ['Inicio del servicio', 'Fin del servicio', 'Raza de servicio', 'Origen de los toros'],
}

// ---------------------------------------------------------------------------
// TC-INV-017: video fixtures. The files are local and not versioned; specs skip
// the case when the file does not exist (see the `fileExists` task).
// ---------------------------------------------------------------------------
export const VIDEO_FILES = {
  valid: () => Cypress.env('INVERNADA_VIDEO_PATH') || 'cypress/fixtures/video_ofrecimiento.mp4',
  short: () => 'cypress/fixtures/video_ofrecimiento_corto.mp4',
  rejected: () => Cypress.env('INVERNADA_VIDEO_SHORT_PATH') || 'cypress/fixtures/video_ofrecimiento_4seg.mp4',
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
export const ALL_CATEGORIES = [
  'Terneros', 'Terneras', 'Terneros y Terneras', 'Novillitos', 'Vaquillonas', 'Novillitos y Vaquillonas',
  'Novillos', 'Vacas de invernada', 'Vacas con cría', 'MEJ', 'Vacas CUT con cría', 'Vacas CUT preñadas',
  'Vacas preñadas', 'Vaquillonas con cría', 'Vaquillonas preñadas', 'Vaquillonas para madre', 'Toros',
]

// Radios are hidden inputs; the visible control is `label[for=<id>]`.
export const OPTION_CASES = [
  { caseNumber: 24, title: 'Marca Líquida', category: 'Terneros', radios: { si_marca: 'Sí', no_marca: 'No' } },
  { caseNumber: 25, title: 'Calidad', category: 'Terneros', select: 'in_calidad', options: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'] },
  { caseNumber: 26, title: 'Estado Corporal', category: 'Terneros', select: 'in_estado_corporal', options: ['2', '2.5', '3', '3.5', '4', '4.5', '5'] },
  {
    caseNumber: 27,
    title: 'Tratamiento Nutricional',
    category: 'Terneros',
    select: 'in_tratamiento_nutricional',
    options: ['Campo Natural', 'Racionados', 'A Corral', 'Praderas y/o Verdeos', 'Otro'],
  },
  { caseNumber: 28, title: 'Zona', category: 'Terneros', radios: { limpia: 'Limpia', lucha: 'Lucha', sucia: 'Sucia' } },
  {
    caseNumber: 29,
    title: 'Dentición',
    category: 'Vacas de invernada',
    select: 'in_denticion',
    options: [
      'Diente de leche', '2 Dientes', '4 Dientes', '6 Dientes', 'Boca Llena', '1/2 Diente Arriba', '1/2 Diente',
      '1/2 Diente Abajo', 'Liso', '(Aclarar en los comentarios)',
    ],
  },
  {
    caseNumber: 30,
    title: 'Tipo de Rodeo',
    category: 'Vacas de invernada',
    select: 'in_tipo_rodeo',
    options: ['Rodeo General', 'Puro controlado', 'Puro Pedigree', 'Angus MAS'],
  },
  { caseNumber: 31, title: 'Uniformidad de la cría', category: 'Vacas con cría', radios: { parejo_cria: 'Parejo', desparejo_cria: 'Desparejo' } },
  {
    caseNumber: 32,
    title: 'Tipo de servicio',
    category: 'Vacas preñadas',
    radios: { inseminacion: 'Inseminación', natural: 'Servicio Natural', mas_repaso: 'Inseminación + repaso' },
  },
  {
    caseNumber: 33,
    title: 'Inseminación',
    category: 'Vacas preñadas',
    serviceRadio: 'inseminacion',
    radios: { fijo: 'A tiempo fijo', deteccion: 'Con detección' },
  },
]

// ---------------------------------------------------------------------------
// TC-INV-026: fields observed per category. `common` applies to every category.
// `fields` are [name] attributes; `radios` are ids of hidden radio inputs
// (assert `label[for=<id>]`). Units (Meses/Años) have no observed selector and
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
  { caseNumber: 36, category: 'Terneros', ...withExtra(YOUNG_STOCK, { radios: ['destetados', 'capados'] }) },
  { caseNumber: 37, category: 'Terneras', ...withExtra(YOUNG_STOCK, { radios: ['destetados'] }), absentRadios: ['capados'] },
  {
    caseNumber: 38,
    category: 'Terneros y Terneras',
    ...withExtra(YOUNG_STOCK, { fields: ['in_cantidad_machos', 'in_cantidad_hembras'], radios: ['destetados', 'capados'] }),
  },
  { caseNumber: 39, category: 'Novillitos', ...YOUNG_STOCK },
  { caseNumber: 40, category: 'Vaquillonas', ...YOUNG_STOCK },
  { caseNumber: 41, category: 'Novillitos y Vaquillonas', ...withExtra(YOUNG_STOCK, { fields: ['in_cantidad_machos', 'in_cantidad_hembras'] }) },
  { caseNumber: 42, category: 'Novillos', ...YOUNG_STOCK },
  {
    caseNumber: 43,
    category: 'Vacas de invernada',
    fields: ['in_edad', 'in_denticion', 'in_calidad', 'in_tipo_rodeo', 'in_tratamiento_nutricional', ...WEIGHING],
    radios: ['si_marca', 'limpia', 'muy_buena', 'sociedad'],
  },
  { caseNumber: 44, category: 'Vacas con cría', ...WITH_CALF },
  { caseNumber: 45, category: 'Vacas CUT con cría', ...WITH_CALF },
  // OQ-043: MEJ only shows the common fields (user observation reproduced).
  {
    caseNumber: 46,
    category: 'MEJ',
    fields: [],
    radios: [],
    absentFields: ['in_edad', 'in_calidad', 'in_tratamiento_nutricional', 'in_tipo_rodeo', 'in_denticion'],
  },
  { caseNumber: 47, category: 'Vacas preñadas', ...withExtra(PREGNANT, { fields: ['in_denticion'] }) },
  { caseNumber: 48, category: 'Vacas CUT preñadas', ...withExtra(PREGNANT, { fields: ['in_denticion'] }) },
  { caseNumber: 49, category: 'Vaquillonas con cría', ...WITH_CALF },
  { caseNumber: 50, category: 'Vaquillonas preñadas', ...PREGNANT, absentFields: ['in_denticion'] },
  {
    caseNumber: 51,
    category: 'Vaquillonas para madre',
    fields: ['in_edad', 'in_calidad', 'in_tipo_rodeo', 'in_tratamiento_nutricional'],
    radios: ['si_marca', 'si_definidos', 'limpia', 'muy_buena'],
  },
  {
    caseNumber: 52,
    category: 'Toros',
    fields: ['in_edad', 'in_tratamiento_nutricional', 'in_denticion', 'in_tipo_rodeo', 'in_calidad', 'in_toro_origen_text'],
    radios: ['si_analisis', 'limpia', 'si_apto_vaquillonas'],
  },
]

// ---------------------------------------------------------------------------
// TC-INV-032 / TC-INV-033: submission profiles (cases 69 to 85).
// Base data: quantity 50, weight 250, segmentation 260/1, 250/48, 240/1, first
// available breed and sale term. Dates are relative to "today" (days ago) so
// they stay dynamic. `radios` are ids of hidden radio inputs (click label).
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

const DATE_SERVICE = { id: 'fecha_servicio_input' }
const DATE_INSEMINATION_START = { id: 'fecha_inicio_servicio_input' }
const DATE_INSEMINATION_END = { name: 'in_fecha_servicio2' }
const DATE_REPASO_START = { name: 'in_inicio_repaso' }
const DATE_REPASO_END = { name: 'in_fin_repaso' }

export const SUBMIT_PROFILES = [
  { caseNumber: 69, category: 'Terneros', breeds: 1, texts: { in_edad: '7' }, radios: ['destetados', 'capados', 'limpia'] },
  {
    caseNumber: 70,
    category: 'Terneras',
    breeds: 2,
    texts: { in_edad: '7' },
    radios: ['no_destetados', 'lucha', 'no_garrapata', 'no_miomio'],
  },
  {
    caseNumber: 71,
    category: 'Terneros y Terneras',
    breeds: 1,
    texts: { in_edad: '7', in_cantidad_machos: '25', in_cantidad_hembras: '25' },
    radios: ['destetados', 'no_capados', 'sucia', 'si_garrapata', 'no_miomio'],
  },
  { caseNumber: 72, category: 'Novillitos', breeds: 1, texts: { in_edad: '14' }, selects: { in_tratamiento_nutricional: 'Praderas y/o Verdeos' }, radios: ['limpia'] },
  { caseNumber: 73, category: 'Vaquillonas', breeds: 3, texts: { in_edad: '14' }, radios: ['limpia'] },
  {
    caseNumber: 74,
    category: 'Novillitos y Vaquillonas',
    breeds: 1,
    texts: { in_edad: '14', in_cantidad_machos: '30', in_cantidad_hembras: '20' },
    radios: ['limpia'],
  },
  { caseNumber: 75, category: 'Novillos', breeds: 1, texts: { in_edad: '20' }, selects: { in_tratamiento_nutricional: 'A Corral' }, radios: ['limpia'] },
  {
    caseNumber: 76,
    category: 'Vacas de invernada',
    breeds: 1,
    texts: { in_edad: '6' },
    selects: { in_denticion: 'Boca Llena', in_tipo_rodeo: 'Rodeo General' },
    radios: ['limpia'],
  },
  {
    caseNumber: 77,
    category: 'Vacas con cría',
    breeds: 1,
    texts: { in_edad: '5', in_edad_cria: '4', in_peso_promedio_cria: '120' },
    radios: ['parejo_cria'],
  },
  {
    caseNumber: 78,
    category: 'Vacas CUT con cría',
    breeds: 1,
    texts: { in_edad: '8', in_edad_cria: '4', in_peso_promedio_cria: '120' },
    radios: ['desparejo_cria'],
  },
  { caseNumber: 79, category: 'MEJ', breeds: 1 },
  {
    caseNumber: 80,
    category: 'Vacas preñadas',
    breeds: 1,
    texts: { in_edad: '5' },
    radios: ['inseminacion', 'fijo'],
    dates: [{ target: DATE_SERVICE, daysAgo: 90 }],
  },
  {
    caseNumber: 81,
    category: 'Vacas CUT preñadas',
    breeds: 1,
    texts: { in_edad: '8' },
    radios: ['natural'],
    dates: [{ target: DATE_INSEMINATION_START, daysAgo: 90 }, { target: DATE_INSEMINATION_END, daysAgo: 60 }],
  },
  {
    caseNumber: 82,
    category: 'Vaquillonas con cría',
    breeds: 1,
    texts: { in_edad: '26', in_edad_cria: '3', in_peso_promedio_cria: '100' },
    radios: ['parejo_cria'],
  },
  {
    caseNumber: 83,
    category: 'Vaquillonas preñadas',
    breeds: 1,
    texts: { in_edad: '20' },
    radios: ['mas_repaso', 'deteccion'],
    dates: [
      { target: DATE_INSEMINATION_START, daysAgo: 90 },
      { target: DATE_INSEMINATION_END, daysAgo: 75 },
      { target: DATE_REPASO_START, daysAgo: 60 },
      { target: DATE_REPASO_END, daysAgo: 45 },
    ],
  },
  { caseNumber: 84, category: 'Vaquillonas para madre', breeds: 1, texts: { in_edad: '15' }, selects: { in_tipo_rodeo: 'Puro controlado' } },
  { caseNumber: 85, category: 'Toros', breeds: 1, texts: { in_edad: '3' }, selects: { in_tipo_rodeo: 'Puro Pedigree', in_denticion: '4 Dientes' } },
]

// TC-INV-018 and TC-INV-033 use the Terneros profile of the TC-INV-033 table
// (Destetados Sí, Capados No, Zona Limpia, Edad 7).
export const CALVES_PROFILE = {
  category: 'Terneros',
  breeds: 1,
  texts: { in_edad: '7' },
  radios: ['destetados', 'no_capados', 'limpia'],
}
