export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class PaymentProviderError extends AppError {
  constructor(message) {
    super(message, 502, 'PAYMENT_PROVIDER_ERROR');
  }
}
