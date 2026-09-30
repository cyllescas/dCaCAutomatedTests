class MainCommercialPartnerPage{
    mainBody(){
        return cy.get('#contenedor_left', {timeout: 6000})
    }
    mainBrowserBar(){
        return cy.get('#li_busca > [name="busca"]', {timeout: 6000});
    }
    mainCrearUsuarioButton(){
        return cy.get('.link_crear_usuario')
    }
    mainCrearmainCompanyButton(){
        return cy.get('.link_crear_lote')
    }
    mainCriteriaBrowserBar(){
        return cy.get('#criterioBusqueda')
    }
    mainHeaderTable(){
        cy.get('.listado_head._boot > .row')
    }
    mainTableBody(){
        cy.get('#mainCompany_85031 > :nth-child(1)')
    }
    mainCompaniesList() {
        return cy.get('.listado_body.fila._boot')
    }

    mainCompany(index = 0) {
        return this.mainCompaniesList().eq(index)
    }

    mainCompanyName(index = 0) {
        return this.mainCompany(index).find('.mainCompany a')
    }

    mainIdCompany(index = 0) {
        return this.mainCompany(index).find('.id')
    }


        
}

export default new MainCommercialPartnerPage()