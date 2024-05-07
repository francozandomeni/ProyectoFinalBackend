import { GetUserDto } from "../dao/dto/users.dto.js"
import ticketsModel from "../dao/models/tickets.model.js"
import { cartService, productService, userService } from "../repository/index.js"

class ViewsController {
  static register = (req, res) => {
    res.render('register')
  }

  static login = (req, res) => {
    res.render('login')
  }

  static privateAccessProducts = async (req, res) => {
    const mainUser = req.user
    try {

      const { limit, page, sort, category, price, stock } = req.query;
      

      const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1,
        sort: sort === "asc" ? { price: 1 } : sort === "dsc" ? { price: -1 } : null,
        category: category || null,
        stock: stock !== undefined ? stock === "true" : null,
        lean: true,
      };

      const products = await productService.getProducts(options);
      
      // const quantityOptions = [1, 2, 3, 4, 5];
      // console.log(quantityOptions)
      
      res.render("productos", {
        productos: products.msg.docs,
        hasPrevPage: products.msg.hasPrevPage,
        hasNextPage: products.msg.hasNextPage,
        prevPage: products.msg.prevPage,
        nextPage: products.msg.nextPage,
        mainUser: mainUser,
        // quantityOptions: quantityOptions

      });
      

    } catch (error) {
      console.error("error en la ruta /:", error)
      res.status(500).json({ message: error.message });
    }
  }

  static chat = async (req, res) => {
    res.render("chat")
  }

  static forgotPassword = async (req, res) => {
    res.render("forgotPassword")
  }

  static resetPassword = async (req, res) => {
    const token = req.query.token;
    res.render("resetPassword", { token })
  }

  static createProducts = async (req,res) => {
    res.render("createProducts")
  }

  // static uploadDocuments = async (req,res) => {
  //   const mainUser = req.user
  //   res.render("uploadDocuments", { mainUser: mainUser  })
  // }

  static getUsers = async (req,res) => {
      try {
        const users = await userService.getUsers();

        const mainUser = req.user

        res.render("userVisualizer", {mainUser: mainUser, users: users} ); // Pasar el array de usuarios
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener usuarios");
    }
  }

  static cart = async (req,res) => {
    try {
      
      const mainUser = req.user
      const cid = mainUser.cart
      const cart = await cartService.getCartById(cid)

      res.render("cart", { cart:cart, mainUser: mainUser})
    } catch (error) {
      res.status(500).send("Error al obtener carrito");
      
    }
  }

  static tickets = async (req,res) => {
    try {

      const purchaseUser = req.user.email
      // console.log(purchaseUser)
        const tickets = await ticketsModel.find({ purchaser: purchaseUser }).lean()
        // console.log(tickets)
        res.render("tickets", { tickets: tickets})
      
    } catch (error) {
      return res.status(500).json(`No se encuentra el ticket`)
    }
  }
  
}

export { ViewsController }
