import jwt from 'jsonwebtoken';
import type { SignOptions, JwtPayload } from 'jsonwebtoken';


interface TokenPayload extends JwtPayload {
    userId: string;
    email: string;
}

export class AuthService {
	private static secret = process.env.JWT_SECRET || 'default_secret';

	static generateToken(payload: TokenPayload, options?: SignOptions): string {
		return jwt.sign(payload, this.secret, { expiresIn: '1d', ...options });
	}

	static verifyToken<T extends object = TokenPayload>(token: string): T | null {
		try {
			return jwt.verify(token, this.secret) as T;
		} catch (err) {
			return null;
		}
	}
}