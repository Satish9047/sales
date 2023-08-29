const Joi = require("joi");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const listAllProducts = async (req, res)=>{
    const productList = await prisma.Product.findMany({})
    res.status(200).json({success: "Found list of product", productList});
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
    console.log(req.params)
    
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

module.exports = {
    listAllProducts,
    addProduct,
    deleteProduct
}