const Sequelize = require('sequelize');
let config = require('../../sequelize.config');
const Product = require('./Product')
const Variant = require('./Variant')

let db = {};

let sequelize = new Sequelize(config.db);

db = {
    Product: Product(sequelize),
    Variant: Variant(sequelize)
};

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

module.exports = db;
