const Joi = require("joi");
const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();

const orderProduct = async (req, res)=>{
    console.log(req.params.productId);
    console.log(req.body.stockQuanity);
    
    const OrderSchema = Joi.object({
        id: Joi.number().integer().required()
    })
    
    const OrderQuantity = Joi.object({
        stockQuanity: Joi.number().integer().required()
    })
    try{
        const value = await OrderSchema.validateAsync({id: req.params.productId});
        const stock = await OrderQuantity.validateAsync(req.body);
        
        const findProduct = await prisma.Product.findFirst({where: {id: value.id}});
        if(!findProduct){
            return res.status(400).json({error: "Product not found!"});
        }
        if(findProduct.stockQuanity<stock.stockQuanity|| findProduct.stockQuanity===0){
            return res.status(400).json({error: "Product is Out of stock"});
        }
        const addOrder = await prisma.Order.create({
            data: {
                productName: findProduct.productName,
                price: findProduct.price,
                quantity: stock.stockQuanity
            }
        })
        return res.status(200).json({success: "Order placed successfully!"})
    }catch(error){
        console.log("something went wrong: ", error);
        return res.status(500).json({error: "internal server error"});
    } finally{
        await prisma.$disconnect();
    }
}

module.exports = {
    orderProduct
}