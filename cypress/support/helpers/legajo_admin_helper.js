import AdminInvernadaOffersPage from '../../pages/AdminInvernadaOffersPage'
import AdminInvernadaLegajoPage from '../../pages/AdminInvernadaLegajoPage'
import AdminSearchPage from '../../pages/AdminSearchPage'
import InvernadaOfferPage from '../../pages/InvernadaOfferPage'
import InvernadaMyPublicationsPendingPage from '../../pages/InvernadaMyPublicationsPendingPage'
import { loginWithSession } from './login_helper'
import { selectExistingInvernadaLocation } from './invernada_offer_helper'
import { observeLotRequests } from './invernada_trace_helper'
import { CATEGORIES, VIDEO_FILES, todayText } from '../data/invernada_offer_data'
import {
  ABSENT_LABELS, CATEGORY_UNIT, EXPECTED_MEDIA, SEGMENTATION_PARTS, LEGAJO_LABELS as L, LEGAJO_TEXTS as T, REPORT_LABELS as R,
} from '../data/legajo_admin_data'

// Prints a step marker in the console of `cypress run` (see the `trace` task of cypress.config.js).
export function trace(message) {
  cy.task('trace', message, { log: false, timeout: 15000 })
}

// ---- Client side ----------------------------------------------------------

// Fills and submits the profile. `offer` is filled while the commands run:
// read it inside cy.then() after calling this function.
export function submitLegajoOffer(profile) {
  observeLotRequests()
  selectExistingInvernadaLocation()
  const offer = InvernadaOfferPage.fillLegajoOffer(profile)
  if (profile.video) {
    InvernadaOfferPage.attachVideo(VIDEO_FILES.valid())
    InvernadaOfferPage.assertVideoAccepted()
  }
  InvernadaOfferPage.selectedSocietyText().then((society) => {
    offer.society = society
  })
  InvernadaOfferPage.selectedEstablishmentText().then((establishment) => {
    offer.establishment = establishment
  })
  InvernadaOfferPage.submitOffer()
  return offer
}

// TC-LEG-011: the vendor sees the tropa in Pendientes with what was loaded.
export function assertLoadedInPending(tropaId, profile, offer) {
  trace(`client: tropa #${tropaId} created, checking Pendientes`)
  InvernadaMyPublicationsPendingPage.assertPendingItem(tropaId, {
    quantity: profile.quantity,
    category: profile.category,
    weight: profile.minimal ? T.ZERO_WEIGHT : profile.weight,
    breed: offer.breeds[0],
    society: offer.society,
  })
  InvernadaMyPublicationsPendingPage.openReport(tropaId)
  if (!profile.minimal) {
    InvernadaMyPublicationsPendingPage.assertReportSegmentation({ segmentation: profile.segmentation, weight: profile.weight })
  }
  InvernadaMyPublicationsPendingPage.openReportCharacteristics()
  InvernadaMyPublicationsPendingPage.assertReportSuggestedQuantity(profile.quantity)
  InvernadaMyPublicationsPendingPage.assertReportCharacteristics(expectedReportLines(profile))
}

function expectedReportLines(profile) {
  const isCows = profile.category === CATEGORIES.COWS_WITH_CALF
  const unit = CATEGORY_UNIT[profile.category]
  const radios = profile.radios || []
  const age = profile.minimal ? '0' : profile.texts.in_edad
  const lines = [`${R.QUANTITY}: ${profile.quantity}`, `${R.AGE}: ${age} ${unit}`]
  if (profile.minimal) {
    lines.push(`${R.ZONE}: ${T.CLEAN_ZONE}`)
    if (!isCows) lines.push(`${R.WEANED}: ${T.NO}`, `${R.CASTRATED}: ${T.NO}`)
    return lines
  }
  lines.push(
    `${R.QUALITY}: ${profile.quality}`, `${R.HEALTH}: ${T.HEALTH_VERY_GOOD}`,
    `${R.BODY_CONDITION}: ${profile.bodyCondition}`, `${R.UNIFORMITY}: ${T.UNIFORM}`,
  )
  if (isCows) lines.push(`${R.TEETH}: ${profile.selects.in_denticion}`)
  else if (radios.includes('destetados')) lines.push(`${R.WEANED}: ${T.YES}`)
  return lines
}

// ---- Admin side -----------------------------------------------------------

// A session per role: switching from the client to the Admin inside one test
// restores the Admin session and lands on its home.
export function loginAsAdmin(credentials) {
  loginWithSession(credentials.username, credentials.password, 'admin', { landingPath: '/', validatePath: '/' })
}

export function visitAdminOfferings(credentials) {
  trace('admin: session start')
  loginAsAdmin(credentials)
  trace('admin: session ready, opening Ofrecimientos')
  AdminInvernadaOffersPage.openOfferings()
  trace('admin: listing loaded')
}

