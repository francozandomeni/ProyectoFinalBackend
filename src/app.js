import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import __dirname from "./utils.js"
import { engine } from "express-handlebars"
import viewRoutes from "./routes/views.router.js"
import sessionRouter from "./routes/sessions.router.js"
import DbProductsRouter from "./routes/dbProducts.router.js"
import cartRoutes from "./routes/cart.router.js"
import usersRouter from "./routes/users.router.js"
import testingRouter from "./routes/testing.router.js"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import { options } from "./config/config.js"
import messageModel from "./dao/models/messages.model.js"
import { Server } from "socket.io"
import { connectDB } from "./config/dbConnection.js"
import mockingRouter from "./routes/mock.router.js"
import loggerRouter from "./routes/logger.route.js"
import { swaggerSpecs } from "./config/docConfig.js"
import swaggerUi from "swagger-ui-express"
import { checkRole } from "./middleware/auth.js"



const PORT = options.server.port || 8080

const MONGO = options.mongo.url

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))

app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl: 3600
    }),
    secret: "CoderSecret",
    resave: false,
    saveUninitialized: false
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())



app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", `${__dirname}/views`)
// app.use(methodOverride('_method'));
app.use("/", viewRoutes)
app.use("/api/sessions", sessionRouter)
app.use("/api/testing", testingRouter)
app.use("/api/carts", cartRoutes)
app.use("/api/users", usersRouter)
app.use("/api", mockingRouter)
app.use("/products", DbProductsRouter)
app.use("/logger", loggerRouter)

//endpoint docu
app.use("/api/docs",checkRole(["admin", "premium"]),swaggerUi.serve,swaggerUi.setup(swaggerSpecs))



const httpServer = app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})


let messages = [];

const io = new Server(httpServer);

io.on("connection", (socket) => {
    
    socket.on("chat-message", async (data) => {
        const message = { username: data.username, message: data.message };
        await messageModel.create(message);
        messages.push(data);
        io.emit("messages", messages);
    })

    socket.on("new-user", (username) => {
        socket.emit("messages", messages);
        socket.broadcast.emit("new-user", username);
    })
})


export {app}