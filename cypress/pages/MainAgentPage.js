class MainAgentPage{
    mainTopNavbar(){
        return cy.get('#top')
    }
    topBanner(){
        return cy.get('.top-banner', { timeout: 60000 })
    }
    userMenu(){
        return cy.get('#div_log_out', { timeout: 60000 })
    }
    clientsNavLink(){
        return cy.get('a[href="/__dcac/misClientes"]', { timeout: 60000 })
    }
    mainBody(){
        return cy.get('#new_wraper', { timeout: 60000 });
    }
    mainTitleTendenciasDelMercado(){
        return cy.get('.contenedor_primario_escritorio > .titulo_secciones_home', { timeout: 60000 });
    }

}
export default new MainAgentPage();