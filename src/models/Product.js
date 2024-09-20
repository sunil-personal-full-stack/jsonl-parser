const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Product extends Model {
        static associate(models) {
            Product.hasMany(models.Variant, { foreignKey: 'productId', as: 'variants' });
        }
    }

    Product.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        vendor: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        handle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        options: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Product',
    });

    return Product;
};
