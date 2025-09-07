export class InvalidCredentialsError extends Error {
    status = 401;
    constructor(message = 'E-mail ou senha inválidos') {
        super(message);
        this.name = 'InvalidCredentialsError';
    }
}
//# sourceMappingURL=invalid-credentials-error.js.map