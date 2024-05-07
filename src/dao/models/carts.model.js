import mongoose from "mongoose"
// import productModel from "./products.model.js";

const collection = "carts"

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const cartsModel = mongoose.model(collection, cartSchema);


export default cartsModel
