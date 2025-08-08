# Sistema Acadêmico - Testes Automatizados com Cypress

## Objetivo

Este projeto foi desenvolvido em grupo durante a Mentoria 2.0 de Julio de Lima, com o objetivo de reforçar o aprendizado de automação de testes utilizando Cypress e JavaScript. O foco é validar funcionalidades essenciais do sistema acadêmico universitário, garantindo a qualidade do frontend e da API REST.

## Componentes do Projeto

O projeto é composto por:

- **Frontend Web**: Aplicação desenvolvida em HTML, CSS (MaterializeCSS) e JavaScript, responsável pela interface do usuário.
- **Testes Automatizados**: Scripts Cypress para automação dos testes end-to-end do sistema.

## Estrutura do Projeto

```
desafio-4-grupo13-web/
├── server.js              # Servidor principal
├── package.json           # Dependências e scripts
├── README.md             # Documentação
└── public/               # Arquivos estáticos
    ├── index.html        # Página principal
    ├── css/
    │   └── style.css     # Estilos customizados
    └── js/
        └── app.js        # Lógica do frontend
```

## Pré-requisitos

- Node.js instalado
- npm instalado

## Instalação e Execução

1. **Clone o repositório do frontend:**
   ```bash
   git clone https://github.com/emanuelefraga/desafio-4-grupo-13-web.git
   cd desafio-4-grupo13-web
   npm install
   ```

2. **Clone o repositório da API:**
   ```bash
   git clone https://github.com/emanuelefraga/desafio-3-grupo-13.git
   cd desafio-3-grupo-13
   npm install
   npm start
   ```
   > A API será executada na porta padrão definida no projeto.

3. **Execute o frontend:**
   ```bash
   cd desafio-4-grupo13-web
   npm start
   ```
   > O servidor frontend será iniciado na porta 3002 por padrão.

4. **Execute os testes automatizados com Cypress:**
   ```bash
   npx cypress open
   ```
   > Certifique-se de que tanto a API quanto o frontend estejam em execução antes de rodar os testes.

## Documentação dos Testes

Os testes automatizados com Cypress cobrem os seguintes cenários:

### Login

- Login com credenciais válidas
- Login com senha incorreta
- Bloqueio de conta após 3 tentativas inválidas

### Recuperação de Senha

- Solicitação com email válido
- Solicitação com email em formato inválido
- Solicitação com email inexistente
- Solicitação com campo de email vazio

### Dashboard

- Exibição das informações do usuário após login
- Listagem de disciplinas conforme o curso

Os testes estão localizados na pasta `cypress/e2e` do projeto.

## Autores e Participantes

Projeto desenvolvido em grupo durante a Mentoria 2.0 de Julio de Lima.

- [Ana Cláudia Coelho](https://github.com/acnscoelho)
- [Emanuele Fraga](https://github.com/emanuelefraga)
- [Ludmila Ávila](https://github.com/ludmilavila)
- [Wedney Silva](https://github.com/Wedney18)

## Observações Importantes

⚠️ **ATENÇÃO**: Este projeto é destinado apenas para estudos de automação de testes. Não utilize em ambiente de produção.

- Dados armazenados em memória (não persistem após reinicialização)
- Sem validações robustas de produção
- Configurações de segurança básicas para demonstração
- Interface desenvolvida para facilitar testes automatizados