// Path 1: Home > INVERNADA > Ofrecimientos, row `#fila_<id>` and "Ver Legajo".
export function openLegajoByListing(tropaId, credentials) {
  visitAdminOfferings(credentials)
  AdminInvernadaOffersPage.assertRowListed(tropaId)
}

export function viewLegajoFromListing(tropaId) {
  trace(`admin: Ver Legajo #${tropaId}`)
  AdminInvernadaOffersPage.openLegajo(tropaId)
  AdminInvernadaLegajoPage.assertOpenedFor(tropaId)
  trace('admin: legajo opened')
}

// Path 2: global search (tropaId, ENTER, option Invernada); the legajo of that tropa must open (OQ-065).
export function openLegajoBySearch(tropaId, credentials) {
  loginAsAdmin(credentials)
  AdminSearchPage.searchTropa(tropaId)
  AdminInvernadaLegajoPage.assertOpenedFor(tropaId)
}

const includesInsensitive = (actual, expected) => String(actual).toLowerCase().includes(String(expected).toLowerCase())

// TC-LEG-005: tropa data in the listing div (society without case, OQ-064; "0 Kg" when no weight was loaded, OQ-059).
export function assertListingRow(tropaId, profile, offer) {
  trace('admin: asserting listing row')
  AdminInvernadaOffersPage.society(tropaId).should(($el) => {
    expect(includesInsensitive($el.text(), offer.society), `society "${$el.text().trim()}" contains "${offer.society}"`).to.eq(true)
  })
  AdminInvernadaOffersPage.quantity(tropaId).should('contain.text', profile.quantity)
  AdminInvernadaOffersPage.category(tropaId).should('contain.text', profile.category)
  AdminInvernadaOffersPage.weight(tropaId).should('contain.text', profile.minimal ? T.ZERO_WEIGHT : profile.weight)
  AdminInvernadaOffersPage.establishment(tropaId).should(($el) => {
    expect(includesInsensitive($el.text(), offer.establishment) || includesInsensitive(offer.establishment, $el.text().trim()),
      `establishment "${$el.text().trim()}" vs "${offer.establishment}"`).to.eq(true)
  })
}

