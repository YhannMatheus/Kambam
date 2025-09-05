import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

// Estender o tipo Request para incluir user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
            };
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ error: 'Token necessário' });
        return;
    }

    const decoded = AuthService.verifyToken(token);
    
    if (!decoded) {
        res.status(401).json({ error: 'Token inválido' });
        return;
    }

    req.user = decoded;
    next();
}
