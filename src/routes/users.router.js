import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js"
import {checkRole} from "../middleware/auth.js"
import {upload} from "../middleware/multer.js"
import methodOverride from 'method-override';


const router = Router();

router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

router.post("/:uid/documents", upload.single('document'), UsersController.addDocuments)

router.put("/premium/:uid", UsersController.changeRol);

router.put("/updateUser",checkRole(["admin"]) ,UsersController.updateUser)

router.get("/",checkRole(["admin"]) ,UsersController.getUsers)

// router.get("/userVisualizer",checkRole(["admin"]), UsersController.getUsers)

router.delete("/deleteUser",checkRole(["admin"]), UsersController.deleteUser)

router.delete("/",checkRole(["admin"]), UsersController.deleteUnactiveUsers)

export default router
