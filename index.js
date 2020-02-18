const express = require("express");
const carsRouter = require("./cars/carsRouter.js")

const server = express();

server.use(express.json());
server.use("/api/cars", carsRouter);

const port = process.env.PORT || 5000;
server.listen(port, ()=>{
    console.log(`Server running on port ${port}.`)
})