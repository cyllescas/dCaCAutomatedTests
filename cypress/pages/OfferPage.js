class OfferPage{
    offerTitle(){
        return cy.get('#span_titulo')
    }
    offerSubtitle(){
        return cy.get('#subttilo')
    }
    offerText(){
        return cy.get('.texto')
    }
    offerInvernadaButton(){
        return cy.get('#btnInvernada')
    }
    offerFaenaButton(){
        return cy.get('#btnGordo')
    }
}
export default new OfferPage()