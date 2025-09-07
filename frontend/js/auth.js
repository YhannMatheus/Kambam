// Gerenciamento de autenticação
class AuthService {
    static TOKEN_KEY = 'kanban_token';

    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static removeToken() {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static async login(email, password) {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Credenciais inválidas');
            }

            const data = await response.json();
            
            if (data.token) {
                this.setToken(data.token);
                return data;
            } else {
                throw new Error('Token não recebido');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    static async register(userData) {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao registrar usuário');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        }
    }

    static logout() {
        this.removeToken();
        window.location.reload();
    }

    static async getProfile() {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/api/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar perfil');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            throw error;
        }
    }
}
