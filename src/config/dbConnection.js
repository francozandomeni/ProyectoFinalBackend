import mongoose from "mongoose";
import { options } from "./config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(options.mongo.url);
        console.log('Conectado a la base de datos.');
    } catch (error) {
        console.log(`Hubo un error al tratar de conectar a la BD error: ${error}`);
    }
}