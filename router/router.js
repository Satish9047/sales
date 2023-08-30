const express = require("express");
const router = express.Router();
const { login, register, adminAuth} = require("../controller/auth.controller");
const {listAllProducts, addProduct, deleteProduct, updateProduct} = require("../controller/products.controller");

router.get("/", (req, res)=>{
    console.log(req.method, req.url, req.baseUrl);
    res.json({success: "hello am a root"});
})
router.post("/register", register);
router.post("/login", login);
router.post("/admin/auth", adminAuth);
router.get("/products", listAllProducts);
router.post("/addproduct", addProduct);
router.delete("/deleteproduct/:id", deleteProduct);
router.put("/updateproduct/:id", updateProduct);



router.post("/products/:id", (req, res)=>{
    console.log(req.body);
    res.json({success: "this show single product"});
})

router.get("/orders", (req, res)=>{
    console.log(req.body);
    res.json({success: "this show all the order products"});
})

module.exports = router;