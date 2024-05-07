

export class CustomError {
    static createError({ name, cause, message, errorCode }) {
        const error = new Error(message);
        error.name = name;
        error.code = errorCode;
        error.cause = cause;

        throw error;
    }
}

