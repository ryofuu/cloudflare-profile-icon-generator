export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends DomainError {}

export class NotFoundError extends DomainError {
  constructor(resource: string, identifier: string) {
    super(`${resource} "${identifier}" was not found.`);
  }
}

export class ConfigurationError extends DomainError {}

