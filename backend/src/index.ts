import express from 'express';
import dotenv from 'dotenv';
import { DatabaseService } from './core/database/database.js';
import { UserRoutes } from './users/infraestructure/users.infraestructure.js';
import { ProjectRoutes } from './projects/infraestructure/projects.infraestructure.js';
import { ColumnRoutes } from './columns/infraestructure/columns.infraestructure.js';
import { TaskRoutes } from './tasks/infraestructure/tasks.infraestructure.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Registrar todas as rotas da API
app.use('/api/users', UserRoutes);
app.use('/api/projects', ProjectRoutes);
app.use('/api/columns', ColumnRoutes);
app.use('/api/tasks', TaskRoutes);


// Rota de teste
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KAMBAM API está funcionando com UUIDs',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('API KAMBAM rodando!');
});

async function startServer() {
  try {
    await DatabaseService.connect();
    console.log('✅ Banco de dados conectado com sucesso');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\n🔄 Encerrando servidor...');
  await DatabaseService.disconnect();
  console.log('✅ Servidor encerrado');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Encerrando servidor...');
  await DatabaseService.disconnect();
  console.log('✅ Servidor encerrado');
  process.exit(0);
});

startServer();
