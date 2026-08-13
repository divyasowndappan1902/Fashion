document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.wishlist-btn');
        if (btn) {
            e.preventDefault();
            e.stopPropagation(); // Prevent card click
            
            const card = btn.closest('.product-card');
            if (card) {
                const title = card.querySelector('.product-title') ? card.querySelector('.product-title').textContent : '';
                let wishlist = JSON.parse(localStorage.getItem('stackly_wishlist') || '[]');
                
                const isWishlistPage = window.location.pathname.includes('wishlist.html');
                
                if (isWishlistPage || btn.classList.contains('active')) {
                    // Remove from wishlist
                    wishlist = wishlist.filter(item => item.title !== title);
                    localStorage.setItem('stackly_wishlist', JSON.stringify(wishlist));
                    
                    if (isWishlistPage) {
                        card.remove();
                        updateWishlistCount();
                    } else {
                        btn.classList.remove('active');
                    }
                } else {
                    // Add to wishlist
                    const img = card.querySelector('img') ? card.querySelector('img').src : '';
                    const price = card.querySelector('.product-price') ? card.querySelector('.product-price').textContent : '';
                    const category = card.querySelector('.product-category') ? card.querySelector('.product-category').textContent : '';
                    
                    if (!wishlist.some(item => item.title === title)) {
                        wishlist.unshift({ img, title, price, category });
                        localStorage.setItem('stackly_wishlist', JSON.stringify(wishlist));
                    }
                    btn.classList.add('active');
                    window.location.href = 'wishlist.html';
                }
            }
        }
    });
    
    function updateWishlistCount() {
        const subtitle = document.querySelector('.wishlist-subtitle');
        if (subtitle) {
            const count = document.querySelectorAll('.product-grid .product-card').length;
            subtitle.textContent = `${count} PIECE${count !== 1 ? 'S' : ''} SAVED`;
        }
    }

    // Populate Wishlist page dynamically
    if (window.location.pathname.includes('wishlist.html')) {
        const grid = document.querySelector('.product-grid');
        if (grid) {
            let wishlist = JSON.parse(localStorage.getItem('stackly_wishlist') || '[]');
            if (wishlist.length > 0) {
                // Prepend dynamically saved items
                wishlist.reverse().forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <div class="product-image">
                            <button class="wishlist-btn active"><span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1; vertical-align: middle;">favorite</span></button>
                            <img src="${item.img}" alt="${item.title}">
                        </div>
                        <div class="product-info">
                            <div class="product-title-row">
                                <span class="product-title">${item.title}</span>
                                <span class="product-price">${item.price}</span>
                            </div>
                            <span class="product-category">${item.category}</span>
                        </div>
                    `;
                    grid.insertBefore(card, grid.firstChild);
                });
            }
            updateWishlistCount();
        }
    }

    // Make product images clickable to redirect to product overview
    const productImages = document.querySelectorAll('.product-image');
    productImages.forEach(container => {
        container.style.cursor = 'pointer';
        container.addEventListener('click', (e) => {
            if (!e.target.closest('.wishlist-btn') && !e.target.closest('.badge')) {
                const card = container.closest('.product-card');
                if (card) {
                    const img = container.querySelector('img');
                    const title = card.querySelector('.product-title');
                    const price = card.querySelector('.product-price');
                    
                    if (img) localStorage.setItem('pdp_img', img.src);
                    if (title) localStorage.setItem('pdp_title', title.textContent);
                    if (price) localStorage.setItem('pdp_price', price.textContent);
                }
                window.location.href = 'product.html';
            }
        });
    });

    // Populate Product Detail Page (PDP) dynamically
    const pdpMainImg = document.querySelector('.pdp-main-image');
    if (pdpMainImg) {
        const savedImg = localStorage.getItem('pdp_img');
        const savedTitle = localStorage.getItem('pdp_title');
        const savedPrice = localStorage.getItem('pdp_price');
        
        if (savedImg) pdpMainImg.src = savedImg;
        if (savedTitle) {
            const titleEl = document.querySelector('.pdp-title');
            if (titleEl) titleEl.textContent = savedTitle;
        }
        if (savedPrice && savedPrice.trim() !== '') {
            const priceEl = document.querySelector('.pdp-price');
            if (priceEl) priceEl.textContent = savedPrice;
        }
    }
    // Handle newsletter subscription (bypass HTML5 validation for instant redirect)
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    subscribeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '404.html';
        });
    });

    // Dynamic cart logic
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent card click
            
            const card = btn.closest('.product-card');
            if (card) {
                const imgEl = card.querySelector('img');
                const img = imgEl ? imgEl.src : '';
                
                const titleEl = card.querySelector('.product-title');
                const title = titleEl ? titleEl.textContent : 'Unknown Item';
                
                const priceTextEl = card.querySelector('.product-price');
                const priceText = priceTextEl ? priceTextEl.textContent : '';
                
                const attrPrice = card.getAttribute('data-price');
                const price = parseFloat(attrPrice || priceText.replace(/[^0-9.]/g, '') || 0);
                
                const catEl = card.querySelector('.product-category');
                const category = catEl ? catEl.textContent : "MEN'S WEAR";
                
                const size = card.getAttribute('data-size') || 'M';
                
                let cart = JSON.parse(localStorage.getItem('stackly_cart')) || [];
                const existing = cart.find(item => item.title === title);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cart.push({ img, title, price, category, size, quantity: 1 });
                }
                localStorage.setItem('stackly_cart', JSON.stringify(cart));
            }
            window.location.href = 'cart.html';
        });
    });

    const pdpAddBtn = document.querySelector('.pdp-btn-add');
    if (pdpAddBtn) {
        pdpAddBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const img = document.querySelector('.pdp-main-image').src;
            const title = document.querySelector('.pdp-title').textContent;
            const price = 145; // Hardcoded for this page as per HTML
            let cart = JSON.parse(localStorage.getItem('stackly_cart')) || [];
            const existing = cart.find(item => item.title === title);
            
            // get qty
            const qtyInput = document.querySelector('.pdp-quantity-input');
            const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;

            if (existing) {
                existing.quantity += qty;
            } else {
                cart.push({ img, title, price, category: "MEN'S WEAR", size: 'M', quantity: qty });
            }
            localStorage.setItem('stackly_cart', JSON.stringify(cart));
            window.location.href = 'cart.html';
        });
    }

    // Dynamic Active Navigation System
    const setCurrentPageActive = () => {
        const path = window.location.pathname;
        let page = path.split('/').pop();
        if (!page || page === '') {
            page = 'index.html'; // Default to home
        }
        
        // Select all navigation links
        const navLinks = document.querySelectorAll('.nav-links a, .sidebar-nav a');
        
        const updateActiveLink = (targetHref) => {
            navLinks.forEach(link => {
                if (link.hasAttribute('data-target')) return;
                link.classList.remove('active');
                
                const href = link.getAttribute('href');
                if (href && (href === targetHref || (href === '/' && targetHref === 'index.html'))) {
                    link.classList.add('active');
                }
            });
        };

        // Set initial active state based on current URL
        updateActiveLink(page);

        // Add click listener to update immediately without waiting for page refresh
        navLinks.forEach(link => {
            if (link.hasAttribute('data-target')) return;
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href) {
                    updateActiveLink(href);
                }
            });
        });
    };
    
    setCurrentPageActive();

    // Filter Pills Interaction
    const pillGroups = document.querySelectorAll('.pill-group');
    pillGroups.forEach(group => {
        const pills = group.querySelectorAll('.pill');
        const anyPill = Array.from(pills).find(p => p.textContent.trim().toUpperCase().includes('ANY'));
        
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const isAnyPill = pill.textContent.trim().toUpperCase().includes('ANY');
                
                if (isAnyPill) {
                    pills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                } else {
                    if (anyPill) anyPill.classList.remove('active');
                    pill.classList.toggle('active');
                    const hasActive = Array.from(pills).some(p => p.classList.contains('active'));
                    if (!hasActive && anyPill) {
                        anyPill.classList.add('active');
                    }
                }
                applyFilters();
            });
        });
    });

    const applyFilters = () => {
        const products = document.querySelectorAll('.product-card');
        if (!products.length) return;
        
        const filterGroups = document.querySelectorAll('.filter-group');
        let activePrice = 'ANY PRICE';
        let activeColors = [];
        let activeRating = 'ANY';
        
        filterGroups.forEach(group => {
            const h4 = group.querySelector('h4');
            if (!h4) return;
            const type = h4.textContent.trim().toUpperCase();
            const activePills = Array.from(group.querySelectorAll('.pill.active')).map(p => p.textContent.trim().toUpperCase());
            
            if (type === 'PRICE' && activePills.length > 0) {
                activePrice = activePills[0];
            } else if (type === 'COLOUR') {
                activeColors = activePills;
            } else if (type === 'RATING' && activePills.length > 0) {
                activeRating = activePills[0];
            }
        });

        let visibleCount = 0;
        
        products.forEach(product => {
            let isVisible = true;
            if (activePrice !== 'ANY PRICE' && activePrice !== 'ANY') {
                const price = parseFloat(product.getAttribute('data-price') || 0);
                if (activePrice === 'UNDER $75' && price >= 75) isVisible = false;
                if (activePrice === '$75 - $150' && (price < 75 || price > 150)) isVisible = false;
                if (activePrice === '$150 - $300' && (price < 150 || price > 300)) isVisible = false;
                if (activePrice === 'OVER $300' && price <= 300) isVisible = false;
            }
            if (activeColors.length > 0) {
                const productColors = (product.getAttribute('data-color') || '').toUpperCase().split(',').map(c => c.trim());
                const hasColor = productColors.some(c => activeColors.includes(c));
                if (!hasColor) isVisible = false;
            }
            if (activeRating !== 'ANY') {
                const rating = parseFloat(product.getAttribute('data-rating') || 0);
                if (activeRating === '4.5+' && rating < 4.5) isVisible = false;
                if (activeRating === '4.7+' && rating < 4.7) isVisible = false;
                if (activeRating === '4.9+' && rating < 4.9) isVisible = false;
            }
            
            if (isVisible) {
                product.style.display = '';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });
        
        const countEl = document.querySelector('.product-count .sub-heading');
        if (countEl) {
            countEl.textContent = visibleCount + (visibleCount === 1 ? ' PIECE' : ' PIECES');
        }
    };
    
    applyFilters();

    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    const toggleBtns = document.querySelectorAll('.dashboard-mobile-toggle');
    const closeBtns = document.querySelectorAll('.close-dashboard-btn');

    if (dashboardSidebar) {
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                dashboardSidebar.classList.add('open');
                document.body.classList.add('no-scroll');
            });
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                dashboardSidebar.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });

        const sidebarLinks = dashboardSidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    dashboardSidebar.classList.remove('open');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    // Product Page Quantity Interactions
    const pdpQtyInput = document.querySelector('.pdp-quantity-input');
    const pdpQtyBtns = document.querySelectorAll('.pdp-quantity-btn');
    if (pdpQtyInput && pdpQtyBtns.length === 2) {
        const minusBtn = pdpQtyBtns[0];
        const plusBtn = pdpQtyBtns[1];

        minusBtn.addEventListener('click', () => {
            let val = parseInt(pdpQtyInput.value, 10) || 1;
            if (val > 1) {
                pdpQtyInput.value = val - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            let val = parseInt(pdpQtyInput.value, 10) || 1;
            pdpQtyInput.value = val + 1;
        });
    }

    // Render Cart from LocalStorage
    const renderCart = () => {
        const cartItemsContainer = document.getElementById('cart-items-container');
        if (!cartItemsContainer) return;
        
        const cart = JSON.parse(localStorage.getItem('stackly_cart')) || [];
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            document.getElementById('cart-subtotal').textContent = '$0';
            document.getElementById('cart-total').textContent = '$12';
            document.getElementById('cart-item-count').textContent = '0 ITEMS';
            return;
        }

        let subtotal = 0;
        let count = 0;
        
        cart.forEach((item, index) => {
            subtotal += (item.price * item.quantity);
            count += item.quantity;
            
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.img}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <p class="cart-item-meta">${item.category} &middot; SIZE ${item.size}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="cart-qty">
                        <button class="cart-qty-btn cart-qty-minus" data-index="${index}"><span class="material-symbols-outlined" style="vertical-align: middle;">remove</span></button>
                        <input type="text" value="${item.quantity}" class="cart-qty-input" readonly>
                        <button class="cart-qty-btn cart-qty-plus" data-index="${index}"><span class="material-symbols-outlined" style="vertical-align: middle;">add</span></button>
                    </div>
                    <button class="cart-item-remove" data-index="${index}" title="Remove item"><span class="material-symbols-outlined" style="vertical-align: middle;">delete</span></button>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });
        
        document.getElementById('cart-subtotal').textContent = '$' + subtotal.toFixed(2);
        document.getElementById('cart-total').textContent = '$' + (subtotal + 12).toFixed(2);
        document.getElementById('cart-item-count').textContent = count + (count === 1 ? ' ITEM' : ' ITEMS');
        
        // Attach events to generated elements
        cartItemsContainer.querySelectorAll('.cart-qty-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity--;
                    localStorage.setItem('stackly_cart', JSON.stringify(cart));
                    renderCart();
                }
            });
        });
        
        cartItemsContainer.querySelectorAll('.cart-qty-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                cart[idx].quantity++;
                localStorage.setItem('stackly_cart', JSON.stringify(cart));
                renderCart();
            });
        });
        
        cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                cart.splice(idx, 1);
                localStorage.setItem('stackly_cart', JSON.stringify(cart));
                renderCart();
            });
        });
    };
    
    renderCart();

});



// Dynamic User Email
(function() {
    const savedEmail = localStorage.getItem('stackly_user_email');
    if (savedEmail) {
        document.querySelectorAll('.user-email').forEach(el => {
            el.textContent = savedEmail;
        });
        document.querySelectorAll('.user-email-input').forEach(el => {
            el.value = savedEmail;
        });
    }
})();

// Dynamic User Name
(function() {
    const savedName = localStorage.getItem('stackly_user_name');
    if (savedName) {
        document.querySelectorAll('.user-name-display').forEach(el => {
            el.innerHTML = savedName;
        });
        document.querySelectorAll('.user-name-input').forEach(el => {
            el.value = savedName;
        });
    }
})();

// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }
});
