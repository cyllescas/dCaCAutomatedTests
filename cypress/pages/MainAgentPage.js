class MainAgentPage{
    mainTopNavbar(){
        return cy.get('#top')
    }
    mainBody(){
        return cy.get('#new_wraper', { timeout: 60000 });
    }
    mainTitleTendenciasDelMercado(){
        return cy.get('.contenedor_primario_escritorio > .titulo_secciones_home', { timeout: 60000 });
    }

}
export default new MainAgentPage();