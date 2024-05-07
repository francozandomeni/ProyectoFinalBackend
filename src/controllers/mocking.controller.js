import {generateProduct } from "../config/faker.js"

const mockingProducts = (req, res) => {

    const productsQuantity = 100
    let products = []

    
        for (let i = 0; i < productsQuantity; i++) {
            const product = generateProduct()
            products.push(product)
        }
        res.json({ status: "success", payload: products })

    


}

export {mockingProducts}