// Expected label/value pairs: loaded values come from the profile and the chosen
// options; unloaded ones are the defaults confirmed by QA (OQ-057 to OQ-061).
export function expectedLegajoValues(profile, offer) {
  const unit = CATEGORY_UNIT[profile.category]
  const isCows = profile.category === CATEGORIES.COWS_WITH_CALF
  const isCalves = profile.category === CATEGORIES.CALVES
  const isHeiferCalves = profile.category === CATEGORIES.HEIFER_CALVES
  const radios = profile.radios || []
  const yesNo = (id) => (radios.includes(id) ? T.YES : T.NO)
  const today = todayText()
  const entries = [
    { label: L.REQUEST_DATE, expected: { contains: today } },
    { label: L.REVIEW_DATE, expected: T.NOT_REVIEWED },
    { label: L.BREED_1, expected: offer.breeds[0] },
    { label: L.BREED_2, expected: offer.breeds[1] || T.NOT_SPECIFIED },
    { label: L.BREED_3, expected: T.NOT_SPECIFIED },
    { label: L.CATEGORY, expected: profile.category },
    { label: L.SALE_TERM, expected: offer.saleTerm },
  ]

  if (profile.minimal) {
    entries.push(
      { label: L.WEIGHT, expected: '0' },
      { label: L.AVERAGE_WEIGHT, expected: T.ZERO_WEIGHT },
      { label: L.AGE, expected: `0 ${unit}` },
      { label: L.NUTRITION, expected: T.NO_DATA },
      { label: L.LIQUID_BRAND, expected: T.NO },
      { label: L.TICK, expected: T.NO },
      { label: L.MIO_MIO, expected: T.NO },
      { label: L.ZONE, expected: T.CLEAN_ZONE },
      { label: L.BODY_CONDITION, expected: '' },
      { label: L.QUALITY, expected: '' },
      { label: L.HEALTH, expected: '' },
      { label: L.UNIFORMITY, expected: '' },
      { label: L.WEIGHING_AT, expected: T.NOT_SPECIFIED },
    )
    if (isCalves) {
      entries.push(
        { label: L.WEANED, expected: T.NO }, { label: L.WEANING_DATE, expected: T.NOT_LOADED_DATE },
        { label: L.CASTRATED, expected: T.NO }, { label: L.CASTRATION_DATE, expected: T.NOT_LOADED_DATE },
        { label: L.DISCARD, expected: '' }, { label: L.SHRINK, expected: '' }, { label: L.DISTANCE, expected: '' },
      )
    }
    if (isCows) {
      entries.push(
        { label: L.TEETH, expected: T.NOT_SPECIFIED_LOWER }, { label: L.HERD_TYPE, expected: T.HERD_TYPE_PLACEHOLDER },
        { label: L.CALF_AGE, expected: '' }, { label: L.CALF_WEIGHT, expected: '' },
        { label: L.UNIFORMITY, position: 1, expected: '' },
      )
    }
    return entries
  }

  const t = profile.texts
  entries.push(
    { label: L.WEIGHT, expected: profile.weight },
    { label: L.AVERAGE_WEIGHT, expected: `${profile.weight} Kg` },
    { label: L.AGE, expected: `${t.in_edad} ${unit}` },
    { label: L.NUTRITION, expected: profile.selects.in_tratamiento_nutricional },
    { label: L.LIQUID_BRAND, expected: yesNo('si_marca') },
    { label: L.TICK, expected: yesNo('si_garrapata') },
    { label: L.MIO_MIO, expected: yesNo('si_miomio') },
    { label: L.ZONE, expected: radios.includes('lucha') ? 'Lucha' : radios.includes('sucia') ? 'Sucia' : T.CLEAN_ZONE },
    { label: L.BODY_CONDITION, expected: profile.bodyCondition },
    { label: L.QUALITY, expected: profile.quality },
    { label: L.HEALTH, expected: T.HEALTH_VERY_GOOD },
    { label: L.DISCARD, expected: t.in_descarte },
  )
  if (isHeiferCalves) {
    entries.push(
      { label: L.WEANED, expected: yesNo('destetados') },
      // TC-LEG-008: the weaning date is today's date.
      { label: L.WEANING_DATE, expected: today },
      { label: L.UNIFORMITY, expected: T.UNIFORM },
      { label: L.SHRINK, expected: t.in_desbaste },
      { label: L.DISTANCE, expected: t.in_distancia_pesada },
      // OQ-062 (open): observed value, not a rule.
      { label: L.WEIGHING_AT, expected: T.WEIGHING_AT_SOCIETY },
    )
  }
  if (isCows) {
    entries.push(
      { label: L.TEETH, expected: profile.selects.in_denticion },
      { label: L.HERD_TYPE, expected: profile.selects.in_tipo_rodeo },
      // TC-LEG-009: data of the calf (age, weight, uniformity); the first "Uniformidad:" is the calf's.
      { label: L.CALF_AGE, expected: t.in_edad_cria },
      { label: L.CALF_WEIGHT, expected: t.in_peso_promedio_cria },
      { label: L.UNIFORMITY, position: 0, expected: T.UNEVEN },
      { label: L.UNIFORMITY, position: 1, expected: T.UNIFORM },
      { label: L.SHRINK, expected: '' },
      { label: L.DISTANCE, expected: '' },
      { label: L.WEIGHING_AT, expected: T.NOT_SPECIFIED },
    )
  }
  return entries
}

function expectedSegmentation(profile) {
  return SEGMENTATION_PARTS.flatMap((part) => [
    { part, label: L.SEGMENTATION_WEIGHT, expected: profile.segmentation[`in_${part}_peso`] },
    { part, label: L.SEGMENTATION_QUANTITY, expected: profile.segmentation[`in_${part}_cantidad`] },
  ])
}

// TC-LEG-004/006/007/008/009 and TC-LEG-001..003: the whole legajo against what was loaded.
export function assertLegajoMatches(profile, offer, tropaId) {
  trace('admin: comparing legajo')
  AdminInvernadaLegajoPage.assertOpenedFor(tropaId)
  AdminInvernadaLegajoPage.assertSuggestedQuantity(profile.quantity)
  AdminInvernadaLegajoPage.assertSociety(offer.society)
  AdminInvernadaLegajoPage.assertValues(expectedLegajoValues(profile, offer))
  // Loaded segmentation: weight and quantity of Cabeza, Cuerpo and Cola (minimal profiles load none).
  if (!profile.minimal) AdminInvernadaLegajoPage.assertSegmentation(expectedSegmentation(profile))
  // OQ-061: fields that do not belong to the category must not be shown.
  AdminInvernadaLegajoPage.assertLabelsAbsent(ABSENT_LABELS[profile.category] || [])

  if (profile.minimal) {
    // TC-LEG-006: nothing was loaded, so no video and the default clarification message.
    AdminInvernadaLegajoPage.assertClarification(T.NO_CLARIFICATION)
    AdminInvernadaLegajoPage.assertNoMultimedia()
    return
  }
  // TC-LEG-007: client clarification and the video (1 video + 6 images, all hidden, OQ-063).
  AdminInvernadaLegajoPage.assertClarification(offer.clarification)
  if (profile.radios.includes('si_plan')) AdminInvernadaLegajoPage.assertPlanSanitary()
  AdminInvernadaLegajoPage.assertMultimedia(EXPECTED_MEDIA)
}
