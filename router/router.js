const express = require("express");
const router = express.Router();
const { login, register, adminAuth} = require("../controller/auth.controller");
const {listAllProducts, addProduct, deleteProduct, updateProduct} = require("../controller/products.controller");
const {orderProduct} = require("../controller/order.controller");

router.get("/", (req, res)=>{
    console.log(req.method, req.url, req.baseUrl);
    res.json({success: "hello am a root"});
})
router.post("/register", register);
router.post("/login", login);
router.post("/admin/auth", adminAuth);
router.get("/products", listAllProducts);
router.post("/admin/addproduct", addProduct);
router.delete("/admin/deleteproduct/:id", deleteProduct);
router.put("/admin/updateproduct/:id", updateProduct);
router.post("/createOrder/:productId", orderProduct);




module.exports = router;