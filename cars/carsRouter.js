const express = require("express");
const knex = require("knex");

const db = knex(require("../knexfile").development)

const router = express.Router();

//Create a car record
router.post('/', (req,res)=>{
    db('cars').insert(req.body, "id")
    .then(newCarId=>{
        res.status(201).json({
            message:`Successfully added a new car.`,
            newCar: {...req.body, id: newCarId[0]}
        })
    })
    .catch(err=>{
        res.status(500).json({message:`Could not add a new car record to the server.`})
    })
})

//Read all cars
router.get("/", (req,res)=>{
    db('cars')
    .then(cars=>{
        res.status(200).json(cars)
    })
    .catch(err=>{
        res.status(500).json({message:"Could not get cars from the server."})
    })
})

module.exports = router;