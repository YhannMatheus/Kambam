# 🎯 KAMBAN - Sistema de Gerenciamento de Projetos

Um sistema completo de gerenciamento de projetos estilo Kanban, desenvolvido com tecnologias modernas e arquitetura limpa.

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20TypeScript-blue)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-orange)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Tests](https://img.shields.io/badge/Tests-50%20passed-green)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **KAMBAN** é um sistema de gerenciamento de projetos que implementa a metodologia Kanban, permitindo que equipes organizem suas tarefas em quadros visuais com colunas personalizáveis. O projeto foi desenvolvido seguindo princípios de **Clean Architecture** e **Domain-Driven Design**.

### ✨ Principais Características

- 🔐 **Autenticação JWT** - Sistema seguro de login/registro
- 👥 **Gestão de Times** - Criação e gerenciamento de equipes
- 📁 **Projetos** - Organização de trabalho por projetos
- 📋 **Colunas Customizáveis** - Fluxo de trabalho flexível
- ✅ **Tarefas Dinâmicas** - Movimentação drag-and-drop entre colunas
- 🧪 **100% Testado** - Cobertura completa de testes unitários

## 🚀 Funcionalidades

### 👤 Gestão de Usuários
- [x] Registro de novos usuários
- [x] Autenticação com JWT
- [x] Perfil do usuário
- [x] Participação em múltiplos times

### 👥 Gestão de Times
- [x] Criação de times
- [x] Convite de membros
- [x] Controle de permissões

### 📁 Gestão de Projetos
- [x] Criação de projetos
- [x] Associação com times
- [x] Projetos individuais e em equipe

### 📋 Gestão de Colunas
- [x] Colunas customizáveis
- [x] Ordenação por drag-and-drop
- [x] Múltiplas colunas por projeto

### ✅ Gestão de Tarefas
- [x] Criação de tarefas
- [x] Movimentação entre colunas
- [x] Descrições detalhadas
- [x] Ordenação personalizada

## 🛠 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express.js** - Framework web
- **Prisma ORM** - Object-Relational Mapping
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Jest** - Framework de testes
- **Supertest** - Testes de API

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna
- **JavaScript ES6+** - Interatividade
- **Fetch API** - Comunicação com backend
- **Drag and Drop API** - Funcionalidade Kanban

### DevOps & Ferramentas
- **Docker** - Containerização
- **Git** - Controle de versão
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

## 🏗 Arquitetura

O projeto segue os princípios da **Clean Architecture** com separação clara de responsabilidades:

```
├── backend/
│   ├── src/
│   │   ├── core/           # Configurações e utilitários
│   │   ├── users/          # Módulo de usuários
│   │   ├── projects/       # Módulo de projetos
│   │   ├── columns/        # Módulo de colunas
│   │   └── tasks/          # Módulo de tarefas
│   └── tests/              # Testes unitários
└── frontend/               # Interface do usuário
```

### Padrões Implementados
- **Repository Pattern** - Abstração de acesso a dados
- **Controller Pattern** - Lógica de apresentação
- **Service Pattern** - Regras de negócio
- **Middleware Pattern** - Interceptação de requisições

## 🚀 Instalação

### Pré-requisitos
- Node.js (v18 ou superior)
- PostgreSQL (v13 ou superior)
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/YhannMatheus/Kambam.git
cd Kambam
```

### 2. Configuração do Backend
```bash
cd backend
npm install
```

### 3. Configuração do Banco de Dados
```bash
# Copie o arquivo de ambiente
cp .env.example .env

# Configure suas variáveis no arquivo .env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/kamban"
JWT_SECRET="seu-jwt-secret-aqui"
PORT=3000
```

### 4. Execute as migrações
```bash
npx prisma migrate dev
```

### 5. Inicie o servidor
```bash
npm run dev
```

### 6. Configure o Frontend
```bash
cd ../frontend
# Abra o index.html em um servidor local
# Exemplo: Live Server no VSCode ou Python HTTP Server
python -m http.server 8080
```

## 📖 Uso

### Acesso ao Sistema
1. Acesse o frontend em `http://localhost:8080`
2. Registre uma nova conta ou faça login
3. Crie seu primeiro projeto
4. Adicione colunas (ex: "A Fazer", "Em Progresso", "Concluído")
5. Comece a criar e mover tarefas!

### Exemplo de Fluxo
```javascript
// 1. Registro de usuário
POST /api/users/register
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123"
}

// 2. Login
POST /api/users/login
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}

// 3. Criar projeto
POST /api/projects
{
  "name": "Meu Primeiro Projeto"
}

// 4. Criar colunas
POST /api/columns
{
  "name": "A Fazer",
  "projectId": "project-id",
  "order": 1
}
```

## 🔌 API Endpoints

### 👤 Usuários (`/api/users`)
```
POST   /api/users/register    # Registrar usuário
POST   /api/users/login       # Fazer login
GET    /api/users/profile     # Obter perfil (🔒)
```

### 📁 Projetos (`/api/projects`)
```
POST   /api/projects          # Criar projeto (🔒)
GET    /api/projects          # Listar projetos (🔒)
GET    /api/projects/:id      # Obter projeto (🔒)
PUT    /api/projects/:id      # Atualizar projeto (🔒)
DELETE /api/projects/:id      # Deletar projeto (🔒)
```

### 📋 Colunas (`/api/columns`)
```
POST   /api/columns                    # Criar coluna (🔒)
GET    /api/columns/project/:projectId # Listar colunas do projeto (🔒)
GET    /api/columns/:id               # Obter coluna (🔒)
PUT    /api/columns/:id               # Atualizar coluna (🔒)
DELETE /api/columns/:id               # Deletar coluna (🔒)
```

### ✅ Tarefas (`/api/tasks`)
```
POST   /api/tasks                   # Criar tarefa (🔒)
GET    /api/tasks/column/:columnId  # Listar tarefas da coluna (🔒)
GET    /api/tasks/:id               # Obter tarefa (🔒)
PUT    /api/tasks/:id               # Atualizar tarefa (🔒)
PUT    /api/tasks/:id/move          # Mover tarefa (🔒)
DELETE /api/tasks/:id               # Deletar tarefa (🔒)
```

🔒 = Requer autenticação (Bearer Token)

## 🧪 Testes

O projeto possui **100% de cobertura** de testes unitários para todas as rotas da API.

### Executar Testes
```bash
cd backend

# Todos os testes
npm test

# Testes específicos
npm test -- tests/users/users.routes.test.js
npm test -- tests/projects/projects.routes.test.js
npm test -- tests/columns/columns.routes.test.js
npm test -- tests/tasks/tasks.routes.test.js

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

### Estatísticas de Testes
- **50 testes** executados
- **4 suítes** de teste
- **100% passa** ✅
- **Tempo médio**: ~1.2s

## 📁 Estrutura do Projeto

```
KAMBAN/
├── backend/                     # API Backend
│   ├── src/
│   │   ├── core/               # Configurações centrais
│   │   │   ├── database/       # Conexão com BD
│   │   │   ├── errors/         # Classes de erro
│   │   │   ├── middleware/     # Middlewares
│   │   │   └── services/       # Serviços compartilhados
│   │   ├── users/              # Módulo Usuários
│   │   │   ├── controllers/    # Controladores
│   │   │   ├── domain/         # Repositórios
│   │   │   └── infraestructure/ # Rotas
│   │   ├── projects/           # Módulo Projetos
│   │   ├── columns/            # Módulo Colunas
│   │   ├── tasks/              # Módulo Tarefas
│   │   └── index.ts            # Servidor principal
│   ├── tests/                  # Testes unitários
│   ├── prisma/                 # Schema e migrações
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # Interface Web
│   ├── css/                    # Estilos
│   ├── js/                     # Scripts
│   ├── login.html              # Página de login
│   ├── index.html              # Página principal
│   └── Cardprojetos.html       # Gestão de projetos
├── .gitignore
└── README.md
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Diretrizes
- Mantenha o código limpo e bem documentado
- Adicione testes para novas funcionalidades
- Siga os padrões de código existentes
- Atualize a documentação quando necessário

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Desenvolvedor

**Yhann Matheus**
- GitHub: [@YhannMatheus](https://github.com/YhannMatheus)
- LinkedIn: [Yhann Matheus](https://linkedin.com/in/yhann-matheus)

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

Made with ❤️ by [Yhann Matheus](https://github.com/YhannMatheus)

</div>
