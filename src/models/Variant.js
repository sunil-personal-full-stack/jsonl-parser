const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Variant extends Model {
        static associate(models) {
            Variant.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
        }
    }

    Variant.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
        },
        variantTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        availableQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        availableForSale: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        variantPosition: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        handle: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Variant',
    });

    return Variant;
};
