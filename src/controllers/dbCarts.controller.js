import { userService, cartService, productService } from "../repository/index.js";
import { TicketRepository } from "../repository/tickets.repository.js";
import { v4 as uuidv4 } from 'uuid';
import userModel from "../dao/models/Users.models.js";
import { GetUserDto } from "../dao/dto/users.dto.js";
import { sendEmailPurchaseMade } from "../config/gmail.js";
import ticketsModel from "../dao/models/tickets.model.js";

function generateCode() {
  return uuidv4();
}

class CartsController {

  static getCarts = async (req, res) => {
    try {
      const cart = await cartService.getCarts()
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static addCart = async (req, res) => {
    try {
      const newCart = await cartService.createCart();
      res.status(200).json(newCart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static getCartById = async (req, res) => {
    const cid = req.params.cid
    try {
      const cart = await cartService.getCartById(cid);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static addProductById = async (req, res) => {
    try {
      // product
      const { pid } = req.params;
      const product = await productService.getProductById(pid)
      const owner = product.product.owner
      const quantity = req.body.quantity
      // user
      const cid = req.user.cart
      const user = req.user


      if (user.role === "admin") {
        return res.status(400).send(`El administrador no puede comprar un producto `)

      }


      if (owner === user.email) {
        return res.status(400).send(`No puedes comprar un producto que tu has publicado.`)
      }

      const result = await cartService.addProductById(cid, pid, quantity);
      res.status(200).send(`Tu producto se ha añadido al carrito correctamente. <br><a href="/cart">Click aqui para ir al carrito <i class="bi bi-cart4"></i></a> <br> <a href="/">Click aqui para seguir comprando<i class="bi bi-bag"></i></a>`);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static deleteProductById = async (req, res) => {
    try {
      const pid = req.params.pid
      const cid = req.user.cart

      console.log(pid)
      console.log(cid)

      const result = await cartService.deleteProductById(cid, pid);
      res.status(200).send(`<h2>Tu producto se ha quitado del carrito.</h2> <h3 class="send"><a href="/cart">Click aqui para ir al carrito <i class="bi bi-cart4"></i></a> <br> <a href="/">Click aqui para seguir comprando<i class="bi bi-bag"></i></a></h3>`);
    } catch (error) {
      res.status(500).json(`No se pudo agregar el producto al carrito ${cid}${pid}`);
    }
  }

  static deleteCart = async (req, res) => {
    const { cid } = req.params;

    try {
      const result = await cartService.deleteCart(cid);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static updateProductQuantity = async (req, res) => {
    try {
      const cid = req.user.cart
      const { pid } = req.params;
      const  quantity  = req.body.quantity;
      const result = await cartService.updateProductQuantity(cid, pid, quantity);
      res.status(200).send(`<h2>La cantidad del producto en tu carrito se ha actualizado correctamente</h2> <h3 class="send"><a href="/cart">Click aqui para volver al carrito<i class="bi bi-cart4"></i></a> <br> <a href="/">Click aqui para seguir comprando<i class="bi bi-bag"></i></a></h3>`);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static updateCart = async (req, res) => {

    const { cid } = req.params;
    const updatedProducts = req.body;
    try {
      const updatedCart = await cartService.updateCart(cid, updatedProducts);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static deleteAllProductsFromCart = async (req, res) => {
    const { cid } = req.params;

    try {
      const result = await cartService.deleteAllFromCart(cid);
      res.status(200).send(`<h2>Tus productos se eliminaron del carrito correctamente.</h2> <h3><br><a href="/cart">Click aqui para ir al carrito <i class="bi bi-cart4"></i></a> <br> <a href="/">Click aqui para volver a seleccionar productos <i class="bi bi-bag"></i></a></h3>`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  static purchase = async (req, res) => {
    try {
      const user = req.user
      const cid = req.params.cid;
      console.log("Starting purchase process...");
      console.log("Cart ID is:", cid);
      console.log("Cart purchaser:", user)
      if (!user || !cid) {
        console.log("We can't proceeed without information from the user or cart")
      }


      const cart = await cartService.mongoGetCartById(cid);
      console.log("Cart found:", cart);

      if (!cart) {
        console.log("Cart doesn't exist");
        return res.status(404).json({ error: "El carrito no existe" });
      }

      // Checking stock for every product in cart
      for (const cartProduct of cart.products) {
        const product = await productService.mongoGetProductById(cartProduct.product);
        console.log("'for' from Product:", product); // Check the product
        const quantityInCart = cartProduct.quantity

        console.log("stock in cart/quantity in cart", quantityInCart)



        console.log(`checking stock for product: ${cartProduct._id}...`);

        if (product.stock < quantityInCart) {
          console.log(`Not enough stock for product: ${cartProduct._id}`);
          // Adjust to no exceed quantity available
          cartProduct.quantity = product.stock;
          // Updating cart in DB
          await cart.save();
          return res.status(400).json({ error: `Not enough stock for product ${cartProduct._id}. Max quantity available is ${cartProduct.stock}` });
        }
      }

      // Update stock and creating ticket
      const ticketProducts = [];
      let totalAmount = 0;

      for (const cartProduct of cart.products) {
        const productDetails = await productService.mongoGetProductById(cartProduct.product);
        const product = productDetails.product
        console.log("segundo FOR", product)

        if (!product) {
          console.log(`Product ${cartProduct.product} not found`);
          return res.status(404).json({ error: `Product ${cartProduct.product} not found` });
        }

        const quantityInCart = cartProduct.quantity;

        console.log(`updating stock for product ${cartProduct._id}...`);

        // updating product stock
        product.stock -= quantityInCart;
        await product.save()

        // ticket product info
        ticketProducts.push({
          product: product._id,
          quantity: quantityInCart
        });

        // Calculating total amount
        totalAmount += parseFloat(product.price * quantityInCart);
        console.log(`------TOTAL AMOUNT------`, totalAmount)

      }
      //testing b4 ticket
      if (totalAmount === 0 || !totalAmount) {
        console.log(
          "TEST. You don't have a total amount in cart. Purchase and ticket will not be generated")
      }

      //creating ticket
      console.log("Creating buying ticket.");
      const ticketRepository = new TicketRepository()

      console.log(`------TOTAL AMOUNT2------`, totalAmount)

      const newTicket = {
        code: generateCode(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: user.email,
        products: cart.products
      };



      const ticket = await ticketRepository.createTicket(newTicket)
      console.log("Ticket created:", ticket);

      await sendEmailPurchaseMade(user.email, ticket)
      // Cleaning cart after purchase
      cart.products = [];
      await cart.save();

      console.log("Purchase made successfully");

      return res.status(200).send(`Compra realizada con exito. Te hemos enviado los datos de la transaccion a tu correo electronico. Si quieres ver tus tickets, ve a la sesion de <a href="/tickets">"tickets"<a/>. <a href="/">Toca aqui para volver al inicio</a>`);
    } catch (error) {
      console.error("Error processing purchase:", error);
      return res.status(500).json({ error: "Error processing purchase" });
    }
  }

  static ticketSearch = async (req, res) => {
    try {

      const purchaseUser = req.params.purchaseUser

      const tickets = await ticketsModel.find({ purchaser: purchaseUser })
      console.log(tickets)
      res.status(200).json(tickets)

    } catch (error) {
      return res.status(500).json({ error: "Error processing ticket" });

    }
  }

}
export { CartsController };