const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const router = require("./router/router");
require("dotenv").config();

const app = express();
const PORT = `${process.env.PORT}`||3000;
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(helmet());
app.use(morgan("short"))

app.use("/", router);

server.listen(PORT, ()=>{
    console.log(`server is running in port: ${PORT}`)
})