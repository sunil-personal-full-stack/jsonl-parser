const { Worker } = require('worker_threads');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const logger = require('../helpers/winston');
const generateHandle = require('../helpers/generateHandle')

const BATCH_RECORD_SIZE = 3000;
const MAX_THREADS = 5;
let activeThreads = 0;

const createWorker = (products, variants, callback) => {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
        workerData: { products, variants }
    });

    worker.on('message', () => {
        activeThreads--;
        callback(); // Resume reading after thread completes
    });

    worker.on('error', (error) => {
        console.error(`Worker error: ${error}`);
        logger.error('Worker encountered an error', error);
        activeThreads--;
        callback();
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
            logger.error('Worker stopped unexpectedly', { exitCode: code });
        }
    });

    activeThreads++;
};

const migrateProducts = (filePath) => {
    logger.info('Process started')
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    });

    let products = [];
    let variants = [];

    const processLine = async (line) => {
        try {
            const data = JSON.parse(line);
            const currentVariants = [];

            if (data.variants && Array.isArray(data.variants)) {
                data.variants.forEach((element) => {
                    currentVariants.push({ ...element, ...{ handle: generateHandle(element.variantTitle) } });
                });
                variants = variants.concat(currentVariants);
            }

            delete data.variants;
            products.push({ ...data, ...{ handle: generateHandle(data.title) } });

            if (products.length >= BATCH_RECORD_SIZE) {
                rl.pause();

                if (activeThreads < MAX_THREADS) {
                    createWorker(products, variants, () => rl.resume());
                } else {
                    // Wait for an active thread to finish
                    const interval = setInterval(() => {
                        if (activeThreads < MAX_THREADS) {
                            clearInterval(interval);
                            createWorker(products, variants, () => rl.resume());
                        }
                    }, 100);
                }

                products = [];
                variants = [];
            }
        } catch (e) {
            console.log(e);
            logger.error('Something went wrong');
        }
    };

    rl.on('line', (line) => {
        processLine(line);
    });

    rl.on('close', () => {
        logger.info('Product migration complete');
    });
};

migrateProducts('products.jsonl');
