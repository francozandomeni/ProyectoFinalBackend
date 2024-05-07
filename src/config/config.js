import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT
const MONGO = process.env.MONGO
const MONGO_TESTING = process.env.MONGO_TESTING
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASS = process.env.ADMIN_PASS

export const options = {
    server: {
        port: PORT
    },
    mongo: {
        url: MONGO
    },
    gmail: {
        adminAccount: ADMIN_EMAIL,
        adminPass: ADMIN_PASS
    }
}