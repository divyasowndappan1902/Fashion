const https = require('https');
const fs = require('fs');

const url = 'https://en.wikipedia.org/w/api.php?action=query&titles=Dress_shirt&prop=pageimages&format=json&pithumbsize=500';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};
https.get(url, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data);
        const pages = json.query.pages;
        const pageId = Object.keys(pages)[0];
        const imgUrl = pages[pageId].thumbnail.source;
        console.log(imgUrl);
    });
});
