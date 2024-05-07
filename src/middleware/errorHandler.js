import { EError } from "../enums/EError.js";

export const errorHandler = async (error, req, res, next) => {
    switch (error.code) {
        case EError.AUTH_ERROR:
            res.json({ status: "error", error: error.cause, message: error.message })
            break;
        case EError.DATABASE_ERROR:
            res.json({ status: "error", message: error.message })
            break;
        case EError.INVALID_PARAM:
            res.json({ status: "error", error: error.cause })
            break
        case EError.EMPTY_FIELDS:
            res.json({ status: "error", error: error.cause })
            break
        case EError.INVALID_JSON:
            res.json({ status: "error", error: error.cause })
            break
        default:
            res.json({ status: "error", message: "Hubo un error, contacte al equipo de sistemas." })
            break;
    }
}