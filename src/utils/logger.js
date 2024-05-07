import winston from "winston";
import path from "path";
import dotenv from "dotenv";

import __dirname from "../utils.js";

dotenv.config();


const customLevels ={
    levels:{
        fatal:0,
        error:1,
        warn:2,
        info:3,
        http:4,
        debug:5
    },
    colors:{
        fatal:"red",
        error:"orange",
        warn:"yellow",
        info:"green",
        http:"blue",
        debug:"white"
    }
}




const devLogger = winston.createLogger({
    levels:customLevels.levels,
    transports:[
        new winston.transports.Console({level:"debug"})
    ]
});

const prodLogger = winston.createLogger({
    transports:[
       new winston.transports.Console({level:"info"}),
       new winston.transports.File({filename: path.join(__dirname,"/logs/errors.log"), level:"error"})
    ]
})

const currentEnv = process.env.NODE_ENV || "development";

export const addLogger = (req,res,next) =>{
    if(currentEnv === "development"){
        req.logger = devLogger;
        console.log("DEV");
    } else {
        req.logger = prodLogger;
        console.log("PROD");
    }
    req.logger.info(`${req.url} - method: ${req.method} `)
    next()
}