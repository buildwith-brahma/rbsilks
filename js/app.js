/**
 * R B SILKS - Client Application Logic
 */

// Application State
const state = {
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'featured',
    wishlist: JSON.parse(localStorage.getItem('rbs_wishlist') || '[]'),
    bag: JSON.parse(localStorage.getItem('rbs_bag') || '[]'),
    activeQuickViewId: null
};

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', async () => {
    await loadCatalogFromSheet();
    initApp();
});

/**
 * Load products from a published Google Sheet (CSV).
 * If SHEET_CSV_URL is empty or loading fails, the built-in SAREES in data.js are used.
 */
async function loadCatalogFromSheet() {
    if (typeof SHEET_CSV_URL === 'undefined' || !SHEET_CSV_URL) return;
    try {
        const res = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const rows = parseCSV(await res.text());
        const headers = rows.shift().map(h => h.trim());
        const toList = v => (v || '').split(/[,|\n]/).map(s => s.trim()).filter(Boolean);
        const toBool = v => /^(true|yes|1)$/i.test((v || '').trim());
        const toNum = v => parseFloat(String(v || '').replace(/[^0-9.]/g, '')) || 0;

        const items = rows
            .filter(r => r.some(c => c.trim()))
            .map(r => {
                const o = {};
                headers.forEach((h, i) => { o[h] = (r[i] || '').trim(); });
                const gallery = toList(o.gallery);
                return {
                    id: o.id,
                    title: o.title,
                    category: o.category,
                    tags: toList(o.tags),
                    price: toNum(o.price),
                    originalPrice: toNum(o.originalPrice) || toNum(o.price),
                    rating: toNum(o.rating) || 5,
                    reviewsCount: toNum(o.reviewsCount),
                    color: o.color,
                    fabric: o.fabric,
                    zari: o.zari,
                    weave: o.weave,
                    blouse: o.blouse,
                    description: o.description,
                    image: o.image,
                    gallery: gallery.length ? gallery : [o.image],
                    inStock: o.inStock === '' ? true : toBool(o.inStock),
                    isNew: toBool(o.isNew),
                    isFeatured: toBool(o.isFeatured)
                };
            })
            .filter(p => p.id && p.title && p.image);

        if (items.length) SAREES.splice(0, SAREES.length, ...items);
    } catch (err) {
        console.warn('Google Sheet could not be loaded, using built-in catalogue.', err);
    }
}

/** Minimal CSV parser (handles quoted fields, commas and newlines inside quotes). */
function parseCSV(text) {
    const rows = [];
    let row = [], field = '', inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (inQuotes) {
            if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
            else if (ch === '"') inQuotes = false;
            else field += ch;
        } else if (ch === '"') inQuotes = true;
        else if (ch === ',') { row.push(field); field = ''; }
        else if (ch === '\n' || ch === '\r') {
            if (ch === '\r' && text[i + 1] === '\n') i++;
            row.push(field); rows.push(row); row = []; field = '';
        } else field += ch;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows;
}

function initApp() {
    if (!ENABLE_CATALOG) {
        document.querySelectorAll('.catalog-feature').forEach(el => el.classList.add('hidden'));
    }
    if (!ENABLE_BAG) {
        document.querySelectorAll('.bag-feature').forEach(el => el.classList.add('hidden'));
    }
    renderStoreInfo();
    renderCategories();
    renderSarees();
    renderTestimonials();
    renderFAQs();
    updateBagBadge();
    updateWishlistBadge();
    setupEventListeners();
}

/**
 * Render Store Contact & Branding Details
 */
