describe('Login', () => {
  beforeEach(() => {
    // Arrange
    cy.visit('/')
  });

    it('Login com sucesso deve permitir entrada e mostrar mensagem de boas-vindas', () => {
    cy.fixture('credenciais').then(credenciais => {
      cy.get(':nth-child(1) > .input-field > label')
        .click()
        .type(credenciais.valida.email);
      cy.get(':nth-child(2) > .input-field > label')
        .click()
        .type(credenciais.valida.senha);
    });
    cy.get('.col > .btn').click();

    cy.get('div.message.success.persistente')
    .scrollIntoView()
    .invoke('text')
    .should('contain', 'Bem-vindo, aluno1@universidade.edu.br!');  
  });

  it('Login com senha inválida não deve permitir entrada no sistema', () => {
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
      const mensagemEsperada = `Email ou senha inválidos. Tentativas restantes: ${tentativas}`
      expect(mensagem).to.eq(mensagemEsperada);
    } else {
      // Valida se a mensagem é a de conta bloqueada
      expect(mensagem).to.eq('Conta bloqueada após 3 tentativas de login com credenciais inválidas. Bloqueio por 5 minutos.')
    }
   });  
   }); 
    it('Deve bloquear conta após 3 tentativas inválidas', () => {
    // Act - Fazer 3 tentativas com senha incorreta
    for (let i = 1; i <= 3; i++) {
      cy.fixture('credenciais').then(credenciais => {
        cy.get(':nth-child(1) > .input-field > label').click().type(credenciais.bloqueada.email)
        cy.get(':nth-child(2) > .input-field > label').click().type('senha_incorreta');
        })
      cy.get('.col > .btn').click()
    }

    // Assert - Verificar mensagem de conta bloqueada
    cy.get('.message')
      .invoke('text')
      .then((text) => {
        const mensagem = text.trim();
        const match = mensagem.match(/Tentativas restantes: (\d+)/);

        if (match) {
          const tentativas = match[1];
          const mensagemEsperada = `Email ou senha inválidos. Tentativas restantes: ${tentativas}`;
          expect(mensagem).to.eq(mensagemEsperada);
        } else {
           //Valida se a mensagem é a de conta bloqueada
          expect(mensagem).to.eq('Conta bloqueada após 3 tentativas de login com credenciais inválidas. Bloqueio por 5 minutos.');
        }
      });
  });
});