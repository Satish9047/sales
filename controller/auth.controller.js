const { PrismaClient } = require("@prisma/client");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRound = 10
const secret = `${process.env.SECRET_JWT}`;

const prisma = new PrismaClient();


const register = async (req, res)=>{
    console.log(req.body);

    const registerSchema = Joi.object({
        username: Joi.string().min(3).max(10).required(),
        email: Joi.string().email(),
        contact: Joi.string().min(10).max(10),
        password: Joi.string().min(8),
    });
    try{
        const value = await registerSchema.validateAsync(req.body);

        const existUser = await prisma.User.findFirst({where: {email: value.email}});
        if(existUser){
            return res.status(400).json({error: "user already exist!"});
        }

        const hash = await bcrypt.hash(value.password, saltRound);


        const addUser = await prisma.User.create({
            data: {email: value.email,
            username: value.username,
            contact: value.contact,
            password: hash,
            }
        })

        res.status(200).json({sucess: "register success"})
    } catch(error){
        console.log("something isn't right!", error);
        res.status(400).json({ error: "invalid input!" });
    }finally{
        await prisma.$disconnect();
    }
}


const login = async (req, res)=>{
    console.log(req.body);
    const loginSchema = Joi.object({
        email: Joi.string().email(),
        password: Joi.string().min(8)
    });
    try{
        const value = await loginSchema.validateAsync(req.body);
        const userExist = await prisma.User.findFirst({where: {email: value.email}});
        if(!userExist){
            return res.status(400).json({error: "User didn't exist!"});
        }
        const passwordMatch = await bcrypt.compare(value.password, userExist.password)
        if(!passwordMatch){
            return res.status(400).json({error: "password doesn't match"});
        }

        const jwtToken = await jwt.sign({email: value.email}, secret);
        return res.status(200).json({success: "login successfull", jwtToken: `${jwtToken}`});
    }catch(error){
        console.log("something went wrong: ",error);
        return res.status(500).json({error: "something went wrong"});
    }finally{
        await prisma.$disconnect();
    }
}


const adminAuth = async (req, res)=>{
    console.log(req.body);

    const adminAuthSchema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).regex(/^[a-zA-Z0-9._%+-]+@sales\.com$/),
        password: Joi.string().min(8)
    })

    try{
        const value = await adminAuthSchema.validateAsyc(req.body);

        const adminExist = await prisma.User.findFirst({where: {email: value.email}});
        if(!adminExist){
            return res.status(400).json({error: "invalid admin!"});
        }
        const passwordMatch = await bcrypt.compare(value.password, adminExist.password);
        if(!passwordMatch){
            res.status(400).json({error: "invalid admin!"});
        }
        const jwtToken = jwt.sign({email: value.email}, secret)
        return res.status(200).json({success: "login successfull", jwtToken: `${jwtToken}`})
    } catch(error){
        return res.status(500).json({error: "something went wrong!"})
    } finally{
        await prisma.$disconnect();
    }
}


module.exports = {
    login,
    register,
    adminAuth
}