export const generateUserErrorInfo = (user) =>{
    return `
    Algunos campos obligatorios para crear al usuario vinieron vacios:
    first_name: llego ${user.first_name},
    last_name: llego ${user.last_name},
    email: tiene que ser del tipo string, pero llego: ${user.email}
    `
}