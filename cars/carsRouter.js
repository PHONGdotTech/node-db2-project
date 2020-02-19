const express = require("express");
const knex = require("knex");

const db = knex(require("../knexfile").development)

const router = express.Router();

//Create a car record
router.post('/', validateBody, checkVinUniqueness, (req,res)=>{
    db('cars').insert(req.body, "id")
    .then(newCarId=>{
        res.status(201).json({
            message:`Successfully added a new car.`,
            newCar: {id: newCarId[0], ...req.body}
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

//Read a single car
router.get("/:id", validateId, (req,res)=>{
    res.status(200).json(req.car)
})

//Update a car
router.put("/:id", validateId, validateBody, checkVinUniqueness, (req,res)=>{
    db(`cars`).where({id: req.params.id}).update(req.body)
    .then(count=>{
        res.status(200).json({
            message:`Successfully updated ${count} car.`,
            updatedCar: {id: parseInt(req.params.id), ...req.body}
        })
    })
    .catch(err=>{
        res.status(500).json({errorMessage:"Could not update car to the server."})
    })
})

//Delete a car
router.delete("/:id", validateId, (req,res)=>{
    db(`cars`).where({id: req.params.id}).delete()
    .then(count=>{
        res.status(200).json({message:`Sucessfully deleted ${count} car with id ${req.params.id}.`})
    })
    .catch(err=>{
        res.status(500).json({errorMessage:"Could not delete car from server."})
    })
})

//////////////
//Middleware//
//////////////

//Validates Id
function validateId(req,res,next){
    db('cars').where({id: req.params.id})
    .first()
    .then(car=>{
        car ? (req.car = car, next()) : 
        res.status(404).json({message:`No car with ID:${req.params.id} exists.`})
    })
    .catch(err=>{
        res.status(500).json({errorMessage:"There was a problem validating the ID."})
    })
}

//validates request body for existence, and required keys
function validateBody(req, res, next){
    Object.keys(req.body).length === 0 && req.body.constructor === Object ?
    res.status(400).json({message:"Missing request body."}) :
        !req.body.vin || !req.body.make || !req.body.model || !req.body.mileage || req.body.mileage.constructor !== Number ?
        res.status(400).json({message:"vin, make, model, and mileage are required. mileage must be an integer."}) : 
        next()
            
}

//Checks for unique VIN
function checkVinUniqueness(req,res,next){
    db('cars').where({vin: req.body.vin})
            .first()
            .then(car=>{
                //is there a car with this vin? if not:next(), else:
                !car ? next() : 
                    //does an id parameter exist, and does it equal the car's id? if yes: next(), else VIN must be unique
                    req.params.id && parseInt(req.params.id) === car.id ?
                    next() :
                    res.status(400).json({message:"VIN is currently on record and belongs to another car. Check the VIN and try again."})

            })
            .catch(err=>{
                res.status(500).json({errorMessage:"Couldn't check VIN uniqueness."})
            })
}


module.exports = router;