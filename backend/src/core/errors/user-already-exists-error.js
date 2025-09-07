export class UserAlreadyExistsError extends Error {
    status = 409;
    constructor(message = 'Usuário já cadastrado') {
        super(message);
        this.name = 'UserAlreadyExistsError';
    }
}
//# sourceMappingURL=user-already-exists-error.js.map