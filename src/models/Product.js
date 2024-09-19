module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        title: DataTypes.STRING,
        handle: DataTypes.STRING,
    });

    Product.associate = (models) => {
        Product.hasMany(models.Variant, { foreignKey: 'productId', as: 'variants' });
    };

    return Product;
};
