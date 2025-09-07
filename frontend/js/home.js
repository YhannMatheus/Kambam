// ========================================
// HOME PAGE FUNCTIONALITY
// ========================================

class HomePage {
    constructor() {
        this.currentUser = null;
        this.userTeams = [];
        this.userProjects = [];
        this.currentProject = null;
        
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.loadUserData();
    }

    checkAuthentication() {
        if (!AuthService.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
    }

    setupEventListeners() {
        // User menu
        document.getElementById('user-menu-btn')?.addEventListener('click', this.toggleUserMenu.bind(this));
        document.getElementById('logout-btn')?.addEventListener('click', this.handleLogout.bind(this));

        // Add buttons
        document.getElementById('add-team-btn')?.addEventListener('click', this.showCreateTeamModal.bind(this));
        document.getElementById('add-project-btn')?.addEventListener('click', this.showCreateProjectModal.bind(this));
        document.getElementById('new-project-btn')?.addEventListener('click', this.showCreateProjectModal.bind(this));
        document.getElementById('welcome-create-project')?.addEventListener('click', this.showCreateProjectModal.bind(this));
        document.getElementById('welcome-create-team')?.addEventListener('click', this.showCreateTeamModal.bind(this));

        // Modal controls
        this.setupModalControls();

        // Close dropdowns when clicking outside
        document.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    setupModalControls() {
        // Project modal
        document.getElementById('close-project-modal')?.addEventListener('click', this.hideCreateProjectModal.bind(this));
        document.getElementById('cancel-project-btn')?.addEventListener('click', this.hideCreateProjectModal.bind(this));
        document.getElementById('create-project-form')?.addEventListener('submit', this.handleCreateProject.bind(this));

        // Team modal
        document.getElementById('close-team-modal')?.addEventListener('click', this.hideCreateTeamModal.bind(this));
        document.getElementById('cancel-team-btn')?.addEventListener('click', this.hideCreateTeamModal.bind(this));
        document.getElementById('create-team-form')?.addEventListener('submit', this.handleCreateTeam.bind(this));
    }

    async loadUserData() {
        try {
            this.showLoading(true);
            
            // Carregar perfil do usuário
            await this.loadUserProfile();
            
            // Carregar times e projetos
            await Promise.all([
                this.loadUserTeams(),
                this.loadUserProjects()
            ]);
            
            this.updateStats();
            
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            this.showError('Erro ao carregar dados. Tente novamente.');
        } finally {
            this.showLoading(false);
        }
    }

    async loadUserProfile() {
        try {
            const profile = await AuthService.getProfile();
            this.currentUser = profile;
            
            // Atualizar nome do usuário no header
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = profile.name || 'Usuário';
            }
            
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            throw error;
        }
    }

    async loadUserTeams() {
        try {
            // Por enquanto, usar os times do perfil
            if (this.currentUser && this.currentUser.team) {
                this.userTeams = this.currentUser.team;
            } else {
                this.userTeams = [];
            }
            
            this.renderTeams();
            
        } catch (error) {
            console.error('Erro ao carregar times:', error);
            this.renderTeamsError();
        }
    }

    async loadUserProjects() {
        try {
            const response = await ApiService.getProjects();
            this.userProjects = response.projects || [];
            this.renderProjects();
            
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            this.renderProjectsError();
        }
    }

    renderTeams() {
        const teamsContainer = document.getElementById('teams-list');
        if (!teamsContainer) return;

        if (this.userTeams.length === 0) {
            teamsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <span>Nenhum time ainda</span>
                </div>
            `;
            return;
        }

        teamsContainer.innerHTML = this.userTeams.map(team => `
            <div class="list-item team-item" data-team-id="${team.id}">
                <div class="item-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="item-info">
                    <div class="item-name">${team.name}</div>
                    <div class="item-meta">Time</div>
                </div>
            </div>
        `).join('');

        // Adicionar event listeners para os times
        this.addTeamClickListeners();
    }

    renderProjects() {
        const projectsContainer = document.getElementById('projects-list');
        if (!projectsContainer) return;

        if (this.userProjects.length === 0) {
            projectsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder"></i>
                    <span>Nenhum projeto ainda</span>
                </div>
            `;
            return;
        }

        projectsContainer.innerHTML = this.userProjects.map(project => `
            <div class="list-item project-item" data-project-id="${project.id}">
                <div class="item-icon">
                    <i class="fas fa-folder"></i>
                </div>
                <div class="item-info">
                    <div class="item-name">${project.name}</div>
                    <div class="item-meta">${project.teamId ? 'Em equipe' : 'Individual'}</div>
                </div>
            </div>
        `).join('');

        // Adicionar event listeners para os projetos
        this.addProjectClickListeners();
    }

    renderTeamsError() {
        const teamsContainer = document.getElementById('teams-list');
        if (teamsContainer) {
            teamsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Erro ao carregar times</span>
                </div>
            `;
        }
    }

    renderProjectsError() {
        const projectsContainer = document.getElementById('projects-list');
        if (projectsContainer) {
            projectsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Erro ao carregar projetos</span>
                </div>
            `;
        }
    }

    addTeamClickListeners() {
        document.querySelectorAll('.team-item').forEach(item => {
            item.addEventListener('click', () => {
                const teamId = item.dataset.teamId;
                this.selectTeam(teamId);
            });
        });
    }

    addProjectClickListeners() {
        document.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.dataset.projectId;
                this.selectProject(projectId);
            });
        });
    }

    selectTeam(teamId) {
        // Remover seleção anterior
        document.querySelectorAll('.team-item').forEach(item => {
            item.classList.remove('active');
        });

        // Adicionar seleção atual
        const selectedItem = document.querySelector(`[data-team-id="${teamId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }

        // Filtrar projetos do time
        this.filterProjectsByTeam(teamId);
    }

    selectProject(projectId) {
        // Remover seleção anterior
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
        });

        // Adicionar seleção atual
        const selectedItem = document.querySelector(`[data-project-id="${projectId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }

        // Carregar projeto
        this.loadProject(projectId);
    }

    filterProjectsByTeam(teamId) {
        const filteredProjects = this.userProjects.filter(project => project.teamId === teamId);
        // Atualizar a lista de projetos com os filtrados
        // Implementar filtro visual se necessário
    }

    async loadProject(projectId) {
        try {
            this.showLoading(true);
            
            const project = this.userProjects.find(p => p.id === projectId);
            if (!project) {
                throw new Error('Projeto não encontrado');
            }

            this.currentProject = project;
            
            // Atualizar título do dashboard
            const dashboardTitle = document.getElementById('dashboard-title');
            if (dashboardTitle) {
                dashboardTitle.textContent = project.name;
            }

            // Mostrar visualização do projeto
            this.showProjectView(project);
            
            // Carregar colunas do projeto
            await this.loadProjectColumns(projectId);
            
        } catch (error) {
            console.error('Erro ao carregar projeto:', error);
            this.showError('Erro ao carregar projeto.');
        } finally {
            this.showLoading(false);
        }
    }

    showProjectView(project) {
        // Esconder welcome screen
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }

        // Mostrar project view
        const projectView = document.getElementById('project-view');
        if (projectView) {
            projectView.style.display = 'block';
        }

        // Atualizar informações do projeto
        const projectNameElement = document.getElementById('current-project-name');
        const projectTeamElement = document.getElementById('current-project-team');
        
        if (projectNameElement) {
            projectNameElement.textContent = project.name;
        }
        
        if (projectTeamElement) {
            const teamName = project.teamId ? 
                this.userTeams.find(t => t.id === project.teamId)?.name || 'Time não encontrado' : 
                'Projeto Individual';
            projectTeamElement.textContent = `Time: ${teamName}`;
        }
    }

    async loadProjectColumns(projectId) {
        try {
            const response = await ApiService.getProjectColumns(projectId);
            const columns = response.columns || [];
            
            this.renderKanbanBoard(columns);
            
        } catch (error) {
            console.error('Erro ao carregar colunas:', error);
            this.renderKanbanError();
        }
    }

    renderKanbanBoard(columns) {
        const kanbanBoard = document.getElementById('kanban-board');
        if (!kanbanBoard) return;

        if (columns.length === 0) {
            kanbanBoard.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-columns"></i>
                    <span>Nenhuma coluna criada ainda</span>
                    <button class="btn btn-primary" onclick="homePage.createFirstColumn()">
                        <i class="fas fa-plus"></i>
                        Criar Primeira Coluna
                    </button>
                </div>
            `;
            return;
        }

        // Renderizar colunas do Kanban
        kanbanBoard.innerHTML = columns.map(column => `
            <div class="kanban-column" data-column-id="${column.id}">
                <div class="column-header">
                    <h4>${column.name}</h4>
                    <button class="add-task-btn" onclick="homePage.addTask('${column.id}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="tasks-container" id="tasks-${column.id}">
                    <div class="loading-tasks">
                        <i class="fas fa-spinner fa-spin"></i>
                        Carregando tarefas...
                    </div>
                </div>
            </div>
        `).join('');

        // Carregar tarefas de cada coluna
        columns.forEach(column => {
            this.loadColumnTasks(column.id);
        });
    }

    async loadColumnTasks(columnId) {
        try {
            const response = await ApiService.getColumnTasks(columnId);
            const tasks = response.tasks || [];
            
            this.renderColumnTasks(columnId, tasks);
            
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            this.renderColumnTasksError(columnId);
        }
    }

    renderColumnTasks(columnId, tasks) {
        const tasksContainer = document.getElementById(`tasks-${columnId}`);
        if (!tasksContainer) return;

        if (tasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-tasks">
                    <span>Nenhuma tarefa</span>
                </div>
            `;
            return;
        }

        tasksContainer.innerHTML = tasks.map(task => `
            <div class="task-card" data-task-id="${task.id}">
                <h5>${task.title}</h5>
                ${task.description ? `<p>${task.description}</p>` : ''}
                <div class="task-meta">
                    <span class="task-date">${new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }

    renderColumnTasksError(columnId) {
        const tasksContainer = document.getElementById(`tasks-${columnId}`);
        if (tasksContainer) {
            tasksContainer.innerHTML = `
                <div class="error-tasks">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Erro ao carregar</span>
                </div>
            `;
        }
    }

    updateStats() {
        // Atualizar contadores
        const projectsCount = document.getElementById('projects-count');
        const teamsCount = document.getElementById('teams-count');
        const tasksCount = document.getElementById('tasks-count');

        if (projectsCount) {
            projectsCount.textContent = this.userProjects.length;
        }
        
        if (teamsCount) {
            teamsCount.textContent = this.userTeams.length;
        }

        // TODO: Implementar contagem de tarefas
        if (tasksCount) {
            tasksCount.textContent = '0';
        }
    }

    // Modal Controls
    showCreateProjectModal() {
        const modal = document.getElementById('create-project-modal');
        if (modal) {
            modal.classList.add('show');
            this.loadTeamsForProjectModal();
        }
    }

    hideCreateProjectModal() {
        const modal = document.getElementById('create-project-modal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        // Limpar formulário
        const form = document.getElementById('create-project-form');
        if (form) {
            form.reset();
        }
    }

    showCreateTeamModal() {
        const modal = document.getElementById('create-team-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    hideCreateTeamModal() {
        const modal = document.getElementById('create-team-modal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        // Limpar formulário
        const form = document.getElementById('create-team-form');
        if (form) {
            form.reset();
        }
    }

    loadTeamsForProjectModal() {
        const teamSelect = document.getElementById('project-team');
        if (!teamSelect) return;

        teamSelect.innerHTML = '<option value="">Projeto Individual</option>';
        
        this.userTeams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            teamSelect.appendChild(option);
        });
    }

    async handleCreateProject(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const projectData = {
            name: formData.get('name'),
            teamId: formData.get('teamId') || null
        };

        try {
            this.showLoading(true);
            
            const response = await ApiService.createProject(projectData);
            
            this.showSuccess('Projeto criado com sucesso!');
            this.hideCreateProjectModal();
            
            // Recarregar projetos
            await this.loadUserProjects();
            this.updateStats();
            
        } catch (error) {
            console.error('Erro ao criar projeto:', error);
            this.showError('Erro ao criar projeto. Tente novamente.');
        } finally {
            this.showLoading(false);
        }
    }

    async handleCreateTeam(event) {
        event.preventDefault();
        
        // TODO: Implementar criação de time quando a API estiver disponível
        this.showError('Funcionalidade de criação de times em desenvolvimento.');
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    handleLogout() {
        AuthService.logout();
        window.location.href = 'login.html';
    }

    handleOutsideClick(event) {
        // Fechar dropdown do usuário
        const userMenu = document.getElementById('user-menu-btn');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userDropdown && userDropdown.classList.contains('show')) {
            if (!userMenu?.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove('show');
            }
        }
    }

    // Utility Methods
    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            if (show) {
                overlay.classList.add('show');
            } else {
                overlay.classList.remove('show');
            }
        }
    }

    showSuccess(message) {
        // TODO: Implementar sistema de notificações
        alert(message);
    }

    showError(message) {
        // TODO: Implementar sistema de notificações
        alert(message);
    }

    // Métodos auxiliares para ações do Kanban
    createFirstColumn() {
        // TODO: Implementar criação de coluna
        this.showError('Funcionalidade em desenvolvimento.');
    }

    addTask(columnId) {
        // TODO: Implementar criação de tarefa
        this.showError('Funcionalidade em desenvolvimento.');
    }
}

// Inicializar quando a página carregar
let homePage;
document.addEventListener('DOMContentLoaded', () => {
    homePage = new HomePage();
});

// Exportar para uso global
window.homePage = homePage;