function renderStoreInfo() {
    const phoneEls = document.querySelectorAll('.store-phone');
    const emailEls = document.querySelectorAll('.store-email');
    const addressEls = document.querySelectorAll('.store-address');
    const timingEls = document.querySelectorAll('.store-timings');

    phoneEls.forEach(el => el.textContent = STORE_CONFIG.phone);
    emailEls.forEach(el => el.textContent = STORE_CONFIG.email);
    addressEls.forEach(el => el.textContent = STORE_CONFIG.address);
    timingEls.forEach(el => el.textContent = STORE_CONFIG.timings);

    const whatsappLinks = document.querySelectorAll('.store-whatsapp-link');
    whatsappLinks.forEach(el => {
        el.href = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello R B SILKS, I would like to inquire about your exclusive silk saree collections.')}`;
    });
}

/**
 * Render Category Filter Buttons
 */
function renderCategories() {
    const container = document.getElementById('category-filter-container');
    if (!container) return;

    container.innerHTML = SAREE_CATEGORIES.map(cat => `
        <button 
            type="button"
            onclick="setCategory('${cat.id}')"
            class="category-chip px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold flex items-center gap-2 cursor-pointer ${state.selectedCategory === cat.id ? 'active' : ''}"
            id="cat-btn-${cat.id}"
        >
            <i class="fa-solid ${cat.icon} text-xs"></i>
            <span>${cat.name}</span>
        </button>
    `).join('');
}

/**
 * Filter & Sort Sarees
 */
