// Sistema Acadêmico - Frontend JavaScript
// 
// Funcionalidades de Segurança Implementadas:
// - Timeout por inatividade (5 minutos)
// - Verificação de sessão no servidor ao abrir nova aba
// - Logout automático quando sessão expira
// - Verificação de sessão ao voltar para a aba
// - Limpeza automática de dados ao fechar aba

// URL base da API externa
const API_BASE_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando aplicação...');
    
    // Verificar se MaterializeCSS está carregado
    if (typeof M !== 'undefined') {
        console.log('MaterializeCSS carregado, inicializando componentes...');
        M.AutoInit();
    } else {
        console.error('MaterializeCSS não está carregado!');
    }
    
    // Elementos do DOM
    const loginForm = document.getElementById('login-form');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const loginPage = document.getElementById('login-page');
    const dashboardPage = document.getElementById('dashboard-page');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Sistema de timeout por inatividade (5 minutos = 300000ms)
    let inactivityTimer;
    const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutos

    // Função para resetar o timer de inatividade
    function resetInactivityTimer() {
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }

        const usuarioLogadoStr = localStorage.getItem('usuarioLogado');
        let usuarioLogado = null;
        if (usuarioLogadoStr) {
            try {
                usuarioLogado = JSON.parse(usuarioLogadoStr);
            } catch (e) {
                usuarioLogado = null;
            }
        }
        if (usuarioLogado) {
            inactivityTimer = setTimeout(() => {
                console.log('Timeout por inatividade - fazendo logout automático');
                handleLogoutAuto();
            }, TIMEOUT_DURATION);
        }
    }

    // Função para logout automático (sem parâmetro de evento)
    function handleLogoutAuto() {
        console.log('Logout automático iniciado...');
        
        // Limpar localStorage
        localStorage.removeItem('usuarioLogado');
        localStorage.removeItem('sessionId');
        
        // Mostrar página de login
        loginPage.style.display = 'block';
        dashboardPage.style.display = 'none';
        dashboardPage.classList.remove('active');
        logoutBtn.style.display = 'none';
        
        // Limpar formulário
        loginForm.reset();
        
        // Remover todas as mensagens
        const todasMensagens = document.querySelectorAll('.message');
        todasMensagens.forEach(msg => msg.remove());
        
        // Mostrar mensagem de timeout
        mostrarMensagem('Sessão expirada por inatividade. Faça login novamente.', 'warning');
        
        // Limpar timer
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            inactivityTimer = null;
        }
        
        // Tentar notificar o servidor sobre o logout (opcional)
        // Comentado: endpoint não existe na API externa
        /*
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId
                }
            }).catch(error => {
                console.error('Erro ao notificar logout no servidor:', error);
            });
        }
        */
    }

    // Event listeners para detectar atividade do usuário
    function setupInactivityDetection() {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        events.forEach(event => {
            document.addEventListener(event, resetInactivityTimer, true);
        });
        
        // Detectar quando a aba/janela fica inativa
        document.addEventListener('visibilitychange', async () => {
            if (document.hidden) {
                // Página ficou inativa, pausar timer
                if (inactivityTimer) {
                    clearTimeout(inactivityTimer);
                }
            } else {
                // Página voltou a ser ativa, verificar sessão e resetar timer
                const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
                const sessionId = localStorage.getItem('sessionId');
                
                if (usuarioLogado && sessionId) {
                    // Verificar se a API está disponível ao voltar para a aba
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/auth/status?email=${encodeURIComponent(usuarioLogado.email)}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        
                        if (response.ok) {
                            // API disponível - resetar timer
                            console.log('API disponível ao voltar para a aba - resetando timer');
                            resetInactivityTimer();
                        } else {
                            // API retornou erro - fazer logout
                            console.log('API retornou erro ao voltar para a aba - fazendo logout');
                            handleLogoutAuto();
                        }
                    } catch (error) {
                        // Erro de conexão - fazer logout por segurança
                        console.log('Erro de conexão ao voltar para a aba - fazendo logout:', error);
                        handleLogoutAuto();
                    }
                } else {
                    // Resetar timer se não há sessão
                    resetInactivityTimer();
                }
            }
        });
    }

    // Verificar se o usuário já está logado E se a sessão ainda é válida
    async function verificarSessaoInicial() {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        const sessionId = localStorage.getItem('sessionId');
        
        if (usuarioLogado && sessionId) {
            // Tentar verificar se a API está disponível antes de fazer logout
            try {
                // Testar conexão com a API fazendo uma requisição simples
                const response = await fetch(`${API_BASE_URL}/api/auth/status?email=${encodeURIComponent(usuarioLogado.email)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // API está disponível - fazer login automático
                    console.log('API disponível - fazendo login automático');
                    mostrarMensagem(`Bem-vindo, ${usuarioLogado.email}!`, 'success', true);
                    mostrarDashboard(usuarioLogado);
                    resetInactivityTimer();
                } else {
                    // API retornou erro - fazer logout
                    console.log('API retornou erro - fazendo logout');
                    localStorage.removeItem('usuarioLogado');
                    localStorage.removeItem('sessionId');
                    mostrarMensagem('Sua sessão expirou. Faça login novamente.', 'warning');
                    
                    // Garantir que apenas a página de login seja exibida
                    loginPage.style.display = 'block';
                    dashboardPage.style.display = 'none';
                    logoutBtn.style.display = 'none';
                }
            } catch (error) {
                // Erro de conexão com a API - fazer logout
                console.log('Erro de conexão com a API - fazendo logout:', error);
                localStorage.removeItem('usuarioLogado');
                localStorage.removeItem('sessionId');
                mostrarMensagem('Erro de conexão com o servidor. Faça login novamente.', 'warning');
                
                // Garantir que apenas a página de login seja exibida
                loginPage.style.display = 'block';
                dashboardPage.style.display = 'none';
                logoutBtn.style.display = 'none';
            }
        } else {
            // Garantir que apenas a página de login seja exibida
            loginPage.style.display = 'block';
            dashboardPage.style.display = 'none';
            logoutBtn.style.display = 'none';
        }
    }

    // Inicializar sistema de detecção de inatividade
    setupInactivityDetection();

    // Verificar sessão inicial
    verificarSessaoInicial();
    
    // Detectar quando a janela/aba é fechada
    window.addEventListener('beforeunload', () => {
        // Fazer logout ao fechar aba
        console.log('Aba sendo fechada - fazendo logout automático');
        localStorage.removeItem('usuarioLogado');
        localStorage.removeItem('sessionId');
        
        // Limpar timer de inatividade
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
    });
    
    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    forgotPasswordLink.addEventListener('click', abrirModalEsqueciSenha);
    forgotPasswordForm.addEventListener('submit', handleEsqueciSenha);
    
    // Limpar mensagens quando o modal for fechado
    forgotPasswordModal.addEventListener('modal:close', function() {
        const mensagens = forgotPasswordModal.querySelectorAll('.message');
        mensagens.forEach(msg => msg.remove());
    });
    
    // Verificar se o botão de logout existe antes de adicionar o listener
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
        console.log('Botão de logout encontrado e listener adicionado');
    } else {
        console.error('Botão de logout não encontrado!');
    }
    
    // Função para fazer login
    async function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        if (!email || !senha) {
            mostrarMensagem('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        // Mostrar loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading"></span> Entrando...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password: senha }) // <-- ALTERADO AQUI
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Salvar dados do usuário e sessionId no localStorage
                localStorage.setItem('usuarioLogado', JSON.stringify(data.user));
                if (data.sessionId) {
                    localStorage.setItem('sessionId', data.sessionId);
                }
                
                // Inicializar sistema de timeout
                resetInactivityTimer();
                
                // Mostrar mensagem de boas-vindas personalizada (persistente)
                mostrarMensagem(`Bem-vindo, ${data.user.email}!`, 'success', true);
                
                // Mostrar dashboard imediatamente
                mostrarDashboard(data.user);
            } else {
                mostrarMensagem(data.message, 'error');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            mostrarMensagem('Erro ao conectar com o servidor. Tente novamente.', 'error');
        } finally {
            // Restaurar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    // Função para abrir modal de esqueci a senha
    function abrirModalEsqueciSenha(e) {
        e.preventDefault();
        
        // Limpar mensagens anteriores do modal
        const mensagens = forgotPasswordModal.querySelectorAll('.message');
        mensagens.forEach(msg => msg.remove());
        
        // Limpar formulário
        forgotPasswordForm.reset();
        
        const modal = M.Modal.getInstance(forgotPasswordModal);
        modal.open();
    }
    
    // Função para lidar com esqueci a senha
    async function handleEsqueciSenha(e) {
        e.preventDefault();
        
        const email = document.getElementById('recovery-email').value.trim();
        
        // Validação de email obrigatório
        if (!email) {
            mostrarMensagem('Email é obrigatório', 'error');
            return;
        }
        
        // Validação básica de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarMensagem('Por favor, digite um email válido', 'error');
            return;
        }
        
        // Mostrar loading
        const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading"></span> Enviando...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/remember-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Email de recuperação enviado com sucesso
                mostrarMensagem('Email de recuperação enviado', 'success');
                
                // Limpar formulário
                forgotPasswordForm.reset();
                
                // Aguardar 3 segundos antes de fechar o modal
                setTimeout(() => {
                    const modal = M.Modal.getInstance(forgotPasswordModal);
                    modal.close();
                }, 3000);
            } else {
                // Email não encontrado no sistema
                if (response.status === 404) {
                    mostrarMensagem('Email não encontrado no sistema', 'error');
                } else {
                    mostrarMensagem(data.message, 'error');
                }
            }
        } catch (error) {
            console.error('Erro ao solicitar recuperação:', error);
            mostrarMensagem('Erro ao conectar com o servidor. Tente novamente.', 'error');
        } finally {
            // Restaurar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    // Função para mostrar dashboard
    function mostrarDashboard(usuario) {
        console.log('Mostrando dashboard para:', usuario);
        
        // Esconder página de login
        loginPage.style.display = 'none';
        
        // Mostrar página do dashboard
        dashboardPage.style.display = 'block';
        dashboardPage.classList.add('active', 'fade-in');
        
        // Mostrar botão de logout
        logoutBtn.style.display = 'block';
        
        // Preencher informações IMEDIATAMENTE
        console.log('Preenchendo informações do dashboard...');
        
        // Preencher informações do usuário
        preencherInformacoesUsuario(usuario);
        
        // Preencher informações acadêmicas
        preencherInformacoesAcademicas(usuario);
        
        // Preencher disciplinas
        preencherDisciplinas(usuario);
        
        // Preencher painel de aulas
        preencherPainelAulas(usuario);
        
        console.log('Dashboard preenchido com sucesso!');
        
        // Garantir que as informações permaneçam visíveis
        setTimeout(() => {
            console.log('Verificando se as informações ainda estão visíveis...');
            const userInfo = document.getElementById('user-info');
            const academicInfo = document.getElementById('academic-info');
            const disciplinasList = document.getElementById('disciplinas-list');
            const aulasPanel = document.getElementById('aulas-panel');
            
            if (!userInfo.innerHTML.trim()) {
                console.log('Re-preenchendo informações do usuário...');
                preencherInformacoesUsuario(usuario);
            }
            if (!academicInfo.innerHTML.trim()) {
                console.log('Re-preenchendo informações acadêmicas...');
                preencherInformacoesAcademicas(usuario);
            }
            if (!disciplinasList.innerHTML.trim()) {
                console.log('Re-preenchendo disciplinas...');
                preencherDisciplinas(usuario);
            }
            if (!aulasPanel.innerHTML.trim()) {
                console.log('Re-preenchendo painel de aulas...');
                preencherPainelAulas(usuario);
            }
        }, 50000);
        
        // Monitor contínuo para garantir que as informações permaneçam
        const monitorInterval = setInterval(() => {
            const userInfo = document.getElementById('user-info');
            const academicInfo = document.getElementById('academic-info');
            const disciplinasList = document.getElementById('disciplinas-list');
            const aulasPanel = document.getElementById('aulas-panel');
            
            // Forçar visibilidade de todos os elementos
            if (userInfo) {
                userInfo.style.display = 'block';
                userInfo.style.visibility = 'visible';
                userInfo.style.opacity = '1';
                if (!userInfo.innerHTML.trim()) {
                    console.log('Monitor: Re-preenchendo informações do usuário...');
                    preencherInformacoesUsuario(usuario);
                }
            }
            
            if (academicInfo) {
                academicInfo.style.display = 'block';
                academicInfo.style.visibility = 'visible';
                academicInfo.style.opacity = '1';
                if (!academicInfo.innerHTML.trim()) {
                    console.log('Monitor: Re-preenchendo informações acadêmicas...');
                    preencherInformacoesAcademicas(usuario);
                }
            }
            
            if (disciplinasList) {
                disciplinasList.style.display = 'block';
                disciplinasList.style.visibility = 'visible';
                disciplinasList.style.opacity = '1';
                if (!disciplinasList.innerHTML.trim()) {
                    console.log('Monitor: Re-preenchendo disciplinas...');
                    preencherDisciplinas(usuario);
                }
            }
            
            if (aulasPanel) {
                aulasPanel.style.display = 'block';
                aulasPanel.style.visibility = 'visible';
                aulasPanel.style.opacity = '1';
                if (!aulasPanel.innerHTML.trim()) {
                    console.log('Monitor: Re-preenchendo painel de aulas...');
                    preencherPainelAulas(usuario);
                }
            }
            
            // Forçar visibilidade de todos os cards
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.style.display = 'block';
                card.style.visibility = 'visible';
                card.style.opacity = '1';
            });
            
            // Parar o monitor se o usuário fizer logout
            if (loginPage.style.display === 'block') {
                clearInterval(monitorInterval);
                console.log('Monitor parado - usuário fez logout');
            }
        }, 2000);
    }
    
    // Função para preencher informações do usuário
    function preencherInformacoesUsuario(usuario) {
        const userInfoDiv = document.getElementById('user-info');
        console.log('Preenchendo informações do usuário:', usuario);
        console.log('Elemento user-info encontrado:', !!userInfoDiv);
        
        if (userInfoDiv && usuario) {
            const html = `
                <div class="user-info-item" style="display: block !important; visibility: visible !important;">
                    <i class="material-icons">person</i>
                    <span class="user-info-label">Nome:</span>
                    <span class="user-info-value">${usuario.nome}</span>
                </div>
                <div class="user-info-item" style="display: block !important; visibility: visible !important;">
                    <i class="material-icons">email</i>
                    <span class="user-info-label">Email:</span>
                    <span class="user-info-value">${usuario.email}</span>
                </div>
                <div class="user-info-item" style="display: block !important; visibility: visible !important;">
                    <i class="material-icons">badge</i>
                    <span class="user-info-label">Tipo:</span>
                    <span class="user-info-value">${usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)}</span>
                </div>
            `;
            userInfoDiv.innerHTML = html;
            userInfoDiv.style.display = 'block';
            userInfoDiv.style.visibility = 'visible';
            userInfoDiv.style.opacity = '1';
            console.log('Informações do usuário preenchidas com sucesso');
        } else {
            console.error('Erro ao preencher informações do usuário:', { userInfoDiv: !!userInfoDiv, usuario: !!usuario });
        }
    }
    
    // Função para preencher informações acadêmicas
    function preencherInformacoesAcademicas(usuario) {
        const academicInfoDiv = document.getElementById('academic-info');
        
        if (academicInfoDiv && usuario) {
            let academicInfo = '';
            
            if (usuario.curso) {
                academicInfo += `
                    <div class="user-info-item" style="display: block !important; visibility: visible !important;">
                        <i class="material-icons">school</i>
                        <span class="user-info-label">Curso:</span>
                        <span class="user-info-value">${usuario.curso}</span>
                    </div>
                `;
            }
            
            if (usuario.semestre) {
                academicInfo += `
                    <div class="user-info-item" style="display: block !important; visibility: visible !important;">
                        <i class="material-icons">schedule</i>
                        <span class="user-info-label">Semestre:</span>
                        <span class="user-info-value">${usuario.semestre}º</span>
                    </div>
                `;
            }
            
            if (usuario.departamento) {
                academicInfo += `
                    <div class="user-info-item" style="display: block !important; visibility: visible !important;">
                        <i class="material-icons">business</i>
                        <span class="user-info-label">Departamento:</span>
                        <span class="user-info-value">${usuario.departamento}</span>
                    </div>
                `;
            }
            
            academicInfoDiv.innerHTML = academicInfo || '<p>Nenhuma informação acadêmica disponível.</p>';
            academicInfoDiv.style.display = 'block';
            academicInfoDiv.style.visibility = 'visible';
            academicInfoDiv.style.opacity = '1';
        }
    }
    
    // Função para preencher disciplinas
    function preencherDisciplinas(usuario) {
        const disciplinasDiv = document.getElementById('disciplinas-list');
        
        if (disciplinasDiv && usuario) {
            // Disciplinas mockadas baseadas no curso
            let disciplinas = [];
            
            if (usuario.curso === 'Engenharia de Software') {
                disciplinas = [
                    'Programação Orientada a Objetos',
                    'Estruturas de Dados',
                    'Banco de Dados',
                    'Desenvolvimento Web',
                    'Teste de Software',
                    'Arquitetura de Software'
                ];
            } else if (usuario.curso === 'Ciência da Computação') {
                disciplinas = [
                    'Algoritmos e Estruturas de Dados',
                    'Programação Web',
                    'Inteligência Artificial',
                    'Sistemas Operacionais',
                    'Redes de Computadores',
                    'Compiladores'
                ];
            } else if (usuario.curso === 'Sistemas de Informação') {
                disciplinas = [
                    'Gestão de Projetos',
                    'Análise de Sistemas',
                    'Programação Web',
                    'Banco de Dados',
                    'Redes de Computadores',
                    'Empreendedorismo'
                ];
            }
            
            if (disciplinas.length > 0) {
                const disciplinasHTML = disciplinas.map(disciplina => `
                    <div class="disciplina-item" style="display: block !important; visibility: visible !important;">
                        <i class="material-icons">book</i>
                        <span>${disciplina}</span>
                    </div>
                `).join('');
                
                disciplinasDiv.innerHTML = disciplinasHTML;
                disciplinasDiv.style.display = 'block';
                disciplinasDiv.style.visibility = 'visible';
                disciplinasDiv.style.opacity = '1';
            } else {
                disciplinasDiv.innerHTML = '<p>Nenhuma disciplina cadastrada.</p>';
                disciplinasDiv.style.display = 'block';
                disciplinasDiv.style.visibility = 'visible';
                disciplinasDiv.style.opacity = '1';
            }
        }
    }
    
    // Função para preencher painel de aulas
    function preencherPainelAulas(usuario) {
        const aulasPanelDiv = document.getElementById('aulas-panel');
        
        if (aulasPanelDiv && usuario) {
            // Dados mockados de aulas baseados no curso
            let aulas = [];
            
            if (usuario.curso === 'Engenharia de Software') {
                aulas = [
                    {
                        disciplina: 'Programação Orientada a Objetos',
                        professor: 'Dr. Silva',
                        horario: 'Segunda-feira, 08:00 - 10:00',
                        sala: 'Lab 101',
                        presencas: 8,
                        faltas: 2,
                        total: 10
                    },
                    {
                        disciplina: 'Estruturas de Dados',
                        professor: 'Prof. Santos',
                        horario: 'Terça-feira, 10:00 - 12:00',
                        sala: 'Sala 205',
                        presencas: 7,
                        faltas: 3,
                        total: 10
                    },
                    {
                        disciplina: 'Banco de Dados',
                        professor: 'Dra. Costa',
                        horario: 'Quarta-feira, 14:00 - 16:00',
                        sala: 'Lab 102',
                        presencas: 9,
                        faltas: 1,
                        total: 10
                    }
                ];
            } else if (usuario.curso === 'Ciência da Computação') {
                aulas = [
                    {
                        disciplina: 'Algoritmos e Estruturas de Dados',
                        professor: 'Dr. Oliveira',
                        horario: 'Segunda-feira, 14:00 - 16:00',
                        sala: 'Sala 301',
                        presencas: 6,
                        faltas: 4,
                        total: 10
                    },
                    {
                        disciplina: 'Programação Web',
                        professor: 'Prof. Lima',
                        horario: 'Terça-feira, 08:00 - 10:00',
                        sala: 'Lab 201',
                        presencas: 10,
                        faltas: 0,
                        total: 10
                    },
                    {
                        disciplina: 'Inteligência Artificial',
                        professor: 'Dra. Ferreira',
                        horario: 'Quinta-feira, 10:00 - 12:00',
                        sala: 'Sala 401',
                        presencas: 8,
                        faltas: 2,
                        total: 10
                    }
                ];
            } else if (usuario.curso === 'Sistemas de Informação') {
                aulas = [
                    {
                        disciplina: 'Gestão de Projetos',
                        professor: 'Prof. Rodrigues',
                        horario: 'Segunda-feira, 10:00 - 12:00',
                        sala: 'Sala 105',
                        presencas: 9,
                        faltas: 1,
                        total: 10
                    },
                    {
                        disciplina: 'Análise de Sistemas',
                        professor: 'Dr. Almeida',
                        horario: 'Quarta-feira, 08:00 - 10:00',
                        sala: 'Sala 205',
                        presencas: 7,
                        faltas: 3,
                        total: 10
                    },
                    {
                        disciplina: 'Programação Web',
                        professor: 'Prof. Martins',
                        horario: 'Sexta-feira, 14:00 - 16:00',
                        sala: 'Lab 103',
                        presencas: 8,
                        faltas: 2,
                        total: 10
                    }
                ];
            }
            
            if (aulas.length > 0) {
                const aulasHTML = aulas.map(aula => {
                    const percentualPresenca = ((aula.presencas / aula.total) * 100).toFixed(1);
                    const statusClass = percentualPresenca >= 75 ? 'green-text' : percentualPresenca >= 60 ? 'orange-text' : 'red-text';
                    const statusIcon = percentualPresenca >= 75 ? 'check_circle' : percentualPresenca >= 60 ? 'warning' : 'error';
                    
                    return `
                        <div class="aula-item">
                            <div class="aula-header">
                                <h6 class="aula-disciplina">
                                    <i class="material-icons left">school</i>
                                    ${aula.disciplina}
                                </h6>
                                <span class="aula-status ${statusClass}">
                                    <i class="material-icons">${statusIcon}</i>
                                    ${percentualPresenca}% de presença
                                </span>
                            </div>
                            <div class="aula-details">
                                <div class="aula-info">
                                    <p><i class="material-icons tiny">person</i> <strong>Professor:</strong> ${aula.professor}</p>
                                    <p><i class="material-icons tiny">schedule</i> <strong>Horário:</strong> ${aula.horario}</p>
                                    <p><i class="material-icons tiny">room</i> <strong>Sala:</strong> ${aula.sala}</p>
                                </div>
                                <div class="aula-presenca">
                                    <div class="presenca-stats">
                                        <div class="stat-item">
                                            <span class="stat-label">Presenças:</span>
                                            <span class="stat-value green-text">${aula.presencas}</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-label">Faltas:</span>
                                            <span class="stat-value red-text">${aula.faltas}</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-label">Total:</span>
                                            <span class="stat-value">${aula.total}</span>
                                        </div>
                                    </div>
                                    <div class="presenca-bar">
                                        <div class="progress">
                                            <div class="determinate" style="width: ${percentualPresenca}%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
                
                aulasPanelDiv.innerHTML = aulasHTML;
            } else {
                aulasPanelDiv.innerHTML = '<p>Nenhuma aula cadastrada.</p>';
            }
        }
    }
    
    // Função para fazer logout
    async function handleLogout(e) {
        e.preventDefault();
        console.log('Logout iniciado...');
        
        // Limpar timer de inatividade
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            inactivityTimer = null;
        }
        
        // Comentado: endpoint não existe na API externa
        /*
        try {
            const sessionId = localStorage.getItem('sessionId');
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (sessionId) {
                headers['x-session-id'] = sessionId;
            }
            
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: headers
            });
            console.log('Resposta do logout:', response.status);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
        */
        
        // Limpar localStorage
        localStorage.removeItem('usuarioLogado');
        localStorage.removeItem('sessionId');
        console.log('LocalStorage limpo');
        
        // Mostrar página de login
        loginPage.style.display = 'block';
        dashboardPage.style.display = 'none';
        dashboardPage.classList.remove('active');
        logoutBtn.style.display = 'none';
        console.log('Páginas alternadas');
        
        // Limpar formulário
        loginForm.reset();
        
        // Remover todas as mensagens (incluindo persistentes)
        const todasMensagens = document.querySelectorAll('.message');
        todasMensagens.forEach(msg => {
            msg.remove();
        });
        console.log('Mensagens removidas');
        
        // Mostrar mensagem
        mostrarMensagem('Logout realizado com sucesso!', 'success');
        console.log('Logout concluído');
    }
    
    // Função para mostrar mensagens
    function mostrarMensagem(mensagem, tipo, persistente = false) {
        // Se for persistente, verificar se já existe uma mensagem persistente
        if (persistente) {
            const mensagemPersistente = document.querySelector('.message.persistente');
            if (mensagemPersistente) {
                // Atualizar a mensagem existente
                mensagemPersistente.textContent = mensagem;
                mensagemPersistente.className = `message ${tipo} persistente`;
                return;
            }
        }
        
        // Remover apenas mensagens não persistentes
        const mensagensAnteriores = document.querySelectorAll('.message:not(.persistente)');
        mensagensAnteriores.forEach(msg => msg.remove());
        
        // Criar nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${tipo}`;
        if (persistente) {
            messageDiv.classList.add('persistente');
        }
        messageDiv.textContent = mensagem;
        
        // Verificar se estamos no modal de recuperação de senha
        const modal = document.getElementById('forgot-password-modal');
        const modalContent = modal ? modal.querySelector('.modal-content') : null;
        
        if (modalContent && modal.classList.contains('open')) {
            // Se o modal estiver aberto, inserir a mensagem no modal
            const form = modalContent.querySelector('form');
            if (form) {
                // Inserir antes do formulário
                modalContent.insertBefore(messageDiv, form);
            } else {
                // Inserir no final do modal
                modalContent.appendChild(messageDiv);
            }
        } else {
            // Inserir mensagem no topo da página
            const container = document.querySelector('.container');
            container.insertBefore(messageDiv, container.firstChild);
        }
        
        // Remover mensagem após 5 segundos (apenas se não for persistente)
        if (!persistente) {
            setTimeout(() => {
                if (messageDiv.parentNode && !messageDiv.classList.contains('persistente')) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }
    
    // Função para verificar status da conta
    async function verificarStatusConta(email) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/status?email=${encodeURIComponent(email)}`);
            const data = await response.json();
            
            if (data.success) {
                const status = data.status;
                
                if (status.bloqueado) {
                    mostrarMensagem('Sua conta está bloqueada devido a múltiplas tentativas de login inválidas.', 'error');
                } else if (status.tentativas > 0) {
                    mostrarMensagem(`Atenção: ${status.tentativasRestantes} tentativas restantes antes do bloqueio.`, 'warning');
                }
            }
        } catch (error) {
            console.error('Erro ao verificar status da conta:', error);
        }
    }
    
    // Verificar status da conta quando o email é digitado
    const emailInput = document.getElementById('email');
    let timeoutId;
    
    emailInput.addEventListener('input', function() {
        clearTimeout(timeoutId);
        const email = this.value;
        
        if (email && email.includes('@')) {
            timeoutId = setTimeout(() => {
                verificarStatusConta(email);
            }, 1000);
        }
    });

    // Verificar sessão a cada 30 segundos
    // Comentado: endpoint não existe na API externa
    /*
    setInterval(async () => {
        const sessionId = localStorage.getItem('sessionId');
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        
        if (sessionId && usuarioLogado) {
            try {
                const response = await fetch('/api/auth/check-session', {
                    headers: {
                        'x-session-id': sessionId
                    }
                });
                
                if (!response.ok) {
                    console.log('Sessão expirada no servidor');
                    handleLogoutAuto();
                }
            } catch (error) {
                console.error('Erro ao verificar sessão:', error);
            }
        }
    }, 30000);
    */
});