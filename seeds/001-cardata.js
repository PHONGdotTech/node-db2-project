
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('cars').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('cars').insert([
        {VIN: '11111111111111111', make: "Honda", model: "Civic", mileage: 111111},
        {VIN: '22222222222222222', make: "Toyota", model: "Supra", mileage: 222222},
        {VIN: '33333333333333333', make: "Chevy", model: "Silverado", mileage: 333333},
        {VIN: '44444444444444444', make: "Acura", model: "Integra", mileage: 444444},
        {VIN: '55555555555555555', make: "Ford", model: "Mustang", mileage: 555555}
      ]);
    });
};
