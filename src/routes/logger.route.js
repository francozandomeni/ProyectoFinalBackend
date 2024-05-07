import { Router } from "express"
import {addLogger} from "../utils/logger.js"

const router = Router()

router.use(addLogger)

router.get("/debug", (req,res)=> {
    req.logger.debug("debug")
    res.send("debug")
})

router.get("/http", (req,res)=> {
    req.logger.http("http")
    res.send("http")
})


router.get("/info", (req,res)=> {
    req.logger.info("info buscando ruta")
    res.send("Bienvenido")
})

router.get("/warn", (req,res)=> {
    req.logger.warn("warn buscando ruta")
    res.send("Warn")
})

router.get("/error", (req,res)=> {
    req.logger.error("error buscando ruta")
    res.send("Error")
})

router.get("/fatal", (req,res)=> {
    req.logger.fatal("fatal")
    res.send("fatal")
})






export default router