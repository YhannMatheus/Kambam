# KAMBAM Frontend

Frontend React para o sistema de gerenciamento Kanban KAMBAM.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. **Clone o repositório e navegue para o frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   
   Crie um arquivo `.env` na raiz do projeto frontend com:
   ```env
   VITE_API_BASE_URL=http://localhost:3333
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação:**
   
   Abra seu navegador em [http://localhost:5173](http://localhost:5173)

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter ESLint

## 🏗️ Tecnologias Utilizadas

- **React** - Biblioteca para interfaces de usuário
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **HTML5 Drag & Drop API** - Para funcionalidade de arrastar e soltar

## 📋 Funcionalidades

### Autenticação
- ✅ Login de usuários
- ✅ Registro de novos usuários
- ✅ Gerenciamento de token JWT
- ✅ Persistência de sessão no localStorage

### Gerenciamento de Projetos
- ✅ Listar projetos do usuário
- ✅ Criar novos projetos
- ✅ Excluir projetos

### Kanban Board
- ✅ Visualização de colunas e tarefas
- ✅ Drag & Drop de tarefas entre colunas
- ✅ Criar novas colunas
- ✅ Criar novas tarefas
- ✅ Editar tarefas existentes

## 🎨 Interface

### Páginas
- **Login** (`#login`) - Autenticação de usuários
- **Registro** (`#register`) - Criação de conta
- **Home** (`#home`) - Lista de projetos
- **Board** (`#board`) - Visualização do Kanban

### Componentes Principais
- `AuthProvider` - Context para gerenciamento de autenticação
- `ProjectsList` - Lista e gerenciamento de projetos
- `KanbanBoard` - Interface principal do Kanban
- `TaskModal` - Modal para edição de tarefas

## 🔧 Configuração da API

O frontend comunica-se com o backend através das seguintes rotas:

### Autenticação
- `POST /api/users/login` - Login
- `POST /api/users/register` - Registro
- `GET /api/users/profile` - Perfil do usuário

### Projetos
- `GET /api/projects` - Listar projetos
- `POST /api/projects` - Criar projeto
- `DELETE /api/projects/:id` - Excluir projeto

### Colunas
- `GET /api/columns?projectId=:id` - Listar colunas do projeto
- `POST /api/columns` - Criar coluna

### Tarefas
- `POST /api/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `POST /api/tasks/:id/move` - Mover tarefa entre colunas

## 🎯 Como Usar

### 1. Acesso ao Sistema
1. Acesse a aplicação em `http://localhost:5173`
2. Se não tiver conta, clique em "Criar conta" para se registrar
3. Faça login com suas credenciais

### 2. Gerenciamento de Projetos
1. Na página inicial, visualize seus projetos existentes
2. Clique em "Novo projeto" para criar um projeto
3. Clique em "Abrir" para acessar o board do projeto

### 3. Usando o Kanban Board
1. **Criar Colunas**: Clique no botão "+" no cabeçalho de qualquer coluna
2. **Criar Tarefas**: Clique em "+ Nova tarefa" na parte inferior de uma coluna
3. **Mover Tarefas**: Arraste e solte tarefas entre colunas
4. **Editar Tarefas**: Dê duplo clique em uma tarefa para abrir o modal de edição

## 🔒 Segurança

- Tokens JWT são armazenados no localStorage
- Todas as requisições à API incluem o token de autorização
- Redirecionamento automático para login quando token é inválido

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

O build será gerado na pasta `dist/` e pode ser servido por qualquer servidor web estático.

### Variáveis de Ambiente para Produção
```env
VITE_API_BASE_URL=https://sua-api-backend.com
```

## 🐛 Troubleshooting

### Problema: Erro de CORS
**Solução**: Certifique-se de que o backend está configurado para aceitar requisições do frontend.

### Problema: Token inválido
**Solução**: Limpe o localStorage do navegador ou faça logout e login novamente.

### Problema: Tailwind CSS não carregando
**Solução**: Verifique se os arquivos `tailwind.config.js` e `postcss.config.js` estão configurados corretamente.

## 📝 Notas de Desenvolvimento

- O projeto usa roteamento baseado em hash (`#login`, `#register`, etc.)
- Estado global é gerenciado via React Context
- Atualizações otimistas no frontend para melhor UX
- Drag & Drop implementado com HTML5 API nativa

## 🔄 Melhorias Futuras

- [ ] React Router para roteamento avançado
- [ ] WebSocket para atualizações em tempo real
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados
- [ ] Internacionalização (i18n)
- [ ] Modo escuro
- [ ] Notificações push
