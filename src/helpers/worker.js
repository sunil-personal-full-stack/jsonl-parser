const { parentPort, workerData } = require('worker_threads');
const db = require('../models/index');

const { products, variants } = workerData;

const chunkArray = (array, size) => {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
}

(async () => {
    try {
        await db.Product.bulkCreate(products, { ignoreDuplicates: true });

        const chunkedVariants = chunkArray(variants, 3000); // Assuming BATCH_RECORD_SIZE is 3000
        for (const chunk of chunkedVariants) {
            await db.Variant.bulkCreate(chunk, { ignoreDuplicates: true });
        }

        parentPort.postMessage('done');
    } catch (error) {
        console.error(`Error in worker: ${error}`);
    }
})();
