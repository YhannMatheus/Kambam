import bcrypt from 'bcrypt';
export class CryptService {
    static hashPassword(password) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
    static comparePasswords(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
}
//# sourceMappingURL=crypt.service.js.map