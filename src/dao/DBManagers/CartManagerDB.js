import cartsModel from "../models/carts.model.js"
import productModel from "../models/products.model.js";
// import productModel from "../models/products.model.js"


export default class CartManager {

  async add() {
    const newCart = await cartsModel.create({});
    return newCart;

  }


  async get() {
    const carts = await cartsModel.find().lean()
    return carts
  }

  
  async getById(cid) {
    const cart = await cartsModel.findById(cid).populate("products").lean();
    return cart;
  }

  async mongoGetById(cid) {
    const cart = await cartsModel.findById(cid).populate("products");
    return cart;
  }
  

  async addProductToCartById(cid, pid, quantity = 1) {

    try {
      
      const cart = await cartsModel.findById(cid)
      
      if (!cart) {
        return {
          status: "error",
          msg: `El carrito con el ${cid} no existe`,
        };
      }

      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === pid
      );
      

      if (existingProductIndex !== -1) {
        // Si el producto ya existe, incrementa la cantidad
        cart.products[existingProductIndex].quantity += +quantity;
      } else {
        // Si el producto no existe, agregar al carrito
        cart.products.push({
          product: pid,
          quantity: quantity,
        });
      }

      await cart.save();
      return {
        status: "success",
        msg: `El producto se ha agregado correctamente`,
        cart: cart.products,
      };


    } catch (error) {
      return {
        status: "error",
        msg: error.message,
      };
    }
  } 


async removeProductFromCartById(cid, pid) {
  try {
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return {
        status: "error",
        msg: `El carrito con el ${cid} no existe`,
      };
    }

    const indexToRemove = cart.products.findIndex(item => item.product.equals(pid));
    if (indexToRemove === -1) {
      return {
        status: "error",
        msg: `El producto con ID ${pid} no se encontró en el carrito`,
      };
    }

    cart.products.splice(indexToRemove, 1);
    await cart.save();

    return {
      status: "success",
      msg: `El producto se ha eliminado correctamente`,
      cart: cart.products,
    };
  } catch (error) {
    return {
      status: "error",
      msg: error.message,
    };
  }
}


  async updateProductQuantityInCart(cid, pid, quantity) {
  try {
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return {
        status: "error",
        msg: `El carrito con el ${cid} no existe`,
      };
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (existingProductIndex !== -1) {
      // Si el producto existe, actualiza la cantidad
      cart.products[existingProductIndex].quantity = +quantity;
      await cart.save();
      return {
        status: "success",
        msg: `La cantidad del producto se ha actualizado correctamente`,
        cart: cart.products,
      };
    } else {
      return {
        status: "error",
        msg: `El producto con el ${pid} no existe en el carrito`,
      };
    }
  } catch (error) {
    return {
      status: "error",
      msg: error.message,
    };
  }
}

async updateCart(cid, updatedProducts) {
  try {
      const cart = await cartsModel.findOne({ _id: cid }).lean();
  
      if (!cart) {
          throw new Error(`Carrito con ID ${cid} no encontrado.`);
      }
  
      cart.products = updatedProducts;
  
      await cart.save();
  
      return cart;
  } catch (error) {
      console.error(`Error al actualizar el carrito con ID ${cartId}: ${error.message}`);
      throw error;
  }
}

async deleteCart(cid) {
  try {
      const result = await cartsModel.deleteOne({ _id: cid });

      if (result.deleteCount > 0) {
          console.log(`Carrito con ID ${cid} eliminado exitosamente`);
          return true;
      } else {
          throw new Error(`Carrito con ID ${cid} no encontrado.`);
      }
  } catch (error) {
      console.error(`Error al eliminar el carrito con ID ${cid}: ${error.message}`);
      throw error;
  }
}


async deleteAllFromCart(cid) {
  try {
      const cart = await cartsModel.findOne({ _id: cid });

      if (!cart) {
          throw new Error(`Carrito con ID ${cid} no encontrado.`);
      }

      cart.products = [];

      await cart.save();

      console.log(`Todos los productos del carrito con ID ${cid} han sido eliminados`);
      return cart;
  } catch (error) {
      console.error(`Error al eliminar todos los productos del carrito con ID ${cartId}: ${error.message}`);
      throw error;
  }
} 

   async purchase(){
    
   }

}

