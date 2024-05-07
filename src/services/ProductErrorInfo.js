export const generateProductErrorInfo = (product) =>{
    return ` Some product fields required to create the product are empty: All properties required: --TITLE: type: String. INFO RECIEVED: ${product.title}
    --DESCRIPTION: type: String. INFO RECIEVED: ${product.description}
    --PRICE: type: Number. INFO RECIEVED: ${product.price}
    --THUMBNAIL: type: String, unique: true. INFO RECIEVED: ${product.thumbnail}
    --CODE: type: Number. INFO RECIEVED: ${product.code}
    --STOCK: type: Number. INFO RECIEVED: ${product.stock}
    --CATEGORY: type: String. INFO RECIEVED: ${product.category}`
    
}

export const generateProductActualizationError = (missingFieldsInfo) => {

    return `Some product fields required to update the product are missing or incorrect: \n${missingFieldsInfo}`;
}