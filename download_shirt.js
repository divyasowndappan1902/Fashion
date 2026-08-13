const https = require('https');
const fs = require('fs');
const sharp = require('sharp'); // sharp should be available from previous tasks

const url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Camisade_pu%C3%B1o_doble.jpg/500px-Camisade_pu%C3%B1o_doble.jpg';
const outputPath = 'c:/Users/Admin/Desktop/fashion/assets/casual_shirt.webp';

https.get(url, (res) => {
    let chunks = [];
    res.on('data', chunk => chunks.push(chunk));
    res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        sharp(buffer)
            .webp({ quality: 80 })
            .toFile(outputPath)
            .then(info => {
                console.log(`Saved as ${outputPath}`);
                console.log(`Size: ${(info.size / 1024).toFixed(2)} KB`);
            })
            .catch(err => {
                console.error("Error processing image:", err);
            });
    });
}).on('error', err => {
    console.error("Download error:", err.message);
});
