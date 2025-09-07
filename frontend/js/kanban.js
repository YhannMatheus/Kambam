// Gerenciamento do quadro Kanban
class KanbanManager {
    constructor() {
        this.container = document.getElementById('kanban-container');
        this.currentProject = null;
        this.draggedTask = null;
        this.init();
    }

    async init() {
        await this.loadKanban();
        this.initSearch();
    }

    async loadKanban() {
        try {
            this.showLoading();
            
            const response = await ApiService.getProjects();
            const projects = response.projects || response; // Tratar ambos os formatos
            
            if (!projects || projects.length === 0) {
                this.showEmptyState('Nenhum projeto encontrado.');
                return;
            }

            // Por simplicidade, carregamos o primeiro projeto
            // Em uma versão completa, haveria um seletor de projetos
            this.currentProject = projects[0];
            await this.renderProject(this.currentProject);
            
        } catch (error) {
            console.error('Erro ao carregar kanban:', error);
            this.showError('Erro ao carregar dados: ' + error.message);
        }
    }

    async renderProject(project) {
        try {
            const response = await ApiService.getProjectColumns(project.id);
            const columns = response.columns || response; // Tratar ambos os formatos
            
            this.container.innerHTML = '';
            
            for (const column of columns) {
                await this.renderColumn(column);
            }
            
            this.setupDragAndDrop();
            
        } catch (error) {
            console.error('Erro ao renderizar projeto:', error);
            this.showError('Erro ao carregar colunas do projeto');
        }
    }

    async renderColumn(column) {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'column';
        columnDiv.dataset.columnId = column.id;
        
        columnDiv.innerHTML = `
            <div class="column-header">
                <div class="column-title">${this.escapeHtml(column.name)}</div>
                <div class="task-count">0</div>
            </div>
            <div class="tasks"></div>
            <div class="add-task">
                <i class="fas fa-plus"></i> Adicionar tarefa
            </div>
        `;
        
        this.container.appendChild(columnDiv);
        
        try {
            const response = await ApiService.getColumnTasks(column.id);
            const tasks = response.tasks || response; // Tratar ambos os formatos
            const tasksContainer = columnDiv.querySelector('.tasks');
            
            for (const task of tasks) {
                this.renderTask(task, tasksContainer);
            }
            
            this.updateTaskCount(columnDiv, tasks.length);
            
        } catch (error) {
            console.error('Erro ao carregar tarefas da coluna:', column.id, error);
        }
    }

    renderTask(task, container) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        taskDiv.draggable = true;
        taskDiv.dataset.taskId = task.id;
        
        const priorityLabel = CONFIG.PRIORITY_LABELS[task.priority] || 'Média';
        const priorityClass = task.priority || 'medium';
        
        const assigneeInitial = task.assignee ? task.assignee.charAt(0).toUpperCase() : '?';
        const assigneeName = task.assignee || 'Sem responsável';
        
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : '';
        
        taskDiv.innerHTML = `
            <div class="task-header">
                <div class="task-title">${this.escapeHtml(task.title)}</div>
                <div class="task-priority ${priorityClass}">${priorityLabel}</div>
            </div>
            <div class="task-description">${this.escapeHtml(task.description || '')}</div>
            <div class="task-footer">
                <div class="task-assignee">
                    <div class="assignee-avatar">${assigneeInitial}</div>
                    <span>${this.escapeHtml(assigneeName)}</span>
                </div>
                <div class="task-due-date">${dueDate}</div>
            </div>
        `;
        
        container.appendChild(taskDiv);
    }

    updateTaskCount(columnDiv, count) {
        const countElement = columnDiv.querySelector('.task-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    setupDragAndDrop() {
        const tasks = this.container.querySelectorAll('.task');
        const columns = this.container.querySelectorAll('.column');

        tasks.forEach(task => {
            task.addEventListener('dragstart', (e) => {
                this.draggedTask = task;
                task.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            task.addEventListener('dragend', () => {
                if (this.draggedTask) {
                    this.draggedTask.classList.remove('dragging');
                    this.draggedTask = null;
                }
            });
        });

        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            column.addEventListener('dragenter', (e) => {
                e.preventDefault();
                column.classList.add('drag-over');
            });

            column.addEventListener('dragleave', (e) => {
                if (!column.contains(e.relatedTarget)) {
                    column.classList.remove('drag-over');
                }
            });

            column.addEventListener('drop', async (e) => {
                e.preventDefault();
                column.classList.remove('drag-over');
                
                if (this.draggedTask) {
                    const newColumnId = column.dataset.columnId;
                    const taskId = this.draggedTask.dataset.taskId;
                    
                    try {
                        // Mover a tarefa visualmente primeiro
                        const tasksContainer = column.querySelector('.tasks');
                        tasksContainer.appendChild(this.draggedTask);
                        
                        // Atualizar contadores
                        this.updateAllTaskCounts();
                        
                        // Atualizar no backend
                        await ApiService.updateTask(taskId, { columnId: newColumnId });
                        
                    } catch (error) {
                        console.error('Erro ao mover tarefa:', error);
                        // Em caso de erro, recarregar para restaurar o estado correto
                        this.loadKanban();
                    }
                }
            });
        });
    }

    updateAllTaskCounts() {
        const columns = this.container.querySelectorAll('.column');
        columns.forEach(column => {
            const taskCount = column.querySelectorAll('.task').length;
            this.updateTaskCount(column, taskCount);
        });
    }

    initSearch() {
        const searchInput = document.getElementById('search-input');
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filterTasks(e.target.value.toLowerCase());
            }, 300);
        });
    }

    filterTasks(searchTerm) {
        const tasks = this.container.querySelectorAll('.task');
        
        tasks.forEach(task => {
            const title = task.querySelector('.task-title').textContent.toLowerCase();
            const description = task.querySelector('.task-description').textContent.toLowerCase();
            const assignee = task.querySelector('.task-assignee span').textContent.toLowerCase();
            
            const matches = title.includes(searchTerm) || 
                           description.includes(searchTerm) || 
                           assignee.includes(searchTerm);
            
            task.style.display = matches ? 'block' : 'none';
        });
    }

    showLoading() {
        this.container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando...</div>';
    }

    showError(message) {
        this.container.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> ${this.escapeHtml(message)}</div>`;
    }

    showEmptyState(message) {
        this.container.innerHTML = `<div class="empty-state">${this.escapeHtml(message)}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
