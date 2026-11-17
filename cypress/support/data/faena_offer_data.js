// Data for the legacy faena offer form (specs/ofrecimientos-faena.md, TC-FAE-012..022).
// Observations from the 2026-11-17 exploration; not business rules.

export const FAENA_CATEGORIES = [
  'Terneros', 'Terneras', 'Terneros y Terneras', 'Novillitos', 'Vaquillonas', 'Novillitos y Vaquillonas',
  'Novillos', 'MEJ', 'Vaca gorda', 'Vaca manufactura', 'Vaca conserva', 'Vacas y Vaquillonas',
  'Vacas y Novillos', 'Toro gordo', 'Toro manufactura', 'Toro conserva', 'Toros y Novillos',
  'Toros y Vacas', 'Toros, Vacas y Novillos', 'MEJ y Terneros', 'MEJ y Terneras', 'MEJ y Novillitos',
  'MEJ y Vaquillonas', 'MEJ y Novillos', 'Varias', 'Bubalinos', 'Bubalinas', 'Bubalinos / Bubalinas',
  'Novillos y Vaquillonas',
]

export const FAENA_BREEDS = [
  'Aberdeen Angus Negro', 'Aberdeen Angus Colorado', 'Aberdeen Angus Negro y Colorado', 'Brangus Negro',
  'Brangus colorado', 'Brangus Negro y Colorado', 'Hereford', 'Braford', 'Charolais', 'Holando Argentino',
  'Shorthorn', 'Mestizo', 'Limousin', 'Limangus', 'Bonsmara', 'Jersey', 'Brahman', 'San Ignacio',
  'Galloway', 'Waygu', 'Careta', 'Media Sangre', 'Cuartino', 'Bubalinos',
]

// Radio ids (the visible control is label[for=<id>]).
export const TERMINATIONS = { FIELD: 'a_campo', RATIONED: 'racionado', FEEDLOT: 'feedlot' }
export const DESTINATIONS = { CONSUMPTION: 'consumo', HILTON: 'hilton', EU: 'UE', QUOTA_481: 'cuota' }

export const MESSAGES = {
  required: (field) => `Debe completar el campo ${field}`,
  confirmation: 'Su tropa ha sido creada correctamente',
  videoRejected: 'compruebe que el formato sea el correcto',
  videoEmpty: 'Aún no se han cargado archivos',
}

// Required fields, with the message label the form shows for each (OQ-069 resolved: only the average weight counts).
export const REQUIRED_FIELDS = [
  { key: 'society', label: 'Sociedad' },
  { key: 'establishment', label: 'Establecimiento' },
  { key: 'cage', label: 'Tipo de Jaula' },
  { key: 'category', label: 'Categoría' },
  { key: 'termination', label: 'Terminación' },
  { key: 'destination', label: 'Destino' },
  { key: 'breeds', label: 'Raza' },
  { key: 'weight', label: 'Peso' },
  { key: 'loadDate', label: 'Disponibilidad de Carga' },
]

export const BASE_OFFER = {
  cage: 'simple',
  category: 'Terneros',
  termination: TERMINATIONS.FIELD,
  daysOfConfinement: null,
  destination: DESTINATIONS.CONSUMPTION,
  aptoChina: 'apto_china_no',
  breeds: ['Aberdeen Angus Negro'],
  weights: { avg: '350' },
  weighing: null,
  freight: null,
  salePeriod: null,
  shrinkage: null,
  comments: null,
}

