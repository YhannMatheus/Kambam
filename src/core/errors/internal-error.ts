export class InternalError extends Error {
  status = 500;
  constructor(message = 'Erro interno do servidor') {
    super(message);
    this.name = 'InternalError';
  }
}
