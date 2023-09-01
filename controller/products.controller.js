const Joi = require("joi");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_JWT;

const listAllProducts = async (req, res)=>{

    console.log(req.headers);
    const token = req.headers.authorization;
    const jwtToken = token.split(" ")[1];
    console.log(jwtToken);

    try{
        let decoded = jwt.verify(jwtToken, secret);
        console.log(decoded);
        return decoded
    }catch(error){
        console.log("bad authentication:", error)
    }


    const productList = await prisma.Product.findMany({})
    return res.status(200).json({success: "Found list of product", productList});
}

const addProduct = async (req, res)=>{
    console.log(req.body);
    const productSchema = Joi.object({
        productName: Joi.string().required(),
        price: Joi.number().integer().required(),
        stockQuanity: Joi.number().integer().required(),
    })
    
    try{
        const value = await productSchema.validateAsync(req.body);
        const addProductItem = await prisma.Product.create({
            data: {
                productName: value.productName,
                price: value.price,
                stockQuanity: value.stockQuanity
            }
        })
        return res.status(200).json({success: "product added successfull"})
    }catch(error){
        console.log("something went wrong", error)
        return res.status(500).json({error: "internal server error"})
    } finally{
        await prisma.$disconnect();
    }
}

const deleteProduct = async (req, res)=>{
    console.log(req.params);
    console.log(req.body);
    
    const schema = Joi.object({
        id: Joi.number().integer().required()
    })
    try{
        const value = await schema.validateAsync({id: req.params.id});
        const deleteProductItem = await prisma.Product.delete({where: {id: value.id}});
        return res.status(200).json({success: "item deleted successfull"});
    }catch(error){
        console.log("something went wrong!: ", error);
        return res.status(500).json({error: "internal server error"})
    } finally{
        await prisma.$disconnect();
    }
}

const updateProduct = async (req, res)=>{
    console.log(req.params);
    const updateSchema = Joi.object({
        id: Joi.number().integer().required(),
    })
    const updateSchemaDetail = Joi.object({
        productName: Joi.string().required(),
        price: Joi.number().integer().required(),
        stockQuanity: Joi.number().integer().required(),
    })

    try{
        const productId = await updateSchema.validateAsync({id: req.params.id});
        const value = await updateSchemaDetail.validateAsync(req.body);

        const updateProductItem = await prisma.Product.update({where: {id: productId.id}, data: {
            productName: value.productName,
            price: value.price,
            stockQuanity: value.stockQuanity
        }});
        return res.status(200).json({success: "item update successfully"});
    }catch(error){
        console.error("something went wrong while updating! :", error);
        return res.status(500).json({error: "internal server error!"});
    }finally{
        await prisma.$disconnect();
    }
}

module.exports = {
    listAllProducts,
    addProduct,
    deleteProduct,
    updateProduct
}