import type { SignOptions, JwtPayload } from 'jsonwebtoken';
interface TokenPayload extends JwtPayload {
    userId: string;
    email: string;
}
export declare class AuthService {
    private static secret;
    static generateToken(payload: TokenPayload, options?: SignOptions): string;
    static verifyToken<T extends object = TokenPayload>(token: string): T | null;
}
export {};
//# sourceMappingURL=auth.service.d.ts.map