# Products JSONL parser and CRUD

## Project Overview

This project is designed to handle a large JSON Lines (JSONL) file containing more than 2 million products and their variants. The primary focus is to:
- Efficiently process large JSONL files without memory issues.
- Utilize Sequelize ORM for MySQL to store products and variants.
- Provide a RESTful API with Express for CRUD operations on products and variants.
- Generate Shopify-compliant product and variant handles.
- Bundle server-side code using Webpack.
- Implement JWT-based authentication for testing purposes.
- Employ ESLint for code linting.

## Table of Contents
- [Prerequisites](#Prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Routes](#routes)
- [Migration](#Migration)

## Prerequisites

Ensure you have the following installed:
- Node.js (v14+)
- MySQL
- Sequelize CLI
- Webpack


## Installation
1. Clone the repository: `git clone https://github.com/sunil-personal-full-stack/jsonl-parser.git`
2. Install dependencies: `npm install`


## Usage
This project includes several scripts to facilitate development, building, and maintenance. You can run the scripts using npm or yarn. Below are the available scripts and their usage:

Here's a usage section you can include in your `ReadMe.md` file based on the provided `package.json` scripts:

---

## Usage

This project includes several scripts to facilitate development, building, and maintenance. You can run the scripts using npm or yarn. Below are the available scripts and their usage:

### Scripts

- **Build**: Compiles the project using Webpack.
  ```bash
  npm run build
  ```

- **Start**: Starts the application by executing the bundled JavaScript file.
  ```bash
  npm start
  ```

- **Development**: Runs the application in development mode with live reloading using Nodemon.
  ```bash
  npm run dev
  ```

- **Lint**: Checks the code for linting errors using ESLint.
  ```bash
  npm run lint
  ```

- **Migrate**: Executes the migration script for migrating products.
  ```bash
  npm run migrate
  ```

--- 
## Routes

### Product Routes

- **GET /api/products**
  - Retrieves a list of all products.

- **GET /api/products/:id**
  - Retrieves details of a specific product by its ID.

- **POST /api/products**
  - Creates a new product. Requires validation through `productValidator`.

- **PUT /api/products/:id**
  - Updates an existing product by its ID. Requires validation through `productValidator`.

- **DELETE /api/products/:id**
  - Deletes a specific product by its ID.

### Variant Routes

- **GET /api/products/:productId/variants**
  - Retrieves all variants associated with a specific product identified by `productId`.

- **POST /api/products/:productId/variants**
  - Creates a new variant for a specified product. Requires validation through `variantValidator`.

- **PUT /api/variants/:id**
  - Updates an existing variant by its ID. Requires validation through `variantValidator`.

- **DELETE /api/variants/:id**
  - Deletes a specific variant by its ID.

### Token Generation Route

- **POST /api/token**
  - Generates a new authentication token.

### Middleware Logging
Each request will log its parameters, URL, and body for debugging purposes using Winston.

---

## Migration

### Usage

1. Prepare your `products.jsonl` file. Each line should be a valid JSON object representing a product, including variants as an array. `products.jsonl` file must be placed at root folder

2. Run the migration script:
   ```bash
   npm run migrate
   ```

The script will start reading the file and processing the records, using up to 5 threads for database operations. We can adjust this number for threads and batch size in script at top of script. Script is added to helpers folder

### Worker Implementation

The worker script (`worker.js`) handles the actual database insertion. Here's how it works:

1. **Data Handling**: Each worker receives a batch of products and variants from the main script.
2. **Database Operations**:
   - Inserts products into the database using `bulkCreate`.
   - Inserts variants in chunks to manage large datasets efficiently.
3. **Communication**: Once the worker finishes processing, it sends a message back to the main script, allowing it to resume reading from the file.

#### Example Worker Code

```javascript
const { parentPort, workerData } = require('worker_threads');
const db = require('../models/index');

const { products, variants } = workerData;

(async () => {
    try {
        await db.Product.bulkCreate(products, { ignoreDuplicates: true });
        const chunkedVariants = chunkArray(variants, 3000);
        
        for (const chunk of chunkedVariants) {
            await db.Variant.bulkCreate(chunk, { ignoreDuplicates: true });
        }

        parentPort.postMessage('done');
    } catch (error) {
        console.error(`Error in worker: ${error}`);
    }
})();
```

### Logging

The project uses the Winston library for logging errors and migration progress. Ensure that your logging configuration is set up in `helpers/winston.js`.

