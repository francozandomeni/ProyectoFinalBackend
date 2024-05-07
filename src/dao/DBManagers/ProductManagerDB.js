import productModel from "../models/products.model.js";

export default class ProductManager {


    async save(){
        const save = await productModel.save()
    }

    async add(product) {
        const result = await productModel.create(product)
        return result
    }

//utilizar URLs como http://localhost:8080//products?sort=asc&category=Zapatillas&stock=true
    
    async get(options = { page: 1, limit: 10, sort: null}) {
        try {
            const filters = {};
            if (options.category) {
                filters.category = options.category;
            }
            if (options.stock !== null) {
                filters.stock = options.stock;
            }

            const products = await productModel.paginate(filters, options);


            const { totalDocs, limit, page, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = products;


            return {
                
                status: "success",
                msg: {
                    docs: products.docs,  // List of products
                    totalDocs,
                    limit,
                    page,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                    nextPage,
                    prevPage,
                },
            }; 
        } catch (error) {
            return {
                status: "error",
                msg: error.message,
            };
        }
    }



    async getById(pid) {
        const product = await productModel.findById(pid).lean()
        return {
            status: "success",
            product
        }
    }

    async mongoGetById(pid) {
        const product = await productModel.findById(pid)
        return {
            status: "success",
            product
        }
    }
 

    async update(pid, updatedProduct) {
        const result = await productModel.findByIdAndUpdate(pid, updatedProduct, { new: true }).lean();
        return {
            status: "success",
            msg: result,
        };
    }

    async delete(pid) {
        const result = await productModel.findByIdAndDelete(pid).lean();
        return {
            status: "success",
            msg: result,
        };
    }

    async insertManyProducts(products) {
        try {
            const result = await productModel.insertMany(products);
            return result;
        } catch (error) {
            throw error;
        }
    } 
}