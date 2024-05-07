import { productService, userService } from "../repository/index.js";
import { CustomError } from "../services/customError.service.js"
import { generateProductErrorInfo } from "../services/ProductErrorInfo.js"
import { EError } from "../enums/EError.js"
import { generateProductErrorParam } from "../services/ProductErrorParams.js"
import userModel from "../dao/models/Users.models.js";
import { sendEmailDeletedProduct, sendEmailUpdatedProduct } from "../config/gmail.js";


class ProductsController {

    static get = async (req, res) => {
        try {
            const { limit, page, sort, category, price, stock } = req.query;
            const options = {
                limit: parseInt(limit) || 10,
                page: parseInt(page) || 1,
                sort: { price: sort === "asc" ? 1 : -1 },
                category: category || null,
                stock: stock !== undefined ? stock === "true" : null,
                price: parseFloat(price),
                lean: true,

            };

            const products = await productService.getProducts(options);

            if (products.hasPrevPage) {
                products.prevLink = generatePaginationLink(req, products.prevPage);
            }

            if (products.hasNextPage) {
                products.nextLink = generatePaginationLink(req, products.nextPage);
            }

            res.send({
                status: "success",
                productos: products.msg.docs,
            });
            // console.log(products.msg.docs)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async generatePaginationLink(req, page) {
        const params = new URLSearchParams(req.query);
        params.set('page', page);
        return `${req.baseUrl}?${params.toString()}`;
    }


    static getById = async (req, res) => {
        try {
            const product = await productService.getProductById(req.params.pid);

            if (!product) {
                throw CustomError.createError({
                    name: "Product by ID error",
                    cause: generateProductErrorParam(req.params.pid),
                    message: "Error getting product by ID",
                    errorCode: EError.INVALID_PARAM
                })
            }


            res.status(200).json(product);
        } catch (error) {
            if (error.name === "CastError" && error.kind === "ObjectId") {
                req.logger.warn("Invalid ID format provided");
                res.status(400).json({ message: "Invalid ID format provided" });
            } else if (error.cause) {
                req.logger.warn("The ID info is wrong");
                res.status(400).json({ message: error.message, cause: error.cause });
            } else {
                req.logger.error("Internal error getting product by ID");
                res.status(500).json({ message: error.message });
            }
        }
    };

    static add = async (req, res) => {

        try {
            const filename = req.file.filename;
            if (!filename) {
                return res.send({
                    status: "error",
                    error: "No se pudo cargar la imagen"
                })
            }

            let { thumbnail } = req.body
            thumbnail = `/public/files/products/${filename}`

            const { title, description, price, code, stock, category } = req.body;

            if (!req.body) {
                return res.send(`<div>Error, la info no ha llegado correctamente. <a href="/create-product">Intente de nuevo</a></div>`)
            }

            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                throw CustomError.createError({
                    name: "Product create error",
                    cause: generateProductErrorInfo(req.body),
                    message: "Error creando el producto",
                    errorCode: EError.EMPTY_FIELDS
                })



            }
 
            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                owner: req.user && req.user.email ? req.user.email : "admin",

            }


            const result = await productService.addProduct(product);

            

            res.send({
                status: "success",
                msg: "Se ha creado el producto correctamente.",
                result
            })

        } catch (error) {
            if (error.cause) {
                req.logger.warn("error 400 creando el producto")
                res.status(400).json({ message: error.message, cause: error.cause });
            } else {
                req.logger.error("error creando el producto")

                res.send(`<div>Error, <a href="/create-product">Intente de nuevo</a></div>`)
            }
        }

    };

    static update = async (req, res) => {
        try {
            const pid = req.params.pid;
            const uid = req.params.uid;
            
            const user = await userService.getUserById(uid);
            const userEmail = user.email
            console.log(`---USER EMAIL---`,userEmail)
            
            const productData = await productService.getProductById(pid)
            const productOwner = productData.product.owner
            console.log(`---PRODUCT ---`,productData)
            console.log(`---PRODUCT EMAIL---`,productOwner)
            
            
            if (userEmail !== productOwner) {
                return res.status(403).send(`No estás autorizado a actualizar este producto.`);
            }
            
            const { title, description, price, thumbnail, code, stock, category } = req.body;


            const productUpdated = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category
            }

            console.log(`---PRODUCT UPDATED---`,productUpdated)


            const result = await productService.updateProduct(pid, productUpdated);

            console.log(`---RESULTADO---`,result)
            
            
            sendEmailUpdatedProduct(userEmail, productData.product)

            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            return res.status(500).json(`no se pudo actualizar el producto`) ;
        }

    }

    static delete = async (req, res) => {
        try {

            const pid = req.params.pid;
            const uid = req.params.uid

            const user = await userService.getUserById(uid);
            const userEmail = user.email

            const product = await productService.getProductById(pid)
            const productOwner = product.product.owner
            
            if (userEmail !== productOwner) {
               return  res.send(`No estas autorizado a eliminar este producto.`)
            }
            
            
            const result = await productService.deleteProduct(pid);
            
            await sendEmailDeletedProduct(userEmail, product.product)

           res.status(200).send(result);
        } catch (error) {
           return  res.status(500).send({ message: error.message });
        }

    }


}

export { ProductsController };
