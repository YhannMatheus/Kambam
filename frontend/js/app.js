// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se está autenticado
    if (!AuthService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Inicializar componentes da aplicação
    window.modalManager = new ModalManager();
    window.kanbanManager = new KanbanManager();
    
    // Event listeners globais
    initGlobalEventListeners();
    
    console.log('Aplicação Kanban inicializada com sucesso!');
});

function initGlobalEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair?')) {
            AuthService.logout();
        }
    });

    // Filtro (placeholder para funcionalidade futura)
    const filterBtn = document.getElementById('filter-btn');
    filterBtn.addEventListener('click', () => {
        console.log('Filtro clicado - funcionalidade a ser implementada');
        // Aqui você pode adicionar lógica de filtro mais avançada
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // ESC para fechar modais
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                }
            });
        }
        
        // Ctrl+N para novo projeto
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            if (window.modalManager) {
                window.modalManager.openProjectModal();
            }
        }
    });

    // Error handling global
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Erro não tratado:', event.reason);
        // Aqui você pode implementar um sistema de notificação de erros
    });
}

// Utilities globais
window.KanbanUtils = {
    formatDate: (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR');
    },
    
    getPriorityColor: (priority) => {
        const colors = {
            high: '#dc3545',
            medium: '#856404',
            low: '#155724'
        };
        return colors[priority] || colors.medium;
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};
