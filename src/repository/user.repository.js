import {CreateUserDto, GetUserDto} from "../dao/dto/users.dto.js"

export class UserRepository{
    constructor(dao) {
        this.dao = dao
    }

    async getUser(userDB) {
        const user = new GetUserDto(userDB)
        return user

    }

    async createUser(newUser){
        const addUser = await this.dao.add(newUser)
        return addUser
    }

    async getUserFront(user) {
        const userDto = new CreateUserDto(user);
        const userCreated = await this.dao.add(userDto)
        const userDtoFront = new GetUserDto(userCreated)
        return userDtoFront
    }

    async getUserById(id){
        const user = await this.dao.getById(id)
        return user
    }


    async getByEmail(email) {
        const user = await this.dao.getByEmail(email)
        return user
    }

    async updateByEmail(email, userData) {
        const user = this.dao.updateByEmail(email, userData)
    }

    async updateUserById(uid, updatedUser) {
        const user = this.dao.updateById(uid, updatedUser)
        return user
    }
    
    async getUsers() {
        const users = this.dao.get()
        return users
    }

    async deleteUser(uid) {
        const user = this.dao.deleteById(uid)
        return user
        
    }
}

export default UserRepository