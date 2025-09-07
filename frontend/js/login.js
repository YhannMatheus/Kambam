// Lógica da página de login
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já está logado
    if (AuthService.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const messageDiv = document.getElementById('message');

    // Toggle entre login e registro
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        clearMessage();
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        clearMessage();
    });

    // Handle login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const loginBtn = document.getElementById('login-btn');

        try {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
            
            await AuthService.login(email, password);
            
            showMessage('Login realizado com sucesso! Redirecionando...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            showMessage('Erro no login: ' + error.message, 'error');
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
        }
    });

    // Handle register
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const registerBtn = document.getElementById('register-btn');

        try {
            registerBtn.disabled = true;
            registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
            
            await AuthService.register({ name, email, password });
            
            showMessage('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
            
            // Limpar formulário e voltar para login
            registerForm.reset();
            setTimeout(() => {
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
            }, 2000);
            
        } catch (error) {
            showMessage('Erro no cadastro: ' + error.message, 'error');
        } finally {
            registerBtn.disabled = false;
            registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Cadastrar';
        }
    });

    function showMessage(message, type) {
        messageDiv.innerHTML = `<div class="${type}">${message}</div>`;
    }

    function clearMessage() {
        messageDiv.innerHTML = '';
    }
});
