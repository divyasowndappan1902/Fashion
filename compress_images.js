const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, 'assets');
const MAX_SIZE = 100 * 1024; // 100KB

async function processImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath, ext);
    let outputWebp = path.join(assetsDir, `${basename}.webp`);
    
    // We want to skip .svg
    if (ext === '.svg') return;
    
    // If it's jpg/png, we will output to webp. If it's already webp, we might compress in-place (via a temp file).
    let tempOutput = path.join(assetsDir, `${basename}_temp.webp`);
    
    let stats = fs.statSync(filePath);
    
    // If it's already a webp and < 100kb, skip
    if (ext === '.webp' && stats.size <= MAX_SIZE) {
        return;
    }

    console.log(`Processing ${path.basename(filePath)} (${(stats.size/1024).toFixed(2)} KB)...`);
    
    let quality = 80;
    let width = null;
    let size = Infinity;
    
    // Try to compress
    while (size > MAX_SIZE && quality > 10) {
        let image = sharp(filePath);
        if (width) {
            image = image.resize({ width });
        }
        
        await image.webp({ quality }).toFile(tempOutput);
        size = fs.statSync(tempOutput).size;
        
        if (size > MAX_SIZE) {
            quality -= 10;
            // If quality drops very low, also resize
            if (quality < 50) {
                const metadata = await sharp(filePath).metadata();
                if (!width) width = metadata.width;
                width = Math.floor(width * 0.8);
            }
        }
    }
    
    // Replace old with new
    if (ext === '.webp') {
        fs.unlinkSync(filePath);
        fs.renameSync(tempOutput, filePath);
    } else {
        fs.renameSync(tempOutput, outputWebp);
        fs.unlinkSync(filePath);
    }
    
    console.log(`-> Saved ${basename}.webp (${(fs.statSync(outputWebp).size/1024).toFixed(2)} KB)`);
}

async function run() {
    const files = fs.readdirSync(assetsDir);
    for (const file of files) {
        const filePath = path.join(assetsDir, file);
        if (fs.statSync(filePath).isFile()) {
            await processImage(filePath);
        }
    }
    console.log("Done processing all images.");
}

run().catch(console.error);
