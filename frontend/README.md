# Frontend do Sistema Kanban

Este é um frontend simples e organizado para o sistema Kanban, construído com HTML, CSS e JavaScript vanilla.

## Estrutura do Projeto

```
frontend/
├── index.html          # Página principal (requer autenticação)
├── login.html          # Página de login/registro
├── css/
│   └── styles.css      # Estilos da aplicação
└── js/
    ├── config.js       # Configurações da aplicação
    ├── auth.js         # Serviços de autenticação
    ├── api.js          # Serviços de API
    ├── modal.js        # Gerenciamento de modais
    ├── kanban.js       # Lógica do quadro Kanban
    ├── login.js        # Lógica da página de login
    └── app.js          # Inicialização da aplicação
```

## Como Executar

### Opção 1: Abrir diretamente no navegador
1. Navegue até a pasta `frontend`
2. Abra o arquivo `index.html` no seu navegador

### Opção 2: Servidor local com Python
```bash
cd frontend
python -m http.server 8080
```
Acesse: http://localhost:8080

### Opção 3: Servidor local com Node.js
```bash
npm install -g serve
cd frontend
serve .
```

### Opção 4: Live Server (VS Code)
1. Instale a extensão "Live Server" no VS Code
2. Clique com o botão direito no `index.html`
3. Selecione "Open with Live Server"

## Funcionalidades

- ✅ Sistema de autenticação (login/registro)
- ✅ Visualização de projetos em formato Kanban
- ✅ Criação de novos projetos
- ✅ Criação de novas tarefas
- ✅ Drag and drop entre colunas
- ✅ Busca por tarefas
- ✅ Design responsivo
- ✅ Integração completa com backend

## Configuração

Edite o arquivo `js/config.js` para alterar a URL do backend:

```javascript
const CONFIG = {
    API_BASE: 'http://localhost:3000', // Altere conforme necessário
    // ...
};
```

## Dependências

- Font Awesome 6.4.0 (via CDN)
- Navegador moderno com suporte a ES6+

## Customização

### Adicionando novos estilos
Edite `css/styles.css` para personalizar a aparência.

### Adicionando novas funcionalidades
1. Para API: edite `js/api.js`
2. Para modais: edite `js/modal.js`
3. Para o quadro Kanban: edite `js/kanban.js`
4. Para funcionalidades globais: edite `js/app.js`

## Próximas Melhorias

- [ ] Autenticação de usuários
- [ ] Notificações toast
- [ ] Seletor de projetos
- [ ] Edição de tarefas
- [ ] Filtros avançados
- [ ] Modo escuro
- [ ] Offline support
