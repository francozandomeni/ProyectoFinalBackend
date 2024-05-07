
export class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    async save() {
        const save = await this.dao.save()
        return save
    }

    async getProducts(page, limit, sort) {
        const products = await this.dao.get(page, limit, sort)
        return products

    }

    async addProduct(product) {
        const newProduct = await this.dao.add(product)
        return newProduct
    }


    async getProductById(pid) {
        const product = await this.dao.getById(pid)
        return product
    }

    async updateProduct(pid, updatedProduct) {
        const updateProduct = await this.dao.update(pid, updatedProduct)
        return updateProduct
    }
    async deleteProduct(pid) {
        const deleteProduct = await this.dao.delete(pid)
        return deleteProduct
    }

    async mongoGetProductById(pid) {
        const product = await this.dao.mongoGetById(pid)
        return product
    }

}



export default ProductRepository

// Incorrect DAO Usage: In the 'ProductRepository' class, when calling the 'this.dao.get()' method, you are passing the options object incorrectly. Instead of passing it as an object, you should pass it as individual parameters like so: 'this.dao.get(page, limit, sort)'. Additionally, ensure that the 'get' method in your 'ProductManager' class can receive these individual parameters.