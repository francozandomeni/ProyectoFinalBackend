import __dirname from "../utils.js"
import swaggerJsDoc from "swagger-jsdoc"
import path from "path"

const swaggerOptions = {
    definition: {
        openapi: "3.0.1", 
        info:{
            title: "Documentacion api",
            version: "1.0.0",
            description: "Definicion de endpoints para la api de eCommerce"
        }
    },
    apis:[`${path.join(__dirname, "../src/docs/**/*.yaml")}`] //archivos con las especificaciones de las rutas
}

export const swaggerSpecs = swaggerJsDoc(swaggerOptions)
// console.log(swaggerSpecs)