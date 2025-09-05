import { PrismaClient } from "../../generated/prisma/index.js";

class DatabaseService {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
    }
    return DatabaseService.instance;
  }

  public static async connect(): Promise<void> {
    try {
      await this.getInstance().$connect();
      console.log('✅ Conectado ao banco de dados PostgreSQL');
    } catch (error) {
      console.error('❌ Erro ao conectar ao banco de dados:', error);
      process.exit(1);
    }
  }

  public static async disconnect(): Promise<void> {
    try {
      await this.getInstance().$disconnect();
      console.log('✅ Desconectado do banco de dados');
    } catch (error) {
      console.error('❌ Erro ao desconectar do banco de dados:', error);
    }
  }
}

const prisma = DatabaseService.getInstance();

export default prisma;
export { DatabaseService };
