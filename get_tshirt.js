const https = require('https');
const fs = require('fs');
const sharp = require('sharp');

const url = 'https://en.wikipedia.org/w/api.php?action=query&titles=T-shirt&prop=pageimages&format=json&pithumbsize=600';
const outputPath = 'c:/Users/Admin/Desktop/fashion/assets/performance_active_tee.webp';

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0'
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const pages = json.query.pages;
            const pageId = Object.keys(pages)[0];
            const imgUrl = pages[pageId].thumbnail.source;
            console.log('Downloading from:', imgUrl);

            https.get(imgUrl, options, (imgRes) => {
                let chunks = [];
                imgRes.on('data', chunk => chunks.push(chunk));
                imgRes.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    sharp(buffer)
                        .webp({ quality: 80 })
                        .toFile(outputPath)
                        .then(info => {
                            console.log(`Saved as ${outputPath}`);
                            console.log(`Size: ${(info.size / 1024).toFixed(2)} KB`);
                        })
                        .catch(err => console.error("Sharp error:", err));
                });
            });
        } catch (e) {
            console.error("JSON parse error:", e.message);
        }
    });
});
