document.addEventListener('DOMContentLoaded', () => {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent card click
            window.location.href = 'wishlist.html';
        });
    });

    // Make product cards clickable to redirect to product overview
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Do not redirect if they click add to cart or wishlist
            if (!e.target.closest('.add-to-cart-btn') && !e.target.closest('.wishlist-btn')) {
                window.location.href = 'product.html';
            }
        });
    });

    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent card click
            window.location.href = 'cart.html';
        });
    });

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
        
        // Check if this group has an "ANY" pill which acts as a reset/default
        const anyPill = Array.from(pills).find(p => p.textContent.trim().toUpperCase().includes('ANY'));
        
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const isAnyPill = pill.textContent.trim().toUpperCase().includes('ANY');
                
                if (isAnyPill) {
                    // Clicking 'ANY' clears all others and activates itself
                    pills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                } else {
                    // Clicking a specific filter
                    if (anyPill) anyPill.classList.remove('active');
                    
                    // Toggle current pill
                    pill.classList.toggle('active');
                    
                    // If no pills are active now, and there is an 'ANY' pill, activate it
                    const hasActive = Array.from(pills).some(p => p.classList.contains('active'));
                    if (!hasActive && anyPill) {
                        anyPill.classList.add('active');
                    }
                }
                
                // Apply the filters
                applyFilters();
            });
        });
    });

    // The filtering logic
    const applyFilters = () => {
        const products = document.querySelectorAll('.product-card');
        if (!products.length) return; // Only run on pages with products
        
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
            
            // Price Filter
            if (activePrice !== 'ANY PRICE' && activePrice !== 'ANY') {
                const price = parseFloat(product.getAttribute('data-price') || 0);
                if (activePrice === 'UNDER $75' && price >= 75) isVisible = false;
                if (activePrice === '$75 - $150' && (price < 75 || price > 150)) isVisible = false;
                if (activePrice === '$150 - $300' && (price < 150 || price > 300)) isVisible = false;
                if (activePrice === 'OVER $300' && price <= 300) isVisible = false;
            }
            
            // Color Filter
            if (activeColors.length > 0) {
                const productColors = (product.getAttribute('data-color') || '').toUpperCase().split(',').map(c => c.trim());
                const hasColor = productColors.some(c => activeColors.includes(c));
                if (!hasColor) isVisible = false;
            }
            
            // Rating Filter
            if (activeRating !== 'ANY') {
                const rating = parseFloat(product.getAttribute('data-rating') || 0);
                if (activeRating === '4.5+' && rating < 4.5) isVisible = false;
                if (activeRating === '4.7+' && rating < 4.7) isVisible = false;
                if (activeRating === '4.9+' && rating < 4.9) isVisible = false;
            }
            
            // Apply visibility
            if (isVisible) {
                product.style.display = '';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });
        
        // Update product count
        const countEl = document.querySelector('.product-count .sub-heading');
        if (countEl) {
            countEl.textContent = visibleCount + (visibleCount === 1 ? ' PIECE' : ' PIECES');
        }
    };
    
    // Call once on load in case any filters are active by default
    applyFilters();

    // Dashboard Mobile Menu Toggle
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

        // Close when clicking a link inside the sidebar on mobile
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
});


// Dynamic User Email
(function() {
    const savedEmail = localStorage.getItem('stackly_user_email');
    if (savedEmail) {
        document.querySelectorAll('.user-email').forEach(el => {
            el.textContent = savedEmail;
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
