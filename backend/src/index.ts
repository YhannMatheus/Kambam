import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseService } from './core/database/database.js';
import { UserRoutes } from './users/infraestructure/users.infraestructure.js';
import { ProjectRoutes } from './projects/infraestructure/projects.infraestructure.js';
import { ColumnRoutes } from './columns/infraestructure/columns.infraestructure.js';
import { TaskRoutes } from './tasks/infraestructure/tasks.infraestructure.js';
import { AdminRoutes } from './admin/infraestructure/admin.infrastructure.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'http://localhost:5173', // Frontend local
    'http://localhost:3000', // Backend local (caso necessário)
    'http://localhost:8080', // Python http.server
    'http://127.0.0.1:8080', // Python http.server alternativo
    'http://localhost:5500', // Live Server
    'http://127.0.0.1:5500', // Live Server alternativo
    // Adicione outras origens permitidas aqui
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Registrar todas as rotas da API
app.use('/api/users', UserRoutes);
app.use('/api/projects', ProjectRoutes);
app.use('/api/columns', ColumnRoutes);
app.use('/api/tasks', TaskRoutes);
app.use('/api/admin', AdminRoutes);


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
