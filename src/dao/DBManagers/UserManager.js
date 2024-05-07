import userModel from "../models/Users.models.js"

export default class UserManager{
    async get() {
        const users = await userModel.find().lean()
        return users
    }

    async add(newUser) {
        const result = await userModel.create(newUser)
        return result
    }

    async getById(id){
        const result = await userModel.findById(id).lean()
        return result
     }

    async getByEmail(email) {
        const user = await userModel.findOne(email).lean()
        return user
    }

    async updateByEmail(email, userData) {
        const user = await userModel.findOneAndUpdate(email, userData).lean()
        return user
    }

    async updateById(uid, updatedUser) {
        const result = await userModel.findByIdAndUpdate(uid, updatedUser, { new: true }).lean();
        return {
            status: "success",
        };
    }
    async deleteById(uid){
        const result = await userModel.findByIdAndDelete(uid).lean();
        return {
            status: "success",
            result
        };
    }
    
}