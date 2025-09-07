interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}
export declare function register(data: RegisterData): Promise<{
    name: string;
    id: string;
    email: string;
    password: string;
    role: import("generated/prisma/index.js").$Enums.UserRole;
    createdAt: Date;
}>;
export {};
//# sourceMappingURL=register.controller.d.ts.map