function getFilteredSarees() {
    return SAREES.filter(saree => {
        // Category filter
        const matchCategory = state.selectedCategory === 'all' 
            || saree.category === state.selectedCategory 
            || saree.tags.includes(state.selectedCategory);

        // Search filter
        const query = state.searchQuery.toLowerCase().trim();
        const matchSearch = !query 
            || saree.title.toLowerCase().includes(query)
            || saree.id.toLowerCase().includes(query)
            || saree.color.toLowerCase().includes(query)
            || saree.fabric.toLowerCase().includes(query)
            || saree.category.toLowerCase().includes(query);

        return matchCategory && matchSearch;
    }).sort((a, b) => {
        if (state.sortBy === 'price-low') return a.price - b.price;
        if (state.sortBy === 'price-high') return b.price - a.price;
        if (state.sortBy === 'rating') return b.rating - a.rating;
        // Default: featured or new
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
}

/**
 * Render Saree Cards in Catalog Grid
 */
function renderSarees() {
    const grid = document.getElementById('saree-grid');
    const emptyState = document.getElementById('saree-empty-state');
    const countEl = document.getElementById('saree-count');

    if (!grid) return;

    const filtered = getFilteredSarees();
    if (countEl) countEl.textContent = `${filtered.length} Exclusive Sarees`;

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = filtered.map(saree => {
        const isWishlisted = state.wishlist.includes(saree.id);
        const discountPercent = Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100);

        return `
            <div class="saree-card rounded-2xl overflow-hidden shadow-sm flex flex-col group">
                <!-- Saree Image Section -->
                <div class="saree-image-wrap h-80 md:h-96 bg-gray-100 relative cursor-pointer" onclick="openQuickView('${saree.id}')">
                    <img 
                        src="${saree.image}" 
                        alt="${saree.title}"
                        loading="lazy"
                        class="w-full h-full object-cover object-top"
                    />

                    <!-- Overlay Gradient -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <button class="w-full py-2.5 bg-white/95 hover:bg-white text-maroon-dark text-xs font-bold rounded-lg shadow-lg uppercase tracking-wider transition-all transform translate-y-2 group-hover:translate-y-0">
                            <i class="fa-solid fa-eye mr-1.5 text-amber-600"></i> Quick View Details
                        </button>
                    </div>

                    <!-- Top Badges -->
                    <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        <span class="badge-silk-mark px-2.5 py-1 rounded shadow-md flex items-center gap-1">
                            <i class="fa-solid fa-certificate text-[10px]"></i> Pure Silk
                        </span>
                        ${saree.tags.includes('pure-zari') ? `
                            <span class="badge-pure-zari px-2 py-0.5 rounded shadow-md flex items-center gap-1">
                                <i class="fa-solid fa-crown text-[10px]"></i> Pure Zari
                            </span>
                        ` : ''}
                        ${saree.isNew ? `
                            <span class="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow uppercase">
                                New Arrival
                            </span>
                        ` : ''}
                    </div>

                    <!-- Wishlist Toggle Button -->
                    <button 
                        type="button" 
                        onclick="event.stopPropagation(); toggleWishlist('${saree.id}')"
                        class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all z-10 ${isWishlisted ? 'text-red-600' : 'text-gray-500 hover:text-red-500'}"
                        title="Add to Wishlist"
                    >
                        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart text-base"></i>
                    </button>

                    <!-- Code Badge -->
                    <div class="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-mono px-2 py-0.5 rounded">
                        #${saree.id}
                    </div>
                </div>

                <!-- Saree Content Section -->
                <div class="p-5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                        <!-- Category & Rating -->
                        <div class="flex items-center justify-between text-xs text-muted mb-1.5">
                            <span class="uppercase font-semibold tracking-wider text-amber-800 text-[11px]">${saree.category.replace('-', ' ')}</span>
                            <span class="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                                <i class="fa-solid fa-star text-[10px]"></i> ${saree.rating}
                            </span>
                        </div>

                        <!-- Title -->
                        <h3 
                            onclick="openQuickView('${saree.id}')"
                            class="font-serif-sub text-base md:text-lg font-bold text-gray-900 group-hover:text-[#5c0819] transition-colors line-clamp-2 cursor-pointer mb-2 leading-snug"
                        >
                            ${saree.title}
                        </h3>

                        <!-- Color & Fabric highlights -->
                        <p class="text-xs text-gray-500 line-clamp-1 mb-3">
                            <span class="font-medium text-gray-700">Shade:</span> ${saree.color}
                        </p>
                    </div>

                    <div>
                        <!-- Price section -->
                        <div class="flex items-baseline gap-2 mb-4 pt-2 border-t border-gray-100">
                            <span class="text-xl md:text-2xl font-bold text-gray-900">
                                ₹${saree.price.toLocaleString('en-IN')}
                            </span>
                            <span class="text-xs md:text-sm text-gray-400 line-through">
                                ₹${saree.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                                ${discountPercent}% OFF
                            </span>
                        </div>

                        <!-- Action Buttons -->
                        <div class="grid ${ENABLE_BAG ? 'grid-cols-2' : 'grid-cols-1'} gap-2">
                            ${ENABLE_BAG ? `<button
                                type="button"
                                onclick="addToBag('${saree.id}')"
                                class="py-2.5 px-3 rounded-lg border border-[#cba135] text-[#5c0819] hover:bg-[#faf7f2] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                            >
                                <i class="fa-solid fa-bag-shopping text-amber-700"></i>
                                <span>Add to Bag</span>
                            </button>` : ''}

                            <button 
                                type="button"
                                onclick="orderViaWhatsApp('${saree.id}')"
                                class="btn-whatsapp py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                                title="Direct WhatsApp Order"
                            >
                                <i class="fa-brands fa-whatsapp text-sm"></i>
                                <span>Order Now</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Filter handlers
 */
function setCategory(categoryId) {
    state.selectedCategory = categoryId;
    renderCategories();
    renderSarees();

    // Smooth scroll to catalog if clicked from outside
    const catalogSection = document.getElementById('catalog-section');
    if (catalogSection && window.scrollY < catalogSection.offsetTop - 150) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleSearch(event) {
    state.searchQuery = event.target.value;
    renderSarees();
}

function handleSort(event) {
    state.sortBy = event.target.value;
    renderSarees();
}

/**
 * Wishlist Operations
 */
function toggleWishlist(sareeId) {
    const index = state.wishlist.indexOf(sareeId);
    if (index > -1) {
        state.wishlist.splice(index, 1);
        showToast('Removed from your Wishlist', 'info');
    } else {
        state.wishlist.push(sareeId);
        showToast('Added to your Wishlist ❤️', 'success');
    }
    localStorage.setItem('rbs_wishlist', JSON.stringify(state.wishlist));
    updateWishlistBadge();
    renderSarees();
}

function updateWishlistBadge() {
    const badges = document.querySelectorAll('.wishlist-count-badge');
    badges.forEach(b => {
        b.textContent = state.wishlist.length;
        b.style.display = state.wishlist.length > 0 ? 'flex' : 'none';
    });
}

function showWishlistModal() {
    if (state.wishlist.length === 0) {
        showToast('Your wishlist is currently empty. Browse sarees and tap the heart icon!', 'info');
        return;
    }
    // Filter to wishlisted sarees
    state.selectedCategory = 'all';
    state.searchQuery = '';
    const searchInput = document.getElementById('saree-search-input');
    if (searchInput) searchInput.value = '';

    const grid = document.getElementById('saree-grid');
    const wishlistedSarees = SAREES.filter(s => state.wishlist.includes(s.id));
    const countEl = document.getElementById('saree-count');

    if (countEl) countEl.textContent = `Wishlist: ${wishlistedSarees.length} Items`;

    grid.innerHTML = wishlistedSarees.map(saree => {
        return `
            <div class="saree-card rounded-2xl overflow-hidden shadow-sm flex flex-col group">
                <div class="saree-image-wrap h-80 bg-gray-100 relative cursor-pointer" onclick="openQuickView('${saree.id}')">
                    <img src="${saree.image}" alt="${saree.title}" class="w-full h-full object-cover object-top" />
                    <button 
                        type="button" 
                        onclick="event.stopPropagation(); toggleWishlist('${saree.id}'); showWishlistModal();"
                        class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-red-600"
                    >
                        <i class="fa-solid fa-trash text-sm"></i>
                    </button>
                </div>
                <div class="p-4 flex-1 flex flex-col justify-between">
                    <h3 class="font-serif-sub font-bold text-gray-900 text-sm mb-2 line-clamp-2">${saree.title}</h3>
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-lg font-bold text-gray-900">₹${saree.price.toLocaleString('en-IN')}</span>
                        <span class="text-xs text-gray-500 font-mono">#${saree.id}</span>
                    </div>
                    <div class="grid ${ENABLE_BAG ? 'grid-cols-2' : 'grid-cols-1'} gap-2">
                        ${ENABLE_BAG ? `<button onclick="addToBag('${saree.id}')" class="py-2 text-xs font-semibold border border-amber-600 text-amber-800 rounded">Add to Bag</button>` : ''}
                        <button onclick="orderViaWhatsApp('${saree.id}')" class="btn-whatsapp py-2 text-xs font-bold rounded">Order Now</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const catalogSection = document.getElementById('catalog-section');
    if (catalogSection) catalogSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Inquiry Bag / Cart Operations
 */
function addToBag(sareeId) {
    const existing = state.bag.find(item => item.id === sareeId);
    if (existing) {
        existing.qty += 1;
        showToast('Updated item quantity in your Bag', 'info');
    } else {
        state.bag.push({ id: sareeId, qty: 1 });
        showToast('Saree added to Inquiry Bag 🛍️', 'success');
    }
    localStorage.setItem('rbs_bag', JSON.stringify(state.bag));
    updateBagBadge();
    renderBagItems();
}

function updateBagBadge() {
    const totalItems = state.bag.reduce((sum, item) => sum + item.qty, 0);
    const badges = document.querySelectorAll('.bag-count-badge');
    badges.forEach(b => {
        b.textContent = totalItems;
        b.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function updateBagQty(sareeId, delta) {
    const item = state.bag.find(i => i.id === sareeId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        state.bag = state.bag.filter(i => i.id !== sareeId);
    }
    localStorage.setItem('rbs_bag', JSON.stringify(state.bag));
    updateBagBadge();
    renderBagItems();
}

function removeBagItem(sareeId) {
    state.bag = state.bag.filter(i => i.id !== sareeId);
    localStorage.setItem('rbs_bag', JSON.stringify(state.bag));
    updateBagBadge();
    renderBagItems();
    showToast('Item removed from Bag', 'info');
}

function clearBag() {
    state.bag = [];
    localStorage.setItem('rbs_bag', JSON.stringify(state.bag));
    updateBagBadge();
    renderBagItems();
    showToast('Inquiry Bag cleared', 'info');
}

function toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (!drawer || !backdrop) return;

    if (open) {
        renderBagItems();
        backdrop.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            drawer.classList.remove('closed');
            drawer.classList.add('open');
        }, 10);
    } else {
        drawer.classList.remove('open');
        drawer.classList.add('closed');
        backdrop.classList.add('opacity-0');
        setTimeout(() => {
            backdrop.classList.add('hidden');
        }, 300);
    }
}

function renderBagItems() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const footer = document.getElementById('cart-footer');
    const subtotalEl = document.getElementById('cart-subtotal');

    if (!container) return;

    if (state.bag.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        if (footer) footer.classList.add('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (footer) footer.classList.remove('hidden');

    let totalAmount = 0;

    container.innerHTML = state.bag.map(item => {
        const saree = SAREES.find(s => s.id === item.id);
        if (!saree) return '';

        const itemTotal = saree.price * item.qty;
        totalAmount += itemTotal;

        return `
            <div class="flex gap-4 p-4 rounded-xl border border-gray-100 bg-[#faf7f2]/50 hover:bg-[#faf7f2] transition-colors">
                <img src="${saree.image}" alt="${saree.title}" class="w-20 h-24 object-cover rounded-lg shrink-0 shadow-sm" />
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start gap-2">
                            <h4 class="font-serif-sub font-bold text-gray-900 text-sm line-clamp-1">${saree.title}</h4>
                            <button onclick="removeBagItem('${saree.id}')" class="text-gray-400 hover:text-red-600 text-xs">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                        <p class="text-xs text-amber-800 font-mono mt-0.5">Code: #${saree.id}</p>
                        <p class="text-sm font-bold text-gray-900 mt-1">₹${saree.price.toLocaleString('en-IN')}</p>
                    </div>

                    <div class="flex items-center justify-between pt-2 border-t border-gray-200/60">
                        <div class="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-0.5 bg-white">
                            <button onclick="updateBagQty('${saree.id}', -1)" class="text-gray-600 hover:text-black font-bold text-sm px-1.5">-</button>
                            <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
                            <button onclick="updateBagQty('${saree.id}', 1)" class="text-gray-600 hover:text-black font-bold text-sm px-1.5">+</button>
                        </div>
                        <span class="text-xs font-bold text-gray-900">₹${itemTotal.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
}

/**
 * Direct WhatsApp Order for Single Item
 */
function orderViaWhatsApp(sareeId) {
    const saree = SAREES.find(s => s.id === sareeId);
    if (!saree) return;

    const message = `*R B SILKS - Direct Saree Order / Inquiry* 🥻

Hello R B SILKS Team,
I would like to order / inquire about this saree:

✨ *Saree Title:* ${saree.title}
🏷️ *Product Code:* #${saree.id}
💰 *Offer Price:* ₹${saree.price.toLocaleString('en-IN')} (Original: ₹${saree.originalPrice.toLocaleString('en-IN')})
🎨 *Color/Shade:* ${saree.color}
🧵 *Fabric:* ${saree.fabric}
👑 *Zari Type:* ${saree.zari}

📍 *Image Reference:* ${saree.image}

Please confirm availability and share payment/delivery details. Thank you!`;

    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

/**
 * WhatsApp Checkout for Entire Bag
 */
function submitBagWhatsAppOrder(event) {
    if (event) event.preventDefault();

    if (state.bag.length === 0) {
        showToast('Your Bag is empty!', 'error');
        return;
    }

    const customerName = document.getElementById('checkout-name')?.value.trim() || 'Valued Customer';
    const customerCity = document.getElementById('checkout-city')?.value.trim() || 'India';
    const customerNotes = document.getElementById('checkout-notes')?.value.trim() || 'Standard Delivery & Tassels';

    let total = 0;
    let itemsText = '';

    state.bag.forEach((item, index) => {
        const saree = SAREES.find(s => s.id === item.id);
        if (saree) {
            const itemTotal = saree.price * item.qty;
            total += itemTotal;
            itemsText += `\n${index + 1}. *#${saree.id}* - ${saree.title}\n   Qty: ${item.qty} × ₹${saree.price.toLocaleString('en-IN')} = ₹${itemTotal.toLocaleString('en-IN')}\n`;
        }
    });

    const message = `*R B SILKS - Bag Order Inquiry* 🛍️👑

*Customer Details:*
👤 *Name:* ${customerName}
📍 *Delivery City / State:* ${customerCity}
📝 *Custom Notes / Blouse Req:* ${customerNotes}

*Selected Sarees (${state.bag.length} items):*
${itemsText}
---------------------------------
💳 *Total Estimated Amount:* ₹${total.toLocaleString('en-IN')}
🚚 *Shipping:* Complimentary Pan-India Insured Delivery
🎖️ *Silk Mark Certified Pure Silk Guaranteed*

Please share payment options (UPI / Bank Transfer / Card) and dispatch schedule.`;

    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    toggleCartDrawer(false);
}

/**
 * Product Quick View Modal Logic
 */
function openQuickView(sareeId) {
    const saree = SAREES.find(s => s.id === sareeId);
    if (!saree) return;

    state.activeQuickViewId = sareeId;
    const modal = document.getElementById('quickview-modal');
    const content = document.getElementById('quickview-content');

    if (!modal || !content) return;

    const discountPercent = Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100);

    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Left: Gallery -->
            <div class="space-y-4">
                <div class="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-inner relative">
                    <img id="qv-main-image" src="${saree.image}" alt="${saree.title}" class="w-full h-full object-cover object-top" />
                    <span class="absolute top-4 left-4 badge-silk-mark px-3 py-1 rounded shadow">
                        <i class="fa-solid fa-certificate mr-1"></i> Silk Mark Certified
                    </span>
                </div>
                <!-- Thumbnails -->
                <div class="flex gap-3 overflow-x-auto pb-2">
                    ${saree.gallery.map((img, idx) => `
                        <button 
                            onclick="document.getElementById('qv-main-image').src = '${img}'" 
                            class="w-20 h-24 rounded-lg overflow-hidden border-2 border-transparent hover:border-amber-600 shrink-0 transition-all focus:border-amber-600"
                        >
                            <img src="${img}" alt="angle ${idx + 1}" class="w-full h-full object-cover" />
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Right: Details -->
            <div class="flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span class="uppercase tracking-wider font-semibold text-amber-800">${saree.category.replace('-', ' ')}</span>
                        <span class="font-mono bg-gray-100 px-2.5 py-0.5 rounded text-gray-700">Code: #${saree.id}</span>
                    </div>

                    <h2 class="font-royal text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                        ${saree.title}
                    </h2>

                    <!-- Ratings -->
                    <div class="flex items-center gap-3 mb-4">
                        <div class="flex text-amber-500 text-sm">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <span class="text-xs font-semibold text-gray-600">${saree.rating} (${saree.reviewsCount} verified reviews)</span>
                    </div>

                    <!-- Price -->
                    <div class="flex items-baseline gap-3 mb-6 p-3.5 bg-[#faf7f2] rounded-xl border border-amber-200/50">
                        <span class="text-3xl font-bold text-gray-900">₹${saree.price.toLocaleString('en-IN')}</span>
                        <span class="text-base text-gray-400 line-through">₹${saree.originalPrice.toLocaleString('en-IN')}</span>
                        <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded">
                            Save ₹${(saree.originalPrice - saree.price).toLocaleString('en-IN')} (${discountPercent}%)
                        </span>
                    </div>

                    <!-- Description -->
                    <p class="text-sm text-gray-600 mb-6 leading-relaxed">
                        ${saree.description}
                    </p>

                    <!-- Technical Specifications Table -->
                    <div class="border border-gray-200 rounded-xl overflow-hidden mb-6 text-xs divide-y divide-gray-100 bg-white">
                        <div class="grid grid-cols-3 p-2.5 bg-gray-50 font-semibold text-gray-700">
                            <span class="col-span-1 text-gray-500">Fabric</span>
                            <span class="col-span-2 text-gray-900">${saree.fabric}</span>
                        </div>
                        <div class="grid grid-cols-3 p-2.5">
                            <span class="col-span-1 text-gray-500 font-semibold">Zari Specification</span>
                            <span class="col-span-2 text-gray-900 font-medium">${saree.zari}</span>
                        </div>
                        <div class="grid grid-cols-3 p-2.5 bg-gray-50">
                            <span class="col-span-1 text-gray-500 font-semibold">Color / Shade</span>
                            <span class="col-span-2 text-gray-900 font-medium">${saree.color}</span>
                        </div>
                        <div class="grid grid-cols-3 p-2.5">
                            <span class="col-span-1 text-gray-500 font-semibold">Weaving Style</span>
                            <span class="col-span-2 text-gray-900 font-medium">${saree.weave}</span>
                        </div>
                        <div class="grid grid-cols-3 p-2.5 bg-gray-50">
                            <span class="col-span-1 text-gray-500 font-semibold">Blouse Piece</span>
                            <span class="col-span-2 text-gray-900 font-medium">${saree.blouse}</span>
                        </div>
                    </div>
                </div>

                <!-- Action CTA -->
                <div class="space-y-3 pt-4 border-t border-gray-200">
                    <div class="grid grid-cols-1 ${ENABLE_BAG ? 'sm:grid-cols-2' : ''} gap-3">
                        <button 
                            onclick="orderViaWhatsApp('${saree.id}')"
                            class="btn-whatsapp py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                        >
                            <i class="fa-brands fa-whatsapp text-lg"></i>
                            <span>Order via WhatsApp</span>
                        </button>

                        ${ENABLE_BAG ? `<button
                            onclick="addToBag('${saree.id}'); closeQuickView();"
                            class="btn-gold py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                        >
                            <i class="fa-solid fa-bag-shopping"></i>
                            <span>Add to Inquiry Bag</span>
                        </button>` : ''}
                    </div>

                    <button 
                        onclick="bookVideoShoppingForSaree('${saree.id}')"
                        class="w-full py-2.5 rounded-xl border border-gray-300 hover:border-amber-600 text-gray-700 hover:text-amber-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-white"
                    >
                        <i class="fa-solid fa-video text-amber-700"></i>
                        <span>See this Saree live on a WhatsApp Video Call</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quickview-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
}

/**
 * Video Call Shopping Booking Logic
 */
function openVideoCallModal() {
    const modal = document.getElementById('videocall-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoCallModal() {
    const modal = document.getElementById('videocall-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function bookVideoShoppingForSaree(sareeId) {
    closeQuickView();
    openVideoCallModal();
    const notesEl = document.getElementById('vc-occasion');
    if (notesEl) {
        notesEl.value = `Interested in viewing #${sareeId} live.`;
    }
}

function submitVideoShoppingBooking(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('vc-name')?.value.trim() || 'Bride/Customer';
    const phone = document.getElementById('vc-phone')?.value.trim() || '';
    const date = document.getElementById('vc-date')?.value || 'Earliest available slot';
    const time = document.getElementById('vc-time')?.value || 'Morning slot';
    const occasion = document.getElementById('vc-occasion')?.value.trim() || 'Bridal/Festive Silk Sarees';

    const message = `*R B SILKS - Live Video Shopping Appointment Request* 📹👑

Hello Team,
I would like to schedule a 1-on-1 personalized Video Call with your master silk draper:

👤 *Name:* ${name}
📱 *Phone:* ${phone}
📅 *Preferred Date:* ${date}
⏰ *Preferred Time:* ${time}
✨ *Occasion / Sarees of Interest:* ${occasion}

Please confirm my appointment slot. Thank you!`;

    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    closeVideoCallModal();
    showToast('Video Call request prepared on WhatsApp!', 'success');
}

/**
 * Render Testimonials & FAQs
 */
function renderTestimonials() {
    const container = document.getElementById('testimonials-grid');
    if (!container) return;

    container.innerHTML = TESTIMONIALS.map(t => `
        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-amber-100 flex flex-col justify-between relative group hover:shadow-md transition-shadow">
            <div class="absolute top-6 right-6 text-amber-200 text-4xl font-serif">“</div>
            <div>
                <!-- Stars -->
                <div class="flex text-amber-500 text-sm mb-4">
                    ${Array(t.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
                </div>
                <p class="text-gray-700 text-sm md:text-base italic leading-relaxed mb-6">
                    "${t.review}"
                </p>
            </div>
            <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div>
                    <h4 class="font-bold text-gray-900 text-sm">${t.name}</h4>
                    <p class="text-xs text-gray-500">${t.location} • <span class="text-amber-800 font-medium">${t.occasion}</span></p>
                </div>
            </div>
        </div>
    `).join('');
}

function renderFAQs() {
    const container = document.getElementById('faq-accordion');
    if (!container) return;

    container.innerHTML = FAQS.map((faq, index) => `
        <div class="border border-amber-200/60 rounded-xl overflow-hidden bg-white">
            <button 
                type="button" 
                onclick="toggleFAQ(${index})"
                class="w-full text-left p-4 md:p-5 font-serif-sub font-bold text-gray-900 flex justify-between items-center hover:bg-amber-50/50 transition-colors"
            >
                <span class="text-sm md:text-base">${faq.q}</span>
                <i id="faq-icon-${index}" class="fa-solid fa-chevron-down text-amber-800 text-xs transition-transform duration-300"></i>
            </button>
            <div id="faq-ans-${index}" class="hidden p-4 md:p-5 pt-0 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-[#faf7f2]/40">
                ${faq.a}
            </div>
        </div>
    `).join('');
}

function toggleFAQ(index) {
    const ans = document.getElementById(`faq-ans-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    if (!ans) return;

    if (ans.classList.contains('hidden')) {
        ans.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
        ans.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
    }
}

/**
 * Toast Notification Utility
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    const isError = type === 'error';

    toast.className = `toast-msg px-4 py-3 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2.5 text-white ${
        isSuccess ? 'bg-[#1b5e20]' : isError ? 'bg-[#b71c1c]' : 'bg-[#3e0410]'
    }`;

    toast.innerHTML = `
        <i class="fa-solid ${isSuccess ? 'fa-circle-check text-green-300' : isError ? 'fa-circle-exclamation text-red-300' : 'fa-info-circle text-amber-300'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

/**
 * Global Event Listeners & Mobile Menu
 */
function setupEventListeners() {
    // Mobile navigation toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close modals on Esc key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeQuickView();
            closeVideoCallModal();
            toggleCartDrawer(false);
        }
    });

    // Close quickview on backdrop click
    const qvModal = document.getElementById('quickview-modal');
    if (qvModal) {
        qvModal.addEventListener('click', (e) => {
            if (e.target === qvModal) closeQuickView();
        });
    }

    const vcModal = document.getElementById('videocall-modal');
    if (vcModal) {
        vcModal.addEventListener('click', (e) => {
            if (e.target === vcModal) closeVideoCallModal();
        });
    }
}
