import cartsModel from '../src/dao/models/carts.model.js';
import userModel from '../src/dao/models/Users.models.js';
import productModel from '../src/dao/models/products.model.js';
import supertest from 'supertest';
import {app} from "../src/app.js"
import {expect} from "chai"
import { generateToken } from "../src/utils.js";

const requester = supertest(app);

describe("testing para el servicio de productos", ()=> {

    describe("Test para el modulo de productos", () => {

        beforeEach(async function (){
            await productModel.deleteMany({});
            });

            it("El endpoint POST /products/testing debe crear un producto correctamente", async function() {
                const productMock = {
                    title: "Media pum",
                    description: "de vidrio",
                    price: 2000,
                    thumbnail: "pum.jpg",
                    code: 1351,
                    stock: 155,
                    category: "Medias",
                    owner: "franco@coder.com"
                
                }
                const result = await requester.post("/products/testing").send(productMock)
                expect(result.statusCode).to.be.equal(200);
                expect(result.body.status).to.be.equal("success");
    
    
            })

            it("El endpoint GET /products devuelve array de productos", async () => {
                const productMock = {
                    title: "Media pum",
                    description: "de vidrio",
                    price: 2000,
                    thumbnail: "pum.jpg",
                    code: 1351,
                    stock: 155,
                    category: "Medias",
                    owner: "franco@coder.com"
                
                }

                const result = await requester.post("/products/testing").send(productMock)

                const response = await requester.get("/products");
        
               
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal("success");
                // console.log("----------------RESULT BODY PRODUCTOS--------------------",response.body.productos)
                expect(response.body.productos).to.be.an("array"); 
                // console.log()
              });

              it("El endpoint delete /products/:pid elimina un producto mediante su ID", async function(){
                const productMock = {
                    title: "Media pum",
                    description: "de vidrio",
                    price: 2000,
                    thumbnail: "pum.jpg",
                    code: 1351,
                    stock: 155,
                    category: "Medias",
                    owner: "franco@coder.com"
                
                }
                
                const result = await requester.post("/products/testing").send(productMock)
                // console.log("--------------RESULT-------------------", result.body.result._id)
                const productId = result.body.result._id
    
                const deleteProduct = await requester.delete(`/products/${productId}`)

                const response = await requester.get("/products");

                // console.log("---------GET DELETE PRODUCTS---------", response.body.productos._id)

                expect(response.body.productos._id).to.be.equal(undefined);
            })
            

    })
})


describe("Test modulo de carrito", () => {

beforeEach(async function (){
    await cartsModel.deleteMany({});
    await productModel.deleteMany({})
    });
    
    it("El endpoint POST /api/carts debe crear un carrito correctamente", async function() {
        const result = await requester.post("/api/carts/")
        // console.log("---------------RESULT METHOD GET CART----------------",result.body)

        expect(result.statusCode).to.be.equal(200);
        expect(result.body).to.haveOwnProperty("_id");
    })

    it("El endpoint GET /api/carts/:cid debe obtener un carrito por su ID", async function() {
        const result = await requester.post("/api/carts/")
        // console.log("---------------RESULT METHOD GET CART BY ID----------------",result.body)

        const response = await requester.get(`/api/carts/${result.body._id}`)

        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.haveOwnProperty("_id");
        expect(response.body).to.be.an("object")
    })

    it("El endpoint POST /api/carts/:cid/product/:pid debe agregar un producto al carrito", async function() {

        const productMock = {
            title: "Media pumba",
            description: "de vidrio",
            price: 2000,
            thumbnail: "pumba.jpg",
            code: 1451,
            stock: 155,
            category: "Medias",
            owner: "franco@coder.com"
        
        }
        
        const createProduct = await requester.post("/products/testing").send(productMock)

        const productId = createProduct.body.result._id

        const createCart = await requester.post("/api/carts/")

        const cartId = createCart.body._id

        const addProductToCart = await requester.post(`/api/carts/${cartId}/product/${productId}`)  
        
        // console.log(`----------POST METHOD. ADDING PRODUCT TO CART-----------`,addProductToCart)

        expect(addProductToCart.statusCode).to.be.equal(200);
        expect(addProductToCart.body.status).to.equal("success");
        expect(addProductToCart.body.msg).to.equal("El producto se ha agregado correctamente");
        
    })
})

describe("Test modulo de users", () => {

    before(async function (){
        await userModel.deleteMany({});
        });
    

    it("el endpoint POST /api/sessions/register debe realizar un registro de usuario", async function(){
        const mockUser = {
            first_name:"juan",
            last_name:"perez",
            email:"peter@gmail.com",
            age: 35,
            password:"1234",
            role: "admin",
            cart: [],
        };
        
        const response = await requester.post("/api/sessions/register").send(mockUser);

        expect(response.statusCode).to.be.equal(200);
        expect(response._body.status).to.be.equal("success");
})

    it("El endpoint /api/sessions/login debe loguear al usuario ", async function () {
        const mockUser = {
            email: "peter@gmail.com",
            password: "1234",
          };
          const response = await requester.post("/api/sessions/login").send(mockUser);

          expect(response._body.status).to.be.equal("success");
          expect(response._body).to.have.property("token");
        
    })


    it("El endpoint GET /api/sessions/current debe obtener el usuario actual", async () => {
        const mockUser = {
            email: "peter@gmail.com",
            password: "1234",
          };
          const login = await requester.post("/api/sessions/login").send(mockUser);
    
        const response = await requester.get("/api/sessions/current").send({ user: mockUser })

        
        expect(response._body.status).to.be.equal("success");
        expect(response._body.payload.email).to.be.equal("peter@gmail.com");
      });
})
    