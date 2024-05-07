export const generateProductErrorAuth = (rol) =>{
    return `
   You're not allowed to create products due to your role permissions: ${rol}
    `
}