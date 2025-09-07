export class UserNotFoundError extends Error {
    status = 404;
    constructor(message = 'Usuário não encontrado') {
        super(message);
        this.name = 'UserNotFoundError';
    }
}
//# sourceMappingURL=user-not-found-error.js.map