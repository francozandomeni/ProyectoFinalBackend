import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


/*** */
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

/*** */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const PRIVATE_KEY = "CoderKeyVerified";

export const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY,{expiresIn:'1d'})
    return token;
}

export const authToken = (req,res,next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    if(token === "null"){
        return res.status(401).send({status:"error",error: "No autorizado" })
    }
    jwt.verify(token,PRIVATE_KEY,(error,credentials)=>{
        if(error){
            return res.status(401).send({status:"error",error: "No autorizado" })
        }
        req.user = credentials.user;
        next();
    })
}

export default __dirname;
