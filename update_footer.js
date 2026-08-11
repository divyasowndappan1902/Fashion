const fs = require('fs');

let indexHtml = fs.readFileSync('c:/Users/Admin/Desktop/fashion/index.html', 'utf8');
const footerRegex = /<footer[^>]*>([\s\S]*?)<\/footer>/i;
const match = indexHtml.match(footerRegex);

if (match) {
    const cleanFooter = '<footer data-aos="fade-up" class="footer">\n' +
      '      <div class="footer-grid">\n' +
      '          <div class="footer-brand">\n' +
      '              <div class="logo">\n' +
      '                  <img src="assets/logo_0174.webp" alt="STACKLY Logo" class="logo-img" />\n' +
      '              </div>\n' +
      '              <p>Premium looks, everyday comfort and honest pricing \\u2014 made for real life.</p>\n' +
      '          </div>\n' +
      '          <div class="footer-links">\n' +
      '              <h4>SHOP</h4>\n' +
      '              <ul>\n' +
      '                  <li><a href="404.html">New arrivals</a></li>\n' +
      '                  <li><a href="404.html">Men\\'s wear</a></li>\n' +
      '                  <li><a href="404.html">Women\\'s wear</a></li>\n' +
      '              </ul>\n' +
      '          </div>\n' +
      '          <div class="footer-links">\n' +
      '              <h4>COMPANY</h4>\n' +
      '              <ul>\n' +
      '                  <li><a href="404.html">Our journey</a></li>\n' +
      '                  <li><a href="404.html">Journal</a></li>\n' +
      '                  <li><a href="404.html">Contact</a></li>\n' +
      '                  <li><a href="404.html">Account</a></li>\n' +
      '              </ul>\n' +
      '          </div>\n' +
      '          <div class="footer-links">\n' +
      '              <h4>FOLLOW</h4>\n' +
      '              <ul>\n' +
      '                  <li><a href="404.html">Instagram \\u2014 @stackly.studio</a></li>\n' +
      '                  <li><a href="404.html">Pinterest \\u2014 @stackly</a></li>\n' +
      '                  <li><a href="404.html">hello@stackly.com</a></li>\n' +
      '              </ul>\n' +
      '          </div>\n' +
      '      </div>\n' +
      '      <div class="footer-bottom">\n' +
      '          <p>\\u00A9 2024 Stackly. All rights reserved.</p>\n' +
      '          <p>Order for surprise</p>\n' +
      '      </div>\n' +
      '  </footer>';

    indexHtml = indexHtml.replace(match[0], cleanFooter);
    fs.writeFileSync('c:/Users/Admin/Desktop/fashion/index.html', indexHtml);

    let shopHtml = fs.readFileSync('c:/Users/Admin/Desktop/fashion/shop.html', 'utf8');
    shopHtml = shopHtml.replace(/<footer[^>]*>([\s\S]*?)<\/footer>/i, cleanFooter);
    fs.writeFileSync('c:/Users/Admin/Desktop/fashion/shop.html', shopHtml);

    let contactHtml = fs.readFileSync('c:/Users/Admin/Desktop/fashion/contact.html', 'utf8');
    contactHtml = contactHtml.replace(/<footer[^>]*>([\s\S]*?)<\/footer>/i, cleanFooter);
    fs.writeFileSync('c:/Users/Admin/Desktop/fashion/contact.html', contactHtml);
    
    console.log("Updated index.html, shop.html, and contact.html with clean footer.");
}
