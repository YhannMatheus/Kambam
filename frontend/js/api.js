// Funções para comunicação com a API
class ApiService {
    static async request(endpoint, options = {}) {
        const url = `${CONFIG.API_BASE}${endpoint}`;
        const token = AuthService.getToken();
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (response.status === 401) {
                // Token inválido ou expirado
                AuthService.removeToken();
                window.location.reload();
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Projetos
    static async getProjects() {
        return this.request(CONFIG.ENDPOINTS.PROJECTS);
    }

    static async createProject(projectData) {
        return this.request(CONFIG.ENDPOINTS.PROJECTS, {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    }

    static async getProject(projectId) {
        return this.request(`${CONFIG.ENDPOINTS.PROJECTS}/${projectId}`);
    }

    // Colunas
    static async getProjectColumns(projectId) {
        return this.request(`${CONFIG.ENDPOINTS.COLUMNS}/project/${projectId}`);
    }

    static async createColumn(columnData) {
        return this.request(CONFIG.ENDPOINTS.COLUMNS, {
            method: 'POST',
            body: JSON.stringify(columnData)
        });
    }

    // Tarefas
    static async getColumnTasks(columnId) {
        return this.request(`${CONFIG.ENDPOINTS.TASKS}/column/${columnId}`);
    }

    static async createTask(taskData) {
        return this.request(CONFIG.ENDPOINTS.TASKS, {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    }

    static async updateTask(taskId, taskData) {
        return this.request(`${CONFIG.ENDPOINTS.TASKS}/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    }

    static async deleteTask(taskId) {
        return this.request(`${CONFIG.ENDPOINTS.TASKS}/${taskId}`, {
            method: 'DELETE'
        });
    }
}
