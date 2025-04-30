import { ErrorType } from "@/types/types"

export interface AppError {
    type: ErrorType
    message: string
  }

export class AnalysisError extends Error {
    constructor(
        public type: ErrorType,
        message: string,
        public statusCode: number
    ) {
        super(message)
        Object.setPrototypeOf(this, AnalysisError.prototype)
    }
}

export class RateLimitError extends AnalysisError {
    constructor() {
        super('RATE_LIMIT', 'Rate limit exceeded: Too many requests. Please try again in a minute.', 429)
    }
}

export class AuthError extends AnalysisError {
    constructor(service: string) {
        super('AUTH', `Invalid ${service} credentials`, 401)
    }
}

export class APIError extends AnalysisError {
    constructor(service: string) {
        super('API', `${service}.`, 502)
    }
}

export class ValidationError extends AnalysisError {
    constructor(message: string) {
        super('VALIDATION', message, 400)
    }
}