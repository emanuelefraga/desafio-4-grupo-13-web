const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Dados mockados compartilhados (em memória - resetados a cada reinicialização)
let usuarios = [
    { 
        id: 1, 
        nome: 'Aluno 1', 
        email: 'aluno1@universidade.edu.br', 
        senha: '123456', 
        tipo: 'aluno', 
        curso: 'Engenharia de Software',
        tentativas: 0,
        bloqueado: false
    },
    { 
        id: 2, 
        nome: 'Aluno 2', 
        email: 'aluno2@universidade.edu.br', 
        senha: '654321', 
        tipo: 'aluno', 
        curso: 'Ciência da Computação',
        tentativas: 0,
        bloqueado: false
    },
    { 
        id: 3, 
        nome: 'Aluno 3', 
        email: 'aluno3@universidade.edu.br', 
        senha: '987654', 
        tipo: 'aluno', 
        curso: 'Sistemas de Informação',
        tentativas: 0,
        bloqueado: false
    }
];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para login
app.post('/api/auth/login', (req, res) => {
    const { email, senha } = req.body;
    
    console.log(`\n=== TENTATIVA DE LOGIN ===`);
    console.log(`Email: ${email}`);
    console.log(`Status atual dos usuários:`);
    
    // Log do status atual de todos os usuários
    usuarios.forEach(user => {
        console.log(`- ${user.email}: tentativas=${user.tentativas}, bloqueado=${user.bloqueado}`);
    });
    
    const usuario = usuarios.find(u => u.email === email);
    
    if (!usuario) {
        return res.status(401).json({
            success: false,
            message: 'Email não encontrado!'
        });
    }
    
    if (usuario.bloqueado) {
        return res.status(401).json({
            success: false,
            message: 'Conta bloqueada devido a múltiplas tentativas de login inválidas!'
        });
    }
    
    if (usuario.senha !== senha) {
        console.log(`\n--- SENHA INCORRETA ---`);
        console.log(`Tentativas ANTES: ${usuario.tentativas}`);
        
        usuario.tentativas += 1;
        
        console.log(`Tentativas DEPOIS: ${usuario.tentativas}`);
        console.log(`Tentativas restantes: ${3 - usuario.tentativas}`);
        
        if (usuario.tentativas >= 3) {
            usuario.bloqueado = true;
            console.log(`🚨 CONTA BLOQUEADA para ${email}!`);
            return res.status(401).json({
                success: false,
                message: 'Conta bloqueada após 3 tentativas inválidas!'
            });
        }
        
        console.log(`⚠️ Tentativa incorreta para ${email}. Tentativas atuais: ${usuario.tentativas}, Restantes: ${3 - usuario.tentativas}`);
        return res.status(401).json({
            success: false,
            message: `Senha incorreta! Tentativas restantes: ${3 - usuario.tentativas}`
        });
    }
    
    // Login bem-sucedido - reset das tentativas
    console.log(`\n✅ LOGIN BEM-SUCEDIDO para ${email}`);
    console.log(`Resetando tentativas de ${usuario.tentativas} para 0`);
    
    usuario.tentativas = 0;
    
    res.json({
        success: true,
        message: 'Login realizado com sucesso!',
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
            curso: usuario.curso
        }
    });
});

// Rota para lembrar senha
app.post('/api/auth/remember-password', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email é obrigatório!'
        });
    }
    
    // Usando dados compartilhados
    
    const usuario = usuarios.find(u => u.email === email);
    
    if (!usuario) {
        return res.status(404).json({
            success: false,
            message: 'Email não encontrado no sistema!'
        });
    }
    
    res.json({
        success: true,
        message: `Email enviado para ${email} com instruções para redefinir a senha.`
    });
});

// Rota para verificar status da conta
app.get('/api/auth/status', (req, res) => {
    const { email } = req.query;
    
    console.log(`\n=== VERIFICANDO STATUS ===`);
    console.log(`Email consultado: ${email}`);
    
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email é obrigatório!'
        });
    }
    
    // Usando dados compartilhados (agora as tentativas são persistidas!)
    
    const usuario = usuarios.find(u => u.email === email);
    
    if (!usuario) {
        return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado!'
        });
    }
    
    const status = {
        email: usuario.email,
        tentativas: usuario.tentativas,
        bloqueado: usuario.bloqueado,
        tentativasRestantes: usuario.bloqueado ? 0 : 3 - usuario.tentativas
    };
    
    console.log(`Status retornado:`, status);
    
    res.json({
        success: true,
        status: status
    });
});

// Rota para logout
app.post('/api/auth/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logout realizado com sucesso!'
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`✅ Dados compartilhados entre rotas - tentativas agora são persistidas durante a sessão!`);
    console.log(`⚠️  ATENÇÃO: Dados ainda são resetados a cada reinicialização do servidor`);
    console.log(`📝 Para persistência permanente, implemente banco de dados ou arquivo JSON`);
}); 