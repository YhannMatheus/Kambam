import { PrismaClient } from '../../../generated/prisma/index.js';
class DatabaseService {
    static instance;
    static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new PrismaClient({
                log: ['query', 'info', 'warn', 'error'],
            });
        }
        return DatabaseService.instance;
    }
    static async connect() {
        try {
            await this.getInstance().$connect();
            console.log('✅ Conectado ao banco de dados PostgreSQL');
        }
        catch (error) {
            console.error('❌ Erro ao conectar ao banco de dados:', error);
            process.exit(1);
        }
    }
    static async disconnect() {
        try {
            await this.getInstance().$disconnect();
            console.log('✅ Desconectado do banco de dados');
        }
        catch (error) {
            console.error('❌ Erro ao desconectar do banco de dados:', error);
        }
    }
}
const prisma = DatabaseService.getInstance();
export default prisma;
export { DatabaseService };
//# sourceMappingURL=database.js.map