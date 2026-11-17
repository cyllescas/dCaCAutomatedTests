// Labels and defaults of the Admin legajo (ofrecimientos-invernada-legajo-admin).
// Values come from the observed legajo of the approved plan (13/10/2026) and the
// QA decisions OQ-057 to OQ-061, OQ-063 and OQ-064. They are observations, not business rules.

export const LEGAJO_LABELS = {
  REQUEST_DATE: 'Fecha Solicitud:',
  REVIEW_DATE: 'Fecha Revisación:',
  BREED_1: 'Raza 1:',
  BREED_2: 'Raza 2:',
  BREED_3: 'Raza 3:',
  WEIGHT: 'Peso:',
  SEGMENTATION_WEIGHT: 'Peso Kgs Aprox:',
  SEGMENTATION_QUANTITY: 'Cantidad:',
  AVERAGE_WEIGHT: 'Peso promedio:',
  CATEGORY: 'Categoría:',
  AGE: 'Edad:',
  NUTRITION: 'Trat. Nutricional:',
  WEANED: 'Destetados:',
  WEANING_DATE: 'Fecha de Destete:',
  CASTRATED: 'Capados:',
  CASTRATION_DATE: 'Fecha que se caparon:',
  TEETH: 'Denticion:',
  HERD_TYPE: 'Tipo Rodeo:',
  LIQUID_BRAND: 'Marca Líquida:',
  TICK: 'Garrapata:',
  BODY_CONDITION: 'Estado Corporal:',
  MIO_MIO: 'Conocen Mio Mio:',
  QUALITY: 'Calidad:',
  ZONE: 'Zona:',
  HEALTH: 'Sanidad:',
  UNIFORMITY: 'Uniformidad:',
  DISCARD: 'Descarte (Cabezas):',
  SALE_TERM: 'Plazo de Venta:',
  WEIGHING_AT: 'Pesada Carguío:',
  SHRINK: 'Desbaste:',
  DISTANCE: 'Distancia:',
  CALF_AGE: 'Edad (meses)',
  CALF_WEIGHT: 'Peso (Kgs)',
}

export const LEGAJO_TEXTS = {
  CLARIFICATION_TITLE: 'Aclaraciones del cliente',
  NO_CLARIFICATION: 'No hay Comentarios del Cliente',
  NOT_LOADED_DATE: '00/00/0000',
  NOT_REVIEWED: '00/00/0000 a las 00:00',
  NO_DATA: 'Sin datos',
  NOT_SPECIFIED: 'No Especificado',
  NOT_SPECIFIED_LOWER: 'No especificado',
  HERD_TYPE_PLACEHOLDER: '-',
  ZERO_WEIGHT: '0 Kg',
  YES: 'Sí',
  NO: 'No',
  CLEAN_ZONE: 'Limpia',
  MEDIA_VIDEO_LOADED: 'Si',
  MEDIA_HIDDEN: 'Oculto',
  MEDIA_VIDEO_TYPE: 'video',
  MEDIA_IMAGE_TYPE: 'imagen',
  // OQ-062 (open): Pesada Carguío "Sociedad Rural" is asserted as observed, not as a rule.
  WEIGHING_AT_SOCIETY: 'Sociedad Rural',
  UNIFORM: 'Parejo',
  UNEVEN: 'Desparejo',
  HEALTH_VERY_GOOD: 'Muy buena',
}

// Items the legajo creates for an uploaded video (confirmed by QA, OQ-063).
export const EXPECTED_MEDIA = { videos: 1, images: 6 }

export const CATEGORY_UNIT = { 'Vacas con cría': 'Años', Terneros: 'Meses', Terneras: 'Meses' }

// Labels that do NOT belong to a category and must be absent (OQ-061).
export const ABSENT_LABELS = {
  Terneras: [LEGAJO_LABELS.CASTRATED, LEGAJO_LABELS.CASTRATION_DATE],
  'Vacas con cría': [
    LEGAJO_LABELS.WEANED, LEGAJO_LABELS.WEANING_DATE, LEGAJO_LABELS.CASTRATED, LEGAJO_LABELS.CASTRATION_DATE,
  ],
}

// Labels of the vendor report in Pendientes ("Label: value" lines).
export const REPORT_LABELS = {
  QUANTITY: 'Cantidad',
  AGE: 'Edad',
  WEANED: 'Destetados',
  CASTRATED: 'Capados',
  QUALITY: 'Calidad',
  HEALTH: 'Sanidad',
  BODY_CONDITION: 'Estado Corporal',
  UNIFORMITY: 'Uniformidad',
  ZONE: 'Zona',
  TEETH: 'Denticion',
}

// Segmentation blocks of the legajo (`.seg_tropa .col_3.<part>`), in the order Cabeza, Cuerpo, Cola;
// `weight` / `quantity` are the suffixes of the offer profile fields (in_<part>_peso / in_<part>_cantidad).
export const SEGMENTATION_PARTS = ['cabeza', 'cuerpo', 'cola']
