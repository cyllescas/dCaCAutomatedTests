class MainAdminPage{

    mainBody(){
        return cy.get('#new_wraper', { timeout: 60000 });
    }
    mainBrowserBar(){
        // The admin header currently renders this control as the visible
        // search textbox with the `Buscar...` placeholder. The old
        // `#li_busca > [name="busca"]` hook is no longer present after login.
        return cy.get('input[placeholder="Buscar..."]', {timeout: 60000});
    }
    navbar(){
        return cy.get('nav#navbar', { timeout: 60000 });
    }
    logoutLink(){
        return cy.get('a.logout_azul', { timeout: 60000 });
    }
    liveBoard(){
        return cy.get('table#liveBoard', { timeout: 60000 });
    }
    mainNav(){
        return cy.get('.nav');
    }
    logoutButton(){
        return cy.get('.logout_azul');
    }
    invernadaDropdownMenu(){
       return cy.get(':nth-child(2) > .dropdown-toggle').contains('INVERNADA');
    }
    faenaDropdownMenu(){
        return cy.get(':nth-child(3) > .dropdown-toggle').contains('FAENA')
    }
    faenaOffersLink(){
        return cy.get('a[href="?ofrecimientos&secc=f&tit=0"]')
    }
    offersSearchField(){
        return cy.get('input[placeholder="Buscar en el listado..."]')
    }
    viewLegajoButton(){
        return cy.contains('Ver legajo', { timeout: 60000 }).should('be.visible')
    }
    magDropdownMenu(){
        return cy.get(':nth-child(4) > .dropdown-toggle').contains('MAG')
    }
    transportesDropdownMenu(){
        return cy.get(':nth-child(5) > .dropdown-toggle').contains('TRANSPORTES')
    }
    ofertasDropdownMenu(){
        return cy.get(':nth-child(6) > .dropdown-toggle').contains('OFERTAS')
    }

    // Métodos
    searchFaenaOffer(lot){
        return this.offersSearchField().clear().type(String(lot)).type('{enter}')
    }
    faenaOfferResult(lot){
        return cy.contains(`#${lot}`, { timeout: 60000 }).should('be.visible')
    }
}
export default new MainAdminPage();
