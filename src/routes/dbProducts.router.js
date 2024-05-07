import { Router } from "express"
import { ProductsController } from "../controllers/dbProducts.controller.js";
import { errorHandler } from "../middleware/errorHandler.js"
import { addLogger } from "../utils/logger.js";
import { checkRole } from "../middleware/auth.js"
import {upload} from "../middleware/multer.js"


const router = Router()

const checkAuth = (req, res, next) => {
    console.log("MIDDLEWARE AUTH", req.session.user)
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(400).send({
    status: "error",
    error: "No autenticado",
  });

};

router.get('/', addLogger,ProductsController.get)

router.get('/:pid', addLogger, ProductsController.getById);

router.post("/", addLogger, checkRole(["admin", "premium"]), upload.single('thumbnail'), ProductsController.add);

//testing sin role
// router.post("/testing", addLogger, ProductsController.add);

router.put('/:pid/:uid', addLogger, ProductsController.update);

router.delete('/:pid/:uid',ProductsController.delete);

router.use((err, req, res, next) => {
    errorHandler(err, req, res, next);
});



export default router