const Joi = require("joi");
const {PrismaClient} = require("@prisma/client");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_JWT;
const prisma = new PrismaClient();

const orderProduct = async (req, res) => {
    let userEmail;
    let userID;
    let User;
    console.log(req.headers);
    const token = req.headers.authorization;
    const jwtToken = token.split(" ")[1];
    console.log(jwtToken);

    try {
        let decoded = jwt.verify(jwtToken, secret);
        console.log(decoded);
        let userEmail = decoded.email;
        console.log(userEmail);

        const userId = await prisma.User.findFirst({where: {email: userEmail}});
        if(userId.id){
            console.log(userId.id)
            userID = userId.id
            User = userId.username
        }
    } catch (error) {
        console.log("bad authentication:", error);
        res.status(400).json({error: "invalid user"});
    }


    console.log(req.params.productId);
    console.log(req.body.stockQuanity);

    const OrderSchema = Joi.object({
        id: Joi.number().integer().required()
    })

    const OrderQuantity = Joi.object({
        stockQuanity: Joi.number().integer().required()
    })
    try {
        const value = await OrderSchema.validateAsync({id: req.params.productId});
        const stock = await OrderQuantity.validateAsync(req.body);

        
        const findProduct = await prisma.Product.findFirst({where: {id: value.id}});
        if (!findProduct) {
            return res.status(400).json({error: "Product not found!"});
        }
        if (findProduct.stockQuanity < stock.stockQuanity || findProduct.stockQuanity === 0) {
            return res.status(400).json({error: "Product is Out of stock"});
        }

        const addOrder = await prisma.Order.create({
            data: {
                orderItem: findProduct.productName,
                price: findProduct.price,
                quantity: stock.stockQuanity,
                customerId: userID,
                User: {
                    connect: { id: userID } // Connect the order to the user by their ID
                },

                orderItem: {
                    connect: { id: findProduct.id } // Specify the id of the product
                }
            }
        })
        return res.status(200).json({success: "Order placed successfully!"})
    } catch (error) {
        console.log("something went wrong: ", error);
        return res.status(500).json({error: "internal server error"});
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = {
    orderProduct
}