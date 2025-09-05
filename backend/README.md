# KAMBAM API

API para gerenciamento de quadros Kanban (KAMBAM) com autenticação de usuários, equipes, projetos, colunas e tarefas.

## Tecnologias
- TypeScript
- Express
- Prisma ORM
- PostgreSQL

## Funcionalidades
- Registro e login de usuários
- Usuários podem participar de equipes
- Equipes podem ter vários projetos
- Projetos podem ter várias colunas
- Colunas podem ter várias tarefas
- Tarefas pertencem a colunas e podem ser movidas entre colunas

## Como rodar
1. Instale as dependências: `npm install`
2. Configure o banco de dados no arquivo `.env`
3. Rode as migrations: `npx prisma migrate dev`
4. Inicie a API: `npm run dev`

## Estrutura sugerida
- src/
  - controllers/
  - routes/
  - services/
  - prisma/
  - middlewares/
  - utils/

## Observações
- Código simples e legível para facilitar manutenção.
- Substitua variáveis de ambiente conforme necessário.
