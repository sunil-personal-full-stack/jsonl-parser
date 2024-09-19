const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../../sequelize.config.js').development;

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

fs.readdirSync(__dirname)
    .filter((file) => file !== 'index.js' && file.endsWith('.js'))
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// Setup associations
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
