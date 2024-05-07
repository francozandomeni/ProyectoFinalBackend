import nodemailer from "nodemailer"
import { options } from "./config.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";


const adminEmail = options.gmail.adminAccount
const adminPass = options.gmail.adminPass

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: adminEmail,
        pass: adminPass
    },
    secure: false,
    tls: { rejectUnauthorized: false }
})

export { transporter }

export const sendRecoveryPass = async (userEmail, token) => {
    const link = `/reset-password?token=${token}`
    await transporter.sendMail({
        from: options.gmail.adminEmail,
        to: userEmail,
        subject: "Restablecimiento de contraseña",
        html: `
        <div>
            <h2>Has solicitado un cambio de contraseña</h2>
            <p>Haz click en el siguiente enlace para restablecer la contraseña</p>
            <a href="${link}">
                <button>Restablecer contraseña</button>
            </a>
            <h1>Por favor, siempre chequea que el origen de estos emails sea del dueño y/o creador de la pagina que tratas de cambiar la contraseña. Ademas, ten en cuenta que nunca te pediremos informacion sensible a traves de email u otro entorno que no sea el de la plataforma oficial. Ten precaucion.</h1>
        </div>`
    })


}

export const sendEmailToUserCreated = async (userEmail) => {
    const link = `http://localhost:8080/login`
    await transporter.sendMail({
        from: options.gmail.adminEmail,
        to: userEmail,
        subject: "Bienvenido al mejor ecommerce del condado!",
        html: `
        <div>
            <h1>Tu cuenta ha sido creada correctamente</h1>
            <p>Haz click en el siguiente enlace para ingresar</p>
            <a href="${link}">
                <button>Iniciar sesion</button>
            </a>
            <h2>Estamos muy contentos de tenerte con nosotros.</h2>
            </div>`
    })
}



export const sendEmailToUserDeleted = async (userEmail) => {
    const link = `http://localhost:8080/register`
    await transporter.sendMail({
        from: options.gmail.adminEmail,
        to: userEmail,
        subject: "Cuenta eliminada por inactividad",
        html: `
        <div>
            <h2>Tu cuenta ha sido eliminada</h2>
            <p>Haz click en el siguiente enlace para crearla de nuevo</p>
            <a href="${link}">
                <button>Crear cuenta</button>
            </a>
            <h1>Lamentamos haber tenido que eliminar tu cuenta. Somos muy rigurosos con los usuarios y las cuentas fake que se crean, por eso no tenemos ningun tipo de paciencia ni piedad a los usuarios inactivos por mas de 10 minutos.</h1>
        </div>`
    })
}


export const sendEmailToUserDeletedByAdmin = async (userEmail) => {
    const link = `http://localhost:8080/register`
    await transporter.sendMail({
        from: options.gmail.adminEmail,
        to: userEmail,
        subject: "Cuenta eliminada por los administradores de la pagina",
        html: `
        <div>
            <h1>Tu cuenta ha sido eliminada</h1>
            <h2>Hemos detectado actividad inusual en tu cuenta, por eso hemos decidido eliminarla.</h2>
            <p>Haz click en el siguiente enlace para crearla de nuevo</p>
            <a href="${link}">
                <button>Crear cuenta</button>
            </a>
        </div>`
    })
}

export const sendEmailDeletedProduct = async (userEmail, product) =>{
    const link = `http://localhost:8080/login`
    
    await transporter.sendMail({
        from: options.gmail.adminEmail,
        to: userEmail,
        subject: `El producto que usted ha publicado con el nombre ${product.title} ha sido eliminado`,
        html: `
        <div>
            <h2>Su producto con el nombre ha sido eliminado</h2>
            <h3>Detalle del producto:</h3>
            <p>Nombre: ${product.title}
            Descripcion:${product.description}
            Codigo:${product.code}
            ID: ${product._id}
            </p>
            <p>Haz click en el siguiente enlace para iniciar sesion y publicarlo de nuevo.</p>
            <a href="${link}">
                <button>Crear producto</button>
            </a>
            <p>Por cualquier informacion contactese por este mismo medio a este mismo correo electronico. Gracias</p>
        </div>`
    })
}

export const sendEmailUpdatedProduct = async (userEmail, product) =>{
    const link = `http://localhost:8080/login`
    
    await transporter.sendMail({
        from: options.gmail.adminEmail,
        to: userEmail,
        subject: `El producto con el nombre ${product.title} ha sido actualizado`,
        html: `
        <div>
            <h2>Detalle del producto:</h2>
            <p>Nombre: ${product.title}
            Descripcion:${product.description}
            Codigo:${product.code}
            ID: ${product._id}
            </p>
            <p>Haz click en el siguiente enlace para iniciar sesion.</p>
            <a href="${link}">
                <button>Crear producto</button>
            </a>
            <p>Por cualquier informacion contactese por este mismo medio a este mismo correo electronico. Gracias</p>
        </div>`
    })
}

export const sendEmailPurchaseMade = async (userEmail, ticket) =>{
    const link = `http://localhost:8080/login`
    
    await transporter.sendMail({
        from: options.gmail.adminEmail,
        to: userEmail,
        subject: `Registramos correctamente la compra con el monto de $ ${ticket.amount}`,
        html: `
        <div>
            <h2>Detalle de la compra:</h2>
            <p><strong>Fecha:</strong>${ticket.purchase_datetime}</p>
            <p><strong>Codigo del ticket:</strong> ${ticket.code}</p>
            <p><strong>Comprador:</strong> ${ticket.purchaser}</p>
            <p><strong>Haz click en el siguiente enlace para iniciar sesion y seguir comprando.</strong></p>
            <a href="${link}">
                <button>Iniciar sesion</button>
            </a>
            <p>Por cualquier informacion contactese por este mismo medio a este mismo correo electronico. Gracias</p>
        </div>`
    })
}


export const isValidPassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password)
};

export const generateEmailToken = (email,expireTime)=>{
    const token = jwt.sign({email},adminPass,{expiresIn:expireTime}); 
    return token;
};

export const verifyEmailToken = (token)=>{
    try {
        const info = jwt.verify(token,adminPass);
        console.log(info);
        return info.email;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};