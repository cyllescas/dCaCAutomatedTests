// Data for the Representante (USER_AGENT) role and the Cliente -> Sociedad -> Establecimiento cascade
// (specs/ofrecimientos-representante-core.md, TC-AGT-001..027). Literal texts observed on 2026-11-25;
// they are observations, not business rules. No real client, society or establishment names or IDs here:
// those are discovered at runtime.
import { LOCATION_LABELS } from './invernada_offer_data'

export const AGENT_PATHS = {
  HOME: '/__dcac/',
  CLIENTS: '/__dcac/misClientes',
  CLIENT_PROFILE_PREFIX: '/__dcac/perfil/DatosPersonales/',
  CLIENT_SOCIETIES_PREFIX: '/__dcac/perfil/MisSociedades/',
}

export const AGENT_TEXTS = {
  HOME_TITLE: 'Inicio',
  CLIENTS_LINK: 'Clientes',
  CLIENTS_TITLE: 'Clientes',
  VIEW_PROFILE: 'Ver Perfil',
  BACK_TO_CLIENTS: 'Volver al listado de clientes',
}

// deCampoPagos access (#btn_pagar). Only origin and pathname are ever checked: the href carries
// tokens (TST-AGT-002) and must never be logged.
export const DCP_LINK = {
  ORIGIN: 'https://react-stage.dcac.ar',
  PATHNAME: '/inicio',
}

export const CREATE_OPTION_VALUE = 'crear'
export const CLIENT_PLACEHOLDER = { text: 'Seleccionar', value: '' }

// Option texts of each legacy offer form, as rendered for the Representante.
export const FORM_LABELS = {
  faena: {
    NO_SOCIETIES: 'No hay sociedades disponibles',
    SOCIETY_PLACEHOLDER: 'Seleccionar una sociedad',
    NEW_SOCIETY: '+ Nueva Sociedad',
    ESTABLISHMENT_PLACEHOLDER: 'Seleccionar un establecimiento',
    NEW_ESTABLISHMENT: '+ Nuevo establecimiento',
    ESTABLISHMENT_INITIAL: { text: 'Seleccione..', value: '0' },
  },
  invernada: {
    NEW_CLIENT: '+ Nuevo Cliente',
    SOCIETY_PLACEHOLDER: LOCATION_LABELS.SOCIETY_PLACEHOLDER,
    NEW_SOCIETY: '+ Nueva Sociedad',
    ESTABLISHMENT_PLACEHOLDER: LOCATION_LABELS.ESTABLISHMENT_PLACEHOLDER,
    NEW_ESTABLISHMENT: LOCATION_LABELS.NEW_ESTABLISHMENT,
  },
}

// Placeholder texts that never count as a real society/establishment.
export const NON_REAL_OPTION_TEXTS = [
  FORM_LABELS.faena.NO_SOCIETIES,
  FORM_LABELS.faena.SOCIETY_PLACEHOLDER,
  FORM_LABELS.faena.ESTABLISHMENT_PLACEHOLDER,
  FORM_LABELS.faena.ESTABLISHMENT_INITIAL.text,
  FORM_LABELS.invernada.SOCIETY_PLACEHOLDER,
  FORM_LABELS.invernada.ESTABLISHMENT_PLACEHOLDER,
]

// Required messages of the empty submission (VAL-AGT-001 / VAL-AGT-002). Faena labels come from
// faena_offer_data (MESSAGES.required); these are the Invernada ones that are checked by text.
export const INVERNADA_REQUIRED_LABELS = {
  SOCIETY: 'Sociedad',
  ESTABLISHMENT: 'Establecimiento',
  CATEGORY: 'Categoria',
  BREED: 'Raza',
  SALE_TERM: 'Plazo de venta',
}

// Cascade waits (condition based). Societies loaded in <0.5 s and establishments in ~2.5 s during the
// exploration; the plan allows up to 10 s per client option before treating it as "no societies".
export const CASCADE_TIMEOUTS = {
  SOCIETIES_PER_CLIENT_MS: 10000,
  // Once the passive society request for the chosen client has answered, give the page this long to render
  // the options before treating the client as "no societies" (avoids waiting the full 10 s per client).
  RENDER_AFTER_RESPONSE_MS: 1500,
  ESTABLISHMENTS_MS: 15000,
}

// Passive alias only (never stubbed, never asserted): signals that the society list request answered.
export const CLIENT_SOCIETIES_REQUEST = '**/MODULOS/modulo_gruposociedades/index.php?clientesociendad=1*'

export const noMatchSearchTerm = () => `zzqa-${Date.now()}`
