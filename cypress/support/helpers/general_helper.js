export function wait_for_page_load() {
  cy.window().should((win) => {
    expect(win.document.readyState).to.eq('complete')
  })
}