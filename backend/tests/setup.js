// Setup global para testes
// Mock do Prisma para testes
export const mockPrisma = {
    user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    session: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
    },
    project: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    column: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    $disconnect: jest.fn(),
};
// Setup global para testes
beforeEach(() => {
    jest.clearAllMocks();
});
// Limpar após todos os testes
afterAll(async () => {
    // Cleanup se necessário
});
//# sourceMappingURL=setup.js.map