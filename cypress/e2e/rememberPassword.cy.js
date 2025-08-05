describe('Recuperar Senha', () => {

    beforeEach( () => {
        cy.visit('/')
    })

    it('Recuperar Senha com e-mail válido deve enviar e-mail de recuperação', () => { 
        cy.get('#forgot-password-link').click()
        cy.get('#forgot-password-modal').contains('Recuperar Senha').should('be.visible')
        cy.fixture('email').then(email => {
            cy.get('#recovery-email').click({ force: true }).type(email.valido.email, { force: true }) 
        })
        cy.contains('button', 'Enviar').click()
        cy.contains('div.message.success', 'Email de recuperação enviado').should('be.visible')
    })

    it('Recuperar Senha com e-mail em formato inválido deve apresentar mensagem de erro', () => { 
        cy.get('#forgot-password-link').click()
        cy.get('#forgot-password-modal').contains('Recuperar Senha').should('be.visible')
        cy.fixture('email').then(email => {
            cy.get('#recovery-email').click({ force: true }).type(email.formatoInvalido.email, { force: true }) 
        })
        cy.contains('button', 'Enviar').click()
        cy.contains('div.message.error', 'Por favor, digite um email válido').should('be.visible')
    })

})