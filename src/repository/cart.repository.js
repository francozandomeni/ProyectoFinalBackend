export class CartRepository {
    constructor(dao){
        this.dao = dao
    }
        
    async createCart() {
        const newCart = await this.dao.add()
        return newCart
    }

    async getCarts() {
        
            const carts = await this.dao.get();
            return carts;
        
    } 

    async getCartById(cid) {
        const cart = await this.dao.getById(cid)
        return cart
    }
 
    async addProductById(cid, pid, quantity){
        const addToCart = await this.dao.addProductToCartById(cid, pid, quantity)
        return addToCart
    }
    async deleteProductById(cid, pid){
        const deleteFromCart = await this.dao.removeProductFromCartById(cid, pid)
        return deleteFromCart
    }

    async updateProductQuantity(cid, pid, quantity){
        const deleteFromCart = await this.dao.updateProductQuantityInCart(cid, pid, quantity)
        return deleteFromCart
    }

    async updateCart(cid, updatedProducts) {
        const deleteCart = await this.dao.updateCart(cid, updatedProducts)
        return deleteCart
    }

    async deleteCart(cid) {
        const deleteCart = await this.dao.deleteCart(cid)
        return deleteCart
    }


    async deleteAllFromCart(cid) {
        const deleteAll = await this.dao.deleteAllFromCart(cid)
        return deleteAll
    }

    async mongoGetCartById(cid) {
        const cart = await this.dao.mongoGetById(cid)
        return cart;
      }


}
