import { Router } from "express"
import { ProductsController } from "../controllers/dbProducts.controller.js";
import { errorHandler } from "../middleware/errorHandler.js"
import { addLogger } from "../utils/logger.js";
import { checkRole } from "../middleware/auth.js"


const router = Router()

router.get('/products', addLogger,ProductsController.get)

router.get('/products/:pid', addLogger, ProductsController.getById);

router.post("/products", addLogger, ProductsController.add);

router.put('/products/:pid', addLogger, ProductsController.update);

router.delete('/products/:pid', ProductsController.delete);

router.use((err, req, res, next) => {
    errorHandler(err, req, res, next);
});

// router.use(addLogger)

export default router