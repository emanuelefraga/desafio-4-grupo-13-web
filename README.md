# Sistema Acadêmico - Frontend

## Descrição

Frontend para o sistema de Login Acadêmico - Sistema Universitário, desenvolvido para estudos de teste de software. Este projeto consome a API REST desenvolvida em JavaScript com Express para autenticação de usuários em um sistema acadêmico universitário.

## Funcionalidades

- ✅ **Login com sucesso**: Autenticação válida de usuários
- ✅ **Login inválido**: Tratamento de credenciais incorretas
- ✅ **Bloqueio de conta**: Bloqueia a conta após 3 tentativas de login inválidas
- ✅ **Lembrar senha**: Funcionalidade para recuperação de senha

## Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura da página
- **CSS3** - Estilização com MaterializeCSS
- **JavaScript (ES6+)** - Lógica do frontend
- **MaterializeCSS** - Framework CSS para design responsivo

## Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd desafio-4-grupo13-web
```

2. Instale as dependências:
```bash
npm install
```

## Executando o Projeto

```bash
npm start
```

O servidor será iniciado na porta 3002 por padrão.

## Acessando o Site

Após iniciar o servidor, acesse:
```
http://localhost:3002
```

## Dados de Teste

### Usuários Cadastrados (em memória - na API)

1. **Aluno 1**
   - Email: `aluno1@universidade.edu.br`
   - Senha: `123456`
   - Tipo: `aluno`
   - Curso: `Engenharia de Software`

2. **Aluno 2**
   - Email: `aluno2@universidade.edu.br`
   - Senha: `654321`
   - Tipo: `aluno`
   - Curso: `Ciência da Computação`

3. **Aluno 3**
   - Email: `aluno3@universidade.edu.br`
   - Senha: `987654`
   - Tipo: `aluno`
   - Curso: `Sistemas de Informação`

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

## Funcionalidades do Frontend

### Página de Login
- Formulário de login com validação
- Informações de teste para facilitar os testes
- Link para recuperação de senha

### Modal de Recuperação de Senha
- Formulário para solicitar recuperação de senha
- Validação de email
- Feedback visual do processo

### Dashboard
- Informações pessoais do usuário
- Informações acadêmicas (curso, semestre, departamento)
- Lista de disciplinas baseada no curso
- Botão de logout

## Testes

Este projeto foi desenvolvido para estudos de teste de software. Os cenários de teste incluem:

### Cenários de Login
- Login com credenciais válidas
- Login com senha incorreta
- Bloqueio de conta após 3 tentativas

### Cenários de Recuperação de Senha
- Solicitação com email válido
- Solicitação com email formato inválido
- Solicitação com email inválido
- Solicitação com email vazio


### Estrutura de Arquivos

- `server.js` - Configuração do servidor Express e rotas da API
- `public/index.html` - Estrutura HTML da aplicação
- `public/css/style.css` - Estilos customizados
- `public/js/app.js` - Lógica JavaScript do frontend

## Contribuição

Este projeto foi desenvolvido para estudos de teste de software. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

MIT

## Créditos

Este projeto foi desenvolvido em grupo durante a mentoria de [Julio de Lima].

**Participantes do grupo:**
- [Ana Cláudia Coelho](https://github.com/acnscoelho)
- [Emanuele Fraga](https://github.com/emanuelefraga)
- [Ludmila Ávila](https://github.com/ludmilavila)
- [Wedney Silva](https://github.com/Wedney18)

## Observações Importantes

⚠️ **ATENÇÃO**: Este projeto é destinado apenas para estudos de teste de software. Não utilize em ambiente de produção.

- Dados armazenados em memória (não persistem após reinicialização)
- Sem validações robustas de produção
- Configurações de segurança básicas para demonstração
- Interface desenvolvida para facilitar testes automatizados 
