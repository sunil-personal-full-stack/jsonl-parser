module.exports = (sequelize, DataTypes) => {
    const Variant = sequelize.define('Variant', {
        productId: DataTypes.INTEGER,
    });

    Variant.associate = (models) => {
        Variant.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    };

    return Variant;
};
