const readFileLineByLine = require('./readFileLineByLine');
const { Product, Variant } = require('../models');
const generateHandle = require('./generateHandle'); // We'll create this function

const migrateProducts = (filePath) => {
    return new Promise((resolve, reject) => {
        readFileLineByLine(
            filePath,
            async (line) => {
                try {
                    const data = JSON.parse(line);

                    // Create product handle
                    const handle = generateHandle(data.title);

                    // Create Product
                    const product = await Product.create({
                        title: data.title,
                        handle: handle,
                        // Include other necessary fields
                    });

                    // Create Variants
                    if (data.variants && data.variants.length > 0) {
                        const variants = data.variants.map((variant) => ({
                            ...variant,
                            productId: product.id,
                        }));

                        await Variant.bulkCreate(variants);
                    }
                } catch (error) {
                    console.error('Error processing line:', error);
                }
            },
            () => {
                console.log('Migration completed.');
                resolve();
            }
        );
    });
};

module.exports = migrateProducts;
