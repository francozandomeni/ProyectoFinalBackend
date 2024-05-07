import { GetUserDto } from "../dao/dto/users.dto.js";
import { CustomError } from "../services/customError.service.js"
import { generateUserErrorInfo } from "../services/UserErrorInfo.js"
import { EError } from "../enums/EError.js"
import { userService } from "../repository/index.js";
import { sendRecoveryPass, verifyEmailToken, isValidPassword, generateEmailToken, sendEmailToUserCreated } from "../config/gmail.js";
import { createHash } from "../utils.js";
import userModel from "../dao/models/Users.models.js";
import jwt from 'jsonwebtoken';

class SessionsController {
    static register = async (req, res) => {
        try {

            const { first_name, last_name, email } = req.body;
            

            if (!first_name || !last_name || !email) {
                throw CustomError.createError({
                    name: "User create error",
                    cause: generateUserErrorInfo(req.body),
                    message: "Error creando el usuario",
                    errorCode: EError.EMPTY_FIELDS
                })
            }

            await req.user.save();

            await sendEmailToUserCreated(email)
            
            // console.log("sessions controller register", req.session.user)
            res.status(200).send(`Usuario registrado con exito.`)
        } catch (error) {
            console.error(error);
            res.status(500).send({
                status: "error",
                error: "Error en el registro"
            });
        }
    }

    static failRegister = async (req, res) => {
        console.log('Fallo el registro');
        res.send({ error: 'fallo en el registro' })
    }

    static login = async (req, res) => {
        if (!req.user) {
            return res.status(400).send(`<h2>No se encuentra el usuario.</h2> <h3 class="send"><a href="http://localhost:8080/register">Click aqui para registrarte</a></h3>`)
        }

        
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role,
            last_connection: new Date().toLocaleString()
        }
        // console.log(req.user)
        const userId = req.user._id
        await userModel.findByIdAndUpdate(userId, { last_connection: new Date() })

        res.send({
            status: "success",
            payload: req.session.user,
           
        })
    }

    static failLogin = (req, res) => {
        res.send({ error: "fail login" })
    }

    static logout = async (req, res) => {
        try{
        const userId = req.user._id
        // console.log(`weeeeeeeonnnn`,userId)
        await userModel.findByIdAndUpdate(userId, { last_connection: new Date() })

        req.session.destroy(err => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    error: 'No se pudo desloguear'
                })
            }
            res.redirect('/login')
            // res.status(200).send(`deslogueado correctamente`)
        })} catch (error){
            res.status(500).send(`Error cerrando sesion`)
        }

    }

    static gitHubCallback = async (req, res) => {
        req.session.user = req.user;
        res.redirect("/")
    }

    static currentUser = (req, res) => {
        try {
            if (req.user) {
                const userDTO = new GetUserDto(req.user);
                res.status(200).json({
                    status: "success",
                    user: userDTO
                });
            } else {
                res.status(401).json({
                    status: "error",
                    message: "No hay sesión de usuario activa"
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "error",
                message: "Error al obtener el usuario actual"
            })
        }
    }

    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body
            const user = await userService.getByEmail({ email })
            if (!user) {
                res.send(`<div>Error, no existe el usuario. <a href="/forgot-password">Intente de nuevo</a></div>`)
            }
            
            const token = generateEmailToken(email, 60*15)
            
            await sendRecoveryPass(email, token)
            res.send("Se ha enviado el correo de recuperacion.")

        } catch (error) {
            res.send(`<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`)
        }
    }

    static resetPassword = async (req, res) => {
        try {
            const token = req.query.token;
            const { email, newPassword } = req.body;

            const validToken = verifyEmailToken(token)

            if(!validToken){
                return res.send(`El token ya no es valido`)
            }

            const user = await userService.getByEmail({ email })

            if(!user){
                return res.send("el usuario no esta registrado")
            }

            if(isValidPassword(newPassword, user)) {
                res.send("No se puede usar la misma contrasena")
            }

            const userData = {
                ...user._doc,
                password: createHash(newPassword)
            }

            const updateUser = await userService.updateByEmail({email}, userData)
            
            res.render("login", {message:"Contrasena actualizada"})

        } catch (error) {
            console.log(error)
            res.send(`<div>Error, hable con el administrador.</div>`)
        }
    }

 
}


export { SessionsController }