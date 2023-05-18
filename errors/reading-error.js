export default class EnvVarAlreadyExistsError extends Error {
  constructor(message, options) {
    super(message, options);
  }
}
