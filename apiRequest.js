const fs = require('fs');
const http = require('http');
const url = require('url');

const generateCard = require('./card');

function readProductData(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err.message);
            }
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (parseError) {
                reject(parseError.message);
            }
        });
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    if (path.startsWith('/product/')) {
        const page = parseInt(path.split('/')[2]);
        const filePath = 'data/product.json';

        try {
            const productData = await readProductData(filePath);
            const product = productData.find((p) => p.id === page);

            if (product) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Produit ${product.id}</title>
            <link rel="stylesheet" href="cards.css">
          </head>
          <body>
            ${generateCard(product)}
          </body>
          </html>
        `);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Produit introuvable</title>
          </head>
          <body>
            <h1>Produit non trouvé</h1>
          </body>
          </html>
        `);
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Erreur</title>
        </head>
        <body>
          <h1>Erreur interne du serveur</h1>
        </body>
        </html>
      `);
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 Not Found</title>
      </head>
      <body>
        <h1>Route non trouvée</h1>
      </body>
      </html>
    `);
    }
});

server.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});