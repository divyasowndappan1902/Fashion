const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Admin/Desktop/fashion';
const emojiRegex = /\p{Emoji_Presentation}/gu;

function scanDir(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'assets') {
                scanDir(fullPath);
            }
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            let lines = content.split('\n');
            lines.forEach((line, index) => {
                const matches = line.match(emojiRegex);
                if (matches) {
                    // Filter out things like registered trademark if they match, but Emoji_Presentation is usually safe
                    console.log(`${file}:${index + 1}: ${matches.join(', ')} -> ${line.trim()}`);
                }
            });
        }
    }
}

scanDir(dir);
