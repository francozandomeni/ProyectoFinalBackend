import { CartRepository } from "./cart.repository.js";
import CartManager from "../dao/DBManagers/CartManagerDB.js"
import ProductManager from "../dao/DBManagers/ProductManagerDB.js"
import {ProductRepository} from "./product.repository.js";
import UserManager from "../dao/DBManagers/UserManager.js";
import {UserRepository} from "./user.repository.js"
import { TicketRepository } from "./tickets.repository.js";

// Carts Service
const cartDao = new CartManager()
const cartService = new CartRepository(cartDao)

// Product Service
const productsDao = new ProductManager()
const productService = new ProductRepository(productsDao)

// User Service
const usersDao = new UserManager()
const userService = new UserRepository(usersDao)
//Ticket Service
const ticketService = new TicketRepository()

export {cartService}
export {productService}
export {userService}
export {ticketService}