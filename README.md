# Sistema Acadêmico - Frontend

## Descrição

Frontend para o sistema de Login Acadêmico - Sistema Universitário, desenvolvido para estudos de teste de software. Este projeto consome a API REST desenvolvida em JavaScript com Express para autenticação de usuários em um sistema acadêmico universitário.

## Funcionalidades

- ✅ **Login com sucesso**: Autenticação válida de usuários
- ✅ **Login inválido**: Tratamento de credenciais incorretas
- ✅ **Bloqueio de conta**: Bloqueia a conta após 3 tentativas de login inválidas
- ✅ **Lembrar senha**: Funcionalidade para recuperação de senha
- ✅ **Verificar status da conta**: Consulta o status do usuário (bloqueio, tentativas restantes, etc.)
- ✅ **Dashboard responsivo**: Interface moderna com MaterializeCSS
- ✅ **Persistência de sessão**: Mantém o usuário logado usando localStorage

## Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura da página
- **CSS3** - Estilização com MaterializeCSS
- **JavaScript (ES6+)** - Lógica do frontend
- **MaterializeCSS** - Framework CSS para design responsivo

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **CORS** - Cross-Origin Resource Sharing
- **Body Parser** - Parsing de requisições

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

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

O servidor será iniciado na porta 3002 por padrão.

## Acessando o Site

Após iniciar o servidor, acesse:
```
http://localhost:3002
```

## Endpoints da API

### Base URL
```
http://localhost:3002
```

### Endpoints Disponíveis

- `POST /api/auth/login` - Realizar login
- `POST /api/auth/remember-password` - Solicitar lembrança de senha
- `GET /api/auth/status` - Verificar status da conta
- `POST /api/auth/logout` - Realizar logout

## Dados de Teste

### Usuários Cadastrados (em memória)

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
- Verificação automática do status da conta

### Modal de Recuperação de Senha
- Formulário para solicitar recuperação de senha
- Validação de email
- Feedback visual do processo

### Dashboard
- Informações pessoais do usuário
- Informações acadêmicas (curso, semestre, departamento)
- Lista de disciplinas baseada no curso
- Botão de logout

### Recursos Visuais
- Design responsivo com MaterializeCSS
- Animações suaves
- Mensagens de feedback (sucesso, erro, aviso)
- Loading spinners durante requisições
- Gradiente de fundo moderno

## Segurança

- Validação de formulários no frontend
- Sanitização de dados
- Feedback de segurança (tentativas restantes, bloqueio de conta)
- Persistência segura de sessão no localStorage

## Testes

Este projeto foi desenvolvido para estudos de teste de software. Os cenários de teste incluem:

### Cenários de Login
- Login com credenciais válidas
- Login com senha incorreta
- Login com email inexistente
- Bloqueio de conta após 3 tentativas
- Verificação de status da conta

### Cenários de Recuperação de Senha
- Solicitação com email válido
- Solicitação com email inválido
- Solicitação com email vazio

### Cenários de Interface
- Responsividade em diferentes dispositivos
- Validação de formulários
- Feedback visual de ações
- Persistência de sessão

## Desenvolvimento

### Scripts Disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon

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