describe('Login Acadêmico', () => {
  let credenciais;

  beforeEach(() => {
    cy.fixture('credenciais').then((data) => {
      credenciais = data;
    });
    cy.visit('/');
  });

  it('Login com credenciais válidas deve permitir entrada no sistema', () => {
    // Arrange
    const { email, senha } = credenciais.valida;

    // Act
    cy.get(':nth-child(1) > .input-field > label').click().type(email);
    cy.get(':nth-child(2) > .input-field > label').click().type(senha);
    cy.get('.col > .btn').click();

    // Assert
    cy.get('.message')
      .invoke('text')
      .then((text) => {
        const mensagem = text.trim();
        const mensagemEsperada = `Bem-vindo, ${email}!`;
        expect(mensagem).to.eq(mensagemEsperada);
      });
  });

  it('Login com senha inválida não deve permitir entrada no sistema', () => {
    // Arrange
    const { email, senha } = credenciais.invalida;

    cy.get(':nth-child(1) > .input-field > label').click().type(email);
    cy.get(':nth-child(2) > .input-field > label').click().type(senha);
    cy.get('.col > .btn').click();

    // Assert
    cy.get('.message')
      .invoke('text')
      .then((text) => {
        const mensagem = text.trim();
        const match = mensagem.match(/Tentativas restantes: (\d+)/);

        if (match) {
          const tentativas = match[1];
          const mensagemEsperada = `Senha incorreta! Tentativas restantes: ${tentativas}`;
          expect(mensagem).to.eq(mensagemEsperada);
        } else {
          // Valida se a mensagem é a de conta bloqueada
          expect(mensagem).to.eq('Conta bloqueada após 3 tentativas inválidas!');
        }
      });
  });

  it('Deve bloquear conta após 3 tentativas inválidas', () => {
    // Act - Fazer 3 tentativas com senha incorreta
    for (let i = 0; i < 3; i++) {
        cy.get(':nth-child(1) > .input-field > label').click().type(credenciais.bloqueada.email);
        cy.get(':nth-child(2) > .input-field > label').click().type('senha_incorreta');
        cy.get('.col > .btn').click();
    }

    // Assert - Verificar mensagem de conta bloqueada
    cy.get('.message')
      .invoke('text')
      .then((text) => {
        const mensagem = text.trim();
        expect(mensagem).to.eq('Conta bloqueada após 3 tentativas inválidas!');
      });
  });

  it('Deve mostrar erro para email não encontrado', () => {
    // Act
    const emailInvalido = 'email_inexistente@universidade.edu.br';
    const senha = '123456';

    cy.get(':nth-child(1) > .input-field > label').click().type(emailInvalido);
    cy.get(':nth-child(2) > .input-field > label').click().type(senha);
    cy.get('.col > .btn').click();

    // Assert
    cy.get('.message')
      .invoke('text')
      .then((text) => {
        const mensagem = text.trim();
        expect(mensagem).to.eq('Email não encontrado!');
      });
  });
});