// TC-FAE-019: the six categories published, rotating options so every value of
// termination, destination, apto China, cage, weighing and freight is published at
// least once without a cartesian product. `adminCheck` marks the two cases that
// also validate the legajo in Admin.
export const CATEGORY_PUBLISH_CASES = [
  { n: 1, category: 'Terneros', cage: 'simple', termination: 'a_campo', destination: 'consumo', aptoChina: 'apto_china_no', weighing: 'sin_encierre', freight: 'a_retirar' },
  { n: 2, category: 'Terneros y Terneras', cage: 'doble', termination: 'racionado', daysOfConfinement: '30', destination: 'hilton', aptoChina: 'apto_china_si', weighing: 'con_encierre', freight: 'puesto_planta', adminCheck: true },
  { n: 3, category: 'Vaca gorda', cage: 'simple', termination: 'feedlot', daysOfConfinement: '45', destination: 'UE', aptoChina: 'apto_china_no', weighing: 'con_encierre', freight: 'a_retirar' },
  { n: 4, category: 'Toro gordo', cage: 'doble', termination: 'a_campo', destination: 'cuota', aptoChina: 'apto_china_si', weighing: 'sin_encierre', freight: 'puesto_planta' },
  { n: 5, category: 'Toros y Vacas', cage: 'simple', termination: 'racionado', daysOfConfinement: '30', destination: 'consumo', aptoChina: 'apto_china_si', weighing: 'con_encierre', freight: 'a_retirar' },
  { n: 6, category: 'Bubalinos', cage: 'doble', termination: 'feedlot', daysOfConfinement: '45', destination: 'hilton', aptoChina: 'apto_china_no', weighing: 'sin_encierre', freight: 'puesto_planta', adminCheck: true },
]

// TC-FAE-020 A and B (C needs a new society: depends on OQ-067).
export const EXTRA_PUBLISH_CASES = [
  {
    id: 'A', title: 'Novillos con 3 razas y todos los campos opcionales',
    category: 'Novillos', cage: 'doble', termination: 'racionado', daysOfConfinement: '60', destination: 'UE',
    aptoChina: 'apto_china_si', breeds: ['Hereford', 'Braford', 'Charolais'],
    weights: { min: '380', avg: '420', max: '470' }, weighing: 'con_encierre', freight: 'puesto_planta',
    salePeriod: '15', shrinkage: '3', comments: 'QA faena - todos los campos',
  },
  {
    id: 'B', title: 'Varias con el mínimo indispensable',
    category: 'Varias', cage: 'simple', termination: 'a_campo', destination: 'cuota', aptoChina: null,
    breeds: ['Mestizo'], weights: { avg: '300' }, weighing: null, freight: null,
  },
]

// Video fixtures (local, not versioned; same files as invernada).
export const VIDEO_FILES = {
  valid: () => Cypress.env('INVERNADA_VIDEO_PATH') || 'cypress/fixtures/video_ofrecimiento.mp4',
  rejected: () => Cypress.env('INVERNADA_VIDEO_SHORT_PATH') || 'cypress/fixtures/video_ofrecimiento_4seg.mp4',
}

// Controls shown by the form once a society (and its establishment) is chosen and no termination is picked
// yet: identical for the 29 categories (TC-FAE-012). `ng_dias_encierre` appears only with Racionado/Feedlot.
export const EXPECTED_FORM_CONTROLS = [
  'ng_sociedad_vendedora', 'ng_establecimiento', 'for:simple', 'for:doble', 'ng_categoria', 'for:a_campo',
  'for:racionado', 'for:feedlot', 'for:consumo', 'for:hilton', 'for:UE', 'for:cuota', 'for:apto_china_si',
  'for:apto_china_no', 'ng_raza', 'ng_peso_min', 'ng_peso_max', 'ng_peso', 'ng_disp_carga', 'aa',
  'ng_aclaracion', 'ng_condiciones_plazo_cotizacion', 'for:con_encierre', 'for:sin_encierre',
  'ng_condiciones_desbaste', 'for:a_retirar', 'for:puesto_planta',
]

// 1x1 PNG used as the weighing sheet (TC-FAE-021); generated in memory, nothing is versioned as a file.
export const WEIGHING_SHEET_PNG = {
  contents: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  fileName: 'planilla_pesada_qa.png',
  mimeType: 'image/png',
  encoding: 'base64',
}
