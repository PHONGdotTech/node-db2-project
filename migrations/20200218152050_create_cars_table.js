
exports.up = function(knex) {
    return knex.schema.createTable('cars', tbl=>{
        tbl.increments();

        tbl.string('VIN', 17)
            .unique()
            .notNullable();


        tbl.string('Make', 64)
            .notNullable();

        tbl.string('Model', 64)
            .notNullable();

        tbl.integer('Mileage', 6)
            .notNullable();

        tbl.string('TransmissionType', 32);

        tbl.string('TitleStatus', 32);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('cars')
};
