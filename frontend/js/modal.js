// Gerenciamento de modais
class ModalManager {
    constructor() {
        this.initProjectModal();
        this.initTaskModal();
        this.currentColumnId = null;
    }

    initProjectModal() {
        const modal = document.getElementById('project-modal');
        const openBtn = document.getElementById('new-project-btn');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.querySelector('.cancel-btn');
        const form = document.getElementById('project-form');

        openBtn.addEventListener('click', () => this.openProjectModal());
        closeBtn.addEventListener('click', () => this.closeProjectModal());
        cancelBtn.addEventListener('click', () => this.closeProjectModal());
        
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.closeProjectModal();
            }
        });

        form.addEventListener('submit', (e) => this.handleProjectSubmit(e));
    }

    initTaskModal() {
        const modal = document.getElementById('task-modal');
        const closeBtn = document.querySelector('.close-task');
        const cancelBtn = document.querySelector('.cancel-task-btn');
        const form = document.getElementById('task-form');

        closeBtn.addEventListener('click', () => this.closeTaskModal());
        cancelBtn.addEventListener('click', () => this.closeTaskModal());
        
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.closeTaskModal();
            }
        });

        form.addEventListener('submit', (e) => this.handleTaskSubmit(e));

        // Event delegation para botões "Adicionar tarefa"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-task') || e.target.closest('.add-task')) {
                const column = e.target.closest('.column');
                if (column) {
                    this.currentColumnId = column.dataset.columnId;
                    this.openTaskModal();
                }
            }
        });
    }

    openProjectModal() {
        const modal = document.getElementById('project-modal');
        modal.style.display = 'flex';
        this.clearProjectForm();
    }

    closeProjectModal() {
        const modal = document.getElementById('project-modal');
        modal.style.display = 'none';
    }

    openTaskModal() {
        const modal = document.getElementById('task-modal');
        modal.style.display = 'flex';
        this.clearTaskForm();
    }

    closeTaskModal() {
        const modal = document.getElementById('task-modal');
        modal.style.display = 'none';
        this.currentColumnId = null;
    }

    clearProjectForm() {
        const form = document.getElementById('project-form');
        form.reset();
    }

    clearTaskForm() {
        const form = document.getElementById('task-form');
        form.reset();
    }

    async handleProjectSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const projectData = {
            name: document.getElementById('project-title').value,
            description: document.getElementById('project-description').value
        };

        try {
            await ApiService.createProject(projectData);
            this.closeProjectModal();
            this.showSuccess('Projeto criado com sucesso!');
            
            // Recarregar o kanban
            if (window.kanbanManager) {
                window.kanbanManager.loadKanban();
            }
        } catch (error) {
            this.showError('Erro ao criar projeto: ' + error.message);
        }
    }

    async handleTaskSubmit(e) {
        e.preventDefault();
        
        if (!this.currentColumnId) {
            this.showError('Erro: coluna não identificada');
            return;
        }

        const taskData = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            columnId: this.currentColumnId,
            priority: document.getElementById('task-priority').value,
            assignee: document.getElementById('task-assignee').value,
            dueDate: document.getElementById('task-due-date').value || null
        };

        try {
            await ApiService.createTask(taskData);
            this.closeTaskModal();
            this.showSuccess('Tarefa criada com sucesso!');
            
            // Recarregar o kanban
            if (window.kanbanManager) {
                window.kanbanManager.loadKanban();
            }
        } catch (error) {
            this.showError('Erro ao criar tarefa: ' + error.message);
        }
    }

    showSuccess(message) {
        // Implementação simples com alert, pode ser melhorada com toast/notification
        alert(message);
    }

    showError(message) {
        // Implementação simples com alert, pode ser melhorada com toast/notification
        alert(message);
    }
}
