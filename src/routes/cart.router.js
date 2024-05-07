import {Router} from "express"
import { CartsController } from "../controllers/dbCarts.controller.js"
import { checkRole } from "../middleware/auth.js"

const router = Router();

import methodOverride from 'method-override';
router.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

router.get("/",checkRole(["admin"]) ,CartsController.getCarts);
router.get('/:cid', CartsController.getCartById);
router.get("/tickets/:purchaseUser", checkRole(["admin"]),CartsController.ticketSearch)

router.post('/', CartsController.addCart);
router.post('/product/:pid', CartsController.addProductById);
router.post("/:cid/purchase", CartsController.purchase)

router.delete('/product/:pid', CartsController.deleteProductById);
router.delete("/:cid", CartsController.deleteCart);
router.delete("/:cid/product", CartsController.deleteAllProductsFromCart)

router.put("/:cid", CartsController.updateCart);
router.put('/product/:pid', CartsController.updateProductQuantity);



export default router
