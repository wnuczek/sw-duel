describe('My First Test', () => {
	it('Initial page has SW Duel title', () => {
		cy.visit('/');
		cy.contains('SW Duel');
	});

	it('Initial page has No duels played info', () => {
		cy.visit('/');
		cy.contains('No duels played');
	});

	it('Play button loads people data', () => {
		cy.visit('/');
		const playButton = cy.get('#play-button');
		playButton.click();
		playButton.should('be.disabled');
		// cy.contains('Duel in progress').should('');
	});
});
