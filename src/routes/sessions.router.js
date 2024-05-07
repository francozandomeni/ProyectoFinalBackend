import { Router } from "express";
import {SessionsController} from "../controllers/sessions.controller.js"
import passport from "passport";
// import {checkRole} from "../middleware/auth.js"


const router = Router();

const checkAuth = (req, res, next) => {
      // console.log(req.user)
    if (req.isAuthenticated()) {
      return next();
    }
    
    res.status(400).send({
      status: "error",
      error: "No autenticado",
    });

  };

router.post("/register",passport.authenticate("register", {failureRedirect:"/api/sessions/failregister"}),
SessionsController.register
)

router.get("/failregister", SessionsController.failRegister)

router.post("/login", passport.authenticate("login", {failureRedirect:'/api/sessions/faillogin'}),
SessionsController.login)

router.get("/faillogin", SessionsController.failLogin)

router.get('/logout', SessionsController.logout)

router.get("/github", passport.authenticate("github", {scope:['user:email']}), async (req,res)=>{});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:'/login'}),SessionsController.gitHubCallback);


  
router.get("/current", SessionsController.currentUser);

// router.use((err, req, res, next) => {
//     errorHandler(err, req, res, next);
// });

router.post("/forgot-password", SessionsController.forgotPassword)

router.post("/reset-password", SessionsController.resetPassword)




export default router;