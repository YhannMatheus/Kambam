import { PrismaClient } from '../../../generated/prisma/index.js';
declare class DatabaseService {
    private static instance;
    static getInstance(): PrismaClient;
    static connect(): Promise<void>;
    static disconnect(): Promise<void>;
}
declare const prisma: PrismaClient<import("../../../generated/prisma/index.js").Prisma.PrismaClientOptions, never, import("generated/prisma/runtime/library.js").DefaultArgs>;
export default prisma;
export { DatabaseService };
//# sourceMappingURL=database.d.ts.map