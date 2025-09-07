import jwt from 'jsonwebtoken';
export class AuthService {
    static secret = process.env.JWT_SECRET || 'default_secret';
    static generateToken(payload, options) {
        return jwt.sign(payload, this.secret, { expiresIn: '1d', ...options });
    }
    static verifyToken(token) {
        try {
            return jwt.verify(token, this.secret);
        }
        catch (err) {
            return null;
        }
    }
}
//# sourceMappingURL=auth.service.js.map