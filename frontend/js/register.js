// ========================================
// REGISTRO COM VALIDAÇÃO DE SENHA
// ========================================

class RegisterValidator {
    constructor() {
        this.passwordField = document.getElementById('password');
        this.confirmPasswordField = document.getElementById('confirmPassword');
        this.registerBtn = document.getElementById('registerBtn');
        this.form = document.getElementById('registerForm');
        
        this.passwordRequirements = {
            length: false,
            upper: false,
            lower: false,
            number: false
        };
        
        this.passwordsMatch = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkFormValidity();
    }
    
    setupEventListeners() {
        // Validação em tempo real da senha
        this.passwordField.addEventListener('input', () => {
            this.validatePassword();
            this.validatePasswordMatch();
            this.checkFormValidity();
        });
        
        // Validação em tempo real da confirmação
        this.confirmPasswordField.addEventListener('input', () => {
            this.validatePasswordMatch();
            this.checkFormValidity();
        });
        
        // Toggle visibility da senha
        document.getElementById('togglePassword').addEventListener('click', () => {
            this.togglePasswordVisibility('password', 'togglePassword');
        });
        
        document.getElementById('toggleConfirmPassword').addEventListener('click', () => {
            this.togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword');
        });
        
        // Validação do nome
        document.getElementById('name').addEventListener('input', () => {
            this.checkFormValidity();
        });
        
        // Validação do email
        document.getElementById('email').addEventListener('input', () => {
            this.checkFormValidity();
        });
        
        // Submit do formulário
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    
    validatePassword() {
        const password = this.passwordField.value;
        
        // Verificar comprimento mínimo
        this.passwordRequirements.length = password.length >= 8;
        this.updateRequirementUI('lengthReq', this.passwordRequirements.length);
        
        // Verificar letra maiúscula
        this.passwordRequirements.upper = /[A-Z]/.test(password);
        this.updateRequirementUI('upperReq', this.passwordRequirements.upper);
        
        // Verificar letra minúscula
        this.passwordRequirements.lower = /[a-z]/.test(password);
        this.updateRequirementUI('lowerReq', this.passwordRequirements.lower);
        
        // Verificar número
        this.passwordRequirements.number = /\d/.test(password);
        this.updateRequirementUI('numberReq', this.passwordRequirements.number);
    }
    
    updateRequirementUI(elementId, isValid) {
        const element = document.getElementById(elementId);
        const icon = element.querySelector('i');
        
        if (isValid) {
            icon.className = 'fas fa-check requirement-valid';
            element.style.color = '#28a745';
        } else {
            icon.className = 'fas fa-times requirement-invalid';
            element.style.color = '#dc3545';
        }
    }
    
    validatePasswordMatch() {
        const password = this.passwordField.value;
        const confirmPassword = this.confirmPasswordField.value;
        const matchElement = document.getElementById('passwordMatch');
        
        if (confirmPassword.length === 0) {
            matchElement.style.display = 'none';
            this.passwordsMatch = false;
            return;
        }
        
        matchElement.style.display = 'flex';
        
        if (password === confirmPassword) {
            this.passwordsMatch = true;
            matchElement.innerHTML = '<i class="fas fa-check match-valid"></i><span>As senhas coincidem</span>';
            matchElement.className = 'password-match match-valid';
        } else {
            this.passwordsMatch = false;
            matchElement.innerHTML = '<i class="fas fa-times match-invalid"></i><span>As senhas não coincidem</span>';
            matchElement.className = 'password-match match-invalid';
        }
    }
    
    togglePasswordVisibility(fieldId, iconId) {
        const field = document.getElementById(fieldId);
        const icon = document.getElementById(iconId);
        
        if (field.type === 'password') {
            field.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            field.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
    
    checkFormValidity() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = this.passwordField.value;
        const confirmPassword = this.confirmPasswordField.value;
        
        // Verificar se todos os campos estão preenchidos
        const fieldsComplete = name.length > 0 && email.length > 0 && 
                              password.length > 0 && confirmPassword.length > 0;
        
        // Verificar se a senha atende aos requisitos
        const passwordValid = Object.values(this.passwordRequirements).every(req => req);
        
        // Verificar se as senhas coincidem
        const passwordsMatch = this.passwordsMatch;
        
        // Verificar email válido
        const emailValid = this.isValidEmail(email);
        
        // Habilitar/desabilitar botão
        const isValid = fieldsComplete && passwordValid && passwordsMatch && emailValid;
        this.registerBtn.disabled = !isValid;
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.checkFormValidity()) {
            this.showError('Por favor, preencha todos os campos corretamente.');
            return;
        }
        
        const formData = new FormData(this.form);
        const userData = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };
        
        // Validação final no frontend
        if (userData.password !== userData.confirmPassword) {
            this.showError('As senhas não coincidem.');
            return;
        }
        
        if (userData.password.length < 8) {
            this.showError('A senha deve ter pelo menos 8 caracteres.');
            return;
        }
        
        try {
            this.setLoading(true);
            this.hideMessages();
            
            // Remover confirmPassword antes de enviar ao backend
            const { confirmPassword, ...registerData } = userData;
            
            const response = await AuthService.register(registerData);
            
            this.showSuccess('Conta criada com sucesso! Redirecionando para o login...');
            
            // Redirecionar para login após 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            console.error('Erro no registro:', error);
            
            let errorMessage = 'Erro ao criar conta. Tente novamente.';
            
            if (error.message) {
                if (error.message.includes('já existe')) {
                    errorMessage = 'Este e-mail já está registrado. Use outro e-mail ou faça login.';
                } else if (error.message.includes('inválidas')) {
                    errorMessage = 'Dados inválidos. Verifique as informações e tente novamente.';
                } else {
                    errorMessage = error.message;
                }
            }
            
            this.showError(errorMessage);
            
        } finally {
            this.setLoading(false);
        }
    }
    
    setLoading(loading) {
        const btnText = document.getElementById('registerBtnText');
        const btnLoading = document.getElementById('registerBtnLoading');
        
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            this.registerBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            this.checkFormValidity(); // Revalidar para habilitar/desabilitar botão
        }
    }
    
    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Scroll suave para o topo
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    showSuccess(message) {
        const successElement = document.getElementById('successMessage');
        successElement.textContent = message;
        successElement.style.display = 'block';
        
        // Scroll suave para o topo
        successElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    hideMessages() {
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('successMessage').style.display = 'none';
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o usuário já está logado
    if (AuthService.isAuthenticated()) {
        window.location.href = 'home.html';
        return;
    }
    
    // Inicializar validador
    new RegisterValidator();
});

// Prevenir envio acidental do formulário
window.addEventListener('beforeunload', (e) => {
    const form = document.getElementById('registerForm');
    if (form && form.querySelector('input[type="text"], input[type="email"], input[type="password"]').value) {
        e.preventDefault();
        e.returnValue = '';
    }
});
