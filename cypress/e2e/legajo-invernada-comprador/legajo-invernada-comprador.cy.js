import InvernadaBuyerLegajoPage from '../../pages/InvernadaBuyerLegajoPage'
import {
  credentialsFor,
  loginWithSession,
  skipWhenCredentialsAreMissing,
  verifyLoginSuccessAsAdmin,
} from '../../support/helpers/login_helper'

describe('Legajo de Invernada: usuario comprador @invernada @legajo @comprador @admin @regression @smoke', () => {
  const adminCredentials = credentialsFor('TEST_ADMIN_USERNAME', 'TEST_ADMIN_PASSWORD')

  beforeEach(function () {
    skipWhenCredentialsAreMissing(this, adminCredentials, 'admin')
    InvernadaBuyerLegajoPage.visitAdmin()
    loginWithSession(adminCredentials.username, adminCredentials.password, 'admin')
    verifyLoginSuccessAsAdmin()
    InvernadaBuyerLegajoPage.openInvernadaMenu()
    InvernadaBuyerLegajoPage.openSoldInvernada()
    InvernadaBuyerLegajoPage.openFirstLegajo()
  })

  it('INV-COMP-001 edita y guarda un usuario comprador', () => {
    InvernadaBuyerLegajoPage.editBuyer()
    InvernadaBuyerLegajoPage.openBuyerUserPicker()
    InvernadaBuyerLegajoPage.selectFirstAssignedBuyer()
    InvernadaBuyerLegajoPage.saveAndAssertSelectedBuyerIsDisplayed()
  })

  it('INV-COMP-002 guarda la opción Sin definir', () => {
    InvernadaBuyerLegajoPage.editBuyer()
    InvernadaBuyerLegajoPage.openBuyerUserPicker()
    InvernadaBuyerLegajoPage.selectUnassignedBuyer()
    InvernadaBuyerLegajoPage.saveBuyerEdit()
    InvernadaBuyerLegajoPage.buyerSectionTitle().should('be.visible')
    InvernadaBuyerLegajoPage.readOnlyBuyerValue().should('contain', 'No disponible')
  })

  it('INV-COMP-003 navega desde la información del usuario comprador', () => {
    InvernadaBuyerLegajoPage.openBuyerInfo()
    cy.url().should('include', 'pag=usuario')
    InvernadaBuyerLegajoPage.userProfileHeading().should('be.visible')
  })

  it('INV-COMP-004 mantiene la integridad al cancelar y guardar', () => {
    InvernadaBuyerLegajoPage.editBuyer()
    InvernadaBuyerLegajoPage.openBuyerUserPicker()
    InvernadaBuyerLegajoPage.selectFirstAssignedBuyer()
    InvernadaBuyerLegajoPage.cancelBuyerEdit()
    InvernadaBuyerLegajoPage.editBuyer()
    InvernadaBuyerLegajoPage.selectedBuyerText().should('not.eq', 'Sin definir')
    InvernadaBuyerLegajoPage.openBuyerUserPicker()
    InvernadaBuyerLegajoPage.selectUnassignedBuyer()
    InvernadaBuyerLegajoPage.saveBuyerEdit()
    InvernadaBuyerLegajoPage.buyerSectionTitle().should('be.visible')
  })
})
