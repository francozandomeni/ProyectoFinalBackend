import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/Users.models.js";
import {createHash, validatePassword} from "../utils.js";
import GitHubStrategy from "passport-github2"
import { cartService, userService } from "../repository/index.js";


const LocalStrategy = local.Strategy;



const inicializePassport = () => {

    passport.use("register", new LocalStrategy(
        {passReqToCallback:true, usernameField:"email"},
        async ( req, username, password, done ) => {


        const { first_name, last_name, email, age } = req.body;
        try {

            let user = await userModel.findOne({email:username});
            if(user){
                console.log('Usuario ya registrado');
                return done(null,false)
            }


            const newCart = await cartService.createCart({ products: [] });
            await newCart.save();

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: newCart._id,
                role: "user",
            }
            const result = await userService.createUser(newUser);
            console.log(result)
            return done (null, result);

        } catch (error) {
            return done(error)
        }

    }));

    passport.use("login", new LocalStrategy(
    {usernameField:"email"},
    async (username, password, done)=>{
        try {
            const user = await userModel.findOne({email:username})
            if(!user){
                console.log("No existe el usuario")//res.render
                return done(null, false);
            }
            if(!validatePassword(password, user)){
                console.log("contraseña desconocida")//res.render
                return done(null, false);
            }

           
            return done(null,user)
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user,done)=>{
        try{
            done(null, user._id)
            

        } catch (error) {
            console.error(error)
            done(error)
        }
    });

    passport.deserializeUser(async (id,done)=>{
        let user = await userService.getUserById(id);

        done(null, user);
    });

    function generateRandomPassword(length = 20) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    }
    

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.e8ccfbc76ce39116",
        clientSecret: "a6f91eaa9f22b6a479f9680bbdb473b05e7b8dcc",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userModel.findOne({ email: profile._json.login });
            const newCart = await cartService.createCart({ products: [] });
            
            if (!user) {
                let newUser = {
                    first_name: "",
                    last_name: profile._json.name,
                    email: profile._json.login,
                    age: 18,
                    password: "",
                    cart: newCart._id,
                    role: "user"
                }
                await newCart.save();
                let result = await userModel.create(newUser)
                done(null, result)
            }
            else{
                done(null,user)
            }


        } catch (error) {
            return done(error)
        }

    }))

    


}




export default inicializePassport;