import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
        required: true
    },
    fullName: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: Number,
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin", "premium"],
        default: "user"
    },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" },
    documents: [
        {
          name: {
            type: String,
          },
          reference: {
            type: String,
          },
        },
    ],
    last_connection: {
        type: Date,
    }
})

const userModel = mongoose.model(collection, schema);

export default userModel;