const express = require("express");
const router = express.Router();
const { login, register} = require("../controller/auth.controller")

router.get("/", (req, res)=>{
    console.log(req.method, req.url, req.baseUrl);
    res.json({success: "hello am a root"});
})
router.post("/register", register);
router.post("/login", login);

router.post("/products", (req, res)=>{
    console.log(req.body);
    res.json({success: "this shows all the products"});
})

router.post("/products/:id", (req, res)=>{
    console.log(req.body);
    res.json({success: "this show single product"});
})

router.get("/orders", (req, res)=>{
    console.log(req.body);
    res.json({success: "this show all the order products"});
})

module.exports = router;