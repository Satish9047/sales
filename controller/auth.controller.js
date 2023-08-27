const register = (req, res)=>{
    console.log(req.body);
    res.status(200).json({sucess: "register success"})
    
}
const login = (req, res)=>{
    console.log(req.body);
}

module.exports = {
    login,
    register
}