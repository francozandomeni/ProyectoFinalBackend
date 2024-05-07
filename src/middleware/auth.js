import jwt from "jsonwebtoken"

export const checkRole = (roles)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.status(500).send(`<h2>Necesitas estar autenticado para ingresar a este página.</h2> <h3 class="send"><a href="/login">Click aqui para loguearte</a> <br> <a href="/register">Click aqui para registrarte</a></h3>`)
        }
        if(!roles.includes(req.user.role)){
            return res.status(500).send(`<h2>No estas autorizado para ingresar a esta página. Solo clientes premium o administradores.</h2> <h3 class="send"> <br> <a href="/">Click aqui para ir al inicio</a></h3>`)
        }
        next();
    }
}



export const verifyEmailTokenMW = () => {

    return (req, res, next) => {
        try {

            const jwtToken = req.query.token;
            const decoded = jwt.decode(jwtToken)
            const expTime = decoded.exp * 1000
            const expDate = new Date(expTime)
            const currentDate = new Date()

            if (currentDate > expDate) {
                return res.json ({status: "error", message:"Token vencido"})
            }



        } catch (error) {
            return res.json({ status: "error", message: "Error en el token" })
        }
        next()
    }
}