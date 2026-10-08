class MainCommercialPartnerPage{
    mainBody(){
        return cy.get('#contenedor_left', {timeout: 60000})
    }
    mainBrowserBar(){
        return cy.get('#li_busca > [name="busca"]', {timeout: 60000});
    }
    navbar(){
        return cy.get('nav#navbar', {timeout: 60000})
    }
    logoutLink(){
        return cy.get('a.logout_azul', {timeout: 60000})
    }
    societiesSection(){
        return cy.get('#app-gestion_sociedades', {timeout: 60000})
    }
    liveBoard(){
        return cy.get('table#liveBoard')
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