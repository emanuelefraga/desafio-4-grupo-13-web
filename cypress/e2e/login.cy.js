describe('Login', () => {
  it('Login com senha inválida não deve permitir entrada no sistema', () => {
    // Arrange
    cy.visit('/')

    // Act
    cy.fixture('credenciais').then(credenciais => {
      cy.get(':nth-child(1) > .input-field > label').click().type(credenciais.invalida.email)
      cy.get(':nth-child(2) > .input-field > label').click().type(credenciais.invalida.senha)
      })
    cy.get('.col > .btn').click()
    
    // Assert
      cy.get('.message')
      .invoke('text')
      .then((text) => {
      const mensagem = text.trim();
      const match = mensagem.match(/Tentativas restantes: (\d+)/)

    if (match) {
      const tentativas = match[1]
      const mensagemEsperada = `Senha incorreta! Tentativas restantes: ${tentativas}`
      expect(mensagem).to.eq(mensagemEsperada);
    } else {
      // Valida se a mensagem é a de conta bloqueada
      expect(mensagem).to.eq('Conta bloqueada após 3 tentativas inválidas!')
    }
   })
  })
})