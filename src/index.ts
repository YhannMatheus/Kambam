import express from 'express';
import dotenv from 'dotenv';
import { DatabaseService } from './core/database/database.js';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing JSON
app.use(express.json());

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KAMBAM API está funcionando com UUIDs',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('API KAMBAM rodando com UUIDs!');
});

// Inicia o servidor
async function startServer() {
  try {
    // Conecta ao banco de dados
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

// Tratamento de sinais para shutdown graceful
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
