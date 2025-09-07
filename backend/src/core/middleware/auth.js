import { AuthService } from '../services/auth.service.js';
export function authMiddleware(req, res, next) {
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
//# sourceMappingURL=auth.js.map