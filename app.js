// Global State
window.currentFilteredProducts = [...products];

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCountdown();
  initScrollProgress();
  initBackToTop();
  
  // Render Initial Products
  renderProducts(products);
  
  // Setup Event Listeners
  setupFilters();
  setupSearch();
  
  // Initial UI sync
  updateCartUI();
  updateWishlistUI();
});

// Theme Management
const initTheme = () => {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('elegance_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if(themeToggle) {
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('elegance_theme', newTheme);
      themeToggle.innerHTML = newTheme === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
    });
  }
};

// Countdown Timer
const initCountdown = () => {
  const timerEls = {
    h: document.getElementById('timer-h'),
    m: document.getElementById('timer-m'),
    s: document.getElementById('timer-s')
  };
  
  if(!timerEls.h) return;

  // Set drop date 5 hours from now
  let dropDate = new Date().getTime() + (5 * 60 * 60 * 1000);
  
  const updateTimer = setInterval(() => {
    const now = new Date().getTime();
    const distance = dropDate - now;
    
    if (distance < 0) {
      clearInterval(updateTimer);
      document.getElementById('countdown-container').innerHTML = '<div class="alert alert-danger mb-0"><strong>Drop Ended!</strong> All exclusive items are now closed.</div>';
      return;
    }
    
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    
    timerEls.h.innerText = h.toString().padStart(2, '0');
    timerEls.m.innerText = m.toString().padStart(2, '0');
    timerEls.s.innerText = s.toString().padStart(2, '0');
  }, 1000);
};

// Scroll Progress & Back to Top
const initScrollProgress = () => {
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    if(!progressBar) return;
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  });
};

const initBackToTop = () => {
  const btn = document.getElementById('backToTop');
  if(!btn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

// Toast Notifications
window.showToast = (message, type = 'primary') => {
  const toastContainer = document.getElementById('toastContainer');
  if(!toastContainer) return;
  
  const toastId = 'toast-' + Date.now();
  const icon = type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle';
  
  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi bi-${icon} fs-5"></i>
          <span>${message}</span>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  
  toastContainer.insertAdjacentHTML('beforeend', toastHTML);
  const toastEl = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
  
  toastEl.addEventListener('hidden.bs.toast', () => {
    toastEl.remove();
  });
};

// UI Rendering - Products Grid
window.renderProducts = (productsToRender) => {
  const grid = document.getElementById('productsGrid');
  const emptyState = document.getElementById('emptyState');
  
  if(!grid) return;
  
  if (productsToRender.length === 0) {
    grid.style.display = 'none';
    if(emptyState) emptyState.style.display = 'block';
    return;
  }
  
  grid.style.display = 'flex';
  if(emptyState) emptyState.style.display = 'none';
  
  grid.innerHTML = '';
  
  productsToRender.forEach(product => {
    const reservedStock = window.cartState ? window.cartState.getReservedStock(product.id) : 0;
    const availableStock = product.stock - reservedStock;
    const isSoldOut = availableStock <= 0;
    const inWishlist = window.cartState && window.cartState.wishlist.includes(product.id);
    
    // Badges HTML
    let badgesHTML = '';
    if (isSoldOut) {
      badgesHTML += `<span class="badge-custom badge-soldout">Sold Out</span>`;
    } else {
      if (availableStock <= 5) badgesHTML += `<span class="badge-custom badge-stock">Only ${availableStock} Left</span>`;
      if (product.discount > 0) badgesHTML += `<span class="badge-custom badge-discount">-${product.discount}%</span>`;
      if (product.isTrending) badgesHTML += `<span class="badge-custom badge-new">Trending</span>`;
    }
    
    const stars = Array(5).fill(0).map((_, i) => 
      `<i class="bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''}"></i>`
    ).join('');

    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4 mb-4';
    col.innerHTML = `
      <div class="product-card">
        <div class="product-img-wrapper" onclick="openProductModal(${product.id})">
          <div class="product-badges">${badgesHTML}</div>
          <button class="wishlist-btn-card ${inWishlist ? 'active' : ''}" onclick="event.stopPropagation(); window.cartState.toggleWishlist(${product.id})">
            <i class="bi bi-heart${inWishlist ? '-fill' : ''}"></i>
          </button>
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-title" onclick="openProductModal(${product.id})">${product.name}</h3>
          <div class="product-rating">${stars} <span class="text-muted ms-1 small">(${product.rating})</span></div>
          <div class="product-price-row">
            <span class="price">$${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
          </div>
          <button class="btn-add-cart" onclick="openProductModal(${product.id})" ${isSoldOut ? 'disabled' : ''}>
            ${isSoldOut ? '<i class="bi bi-x-circle"></i> Sold Out' : '<i class="bi bi-cart-plus"></i> Select Options'}
          </button>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
};

// UI Rendering - Cart Updates
window.updateCartUI = () => {
  if(!window.cartState) return;
  
  const cart = window.cartState.cart;
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  cartCountBadges.forEach(b => b.innerText = totalItems);
  
  const cartItemsContainer = document.getElementById('cartItemsList');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartFooter = document.getElementById('cartFooter');
  
  if(!cartItemsContainer) return;
  
  if (cart.length === 0) {
    cartItemsContainer.style.display = 'none';
    cartEmptyState.style.display = 'block';
    cartFooter.style.display = 'none';
    return;
  }
  
  cartItemsContainer.style.display = 'block';
  cartEmptyState.style.display = 'none';
  cartFooter.style.display = 'block';
  
  cartItemsContainer.innerHTML = '';
  
  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="d-flex justify-content-between">
          <h4 class="cart-item-title">${item.name}</h4>
          <button class="cart-remove" onclick="window.cartState.removeFromCart(${item.id}, '${item.variant}')"><i class="bi bi-trash3"></i></button>
        </div>
        <div class="cart-item-variant">Variant: ${item.variant}</div>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <div class="qty-control">
            <button class="qty-btn" onclick="window.cartState.updateQuantity(${item.id}, '${item.variant}', -1)">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="window.cartState.updateQuantity(${item.id}, '${item.variant}', 1)">+</button>
          </div>
          <div class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });
  
  // Totals
  const { subtotal, tax, total } = window.cartState.getCartTotals();
  document.getElementById('cartSubtotal').innerText = `$${subtotal.toFixed(2)}`;
  document.getElementById('cartTax').innerText = `$${tax.toFixed(2)}`;
  document.getElementById('cartTotal').innerText = `$${total.toFixed(2)}`;
  
  // Shipping Progress (Free shipping over $200)
  const shippingThreshold = 200;
  const shippingProgress = document.getElementById('shippingProgress');
  const shippingMsg = document.getElementById('shippingMsg');
  
  if (subtotal >= shippingThreshold) {
    shippingProgress.style.width = '100%';
    shippingProgress.classList.add('bg-success');
    shippingMsg.innerHTML = '<strong>Congratulations!</strong> You get free premium shipping.';
  } else {
    const percentage = (subtotal / shippingThreshold) * 100;
    shippingProgress.style.width = `${percentage}%`;
    shippingProgress.classList.remove('bg-success');
    shippingMsg.innerHTML = `Spend <strong>$${(shippingThreshold - subtotal).toFixed(2)}</strong> more for free shipping!`;
  }
};

window.updateWishlistUI = () => {
  if(!window.cartState) return;
  const wishlistCountBadges = document.querySelectorAll('.wishlist-count-badge');
  wishlistCountBadges.forEach(b => b.innerText = window.cartState.wishlist.length);
};

window.updateStockUI = () => {
  window.renderProducts(window.currentFilteredProducts);
  updateCartUI();
};

// Modal Logic
window.openProductModal = (productId) => {
  const product = products.find(p => p.id === productId);
  if(!product) return;
  
  const modalEl = document.getElementById('productModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalDesc = document.getElementById('modalDesc');
  const modalVariants = document.getElementById('modalVariants');
  const modalStock = document.getElementById('modalStock');
  const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
  
  modalImage.src = product.image;
  modalTitle.innerText = product.name;
  
  modalPrice.innerHTML = `<span class="fw-bold fs-4">$${product.price.toFixed(2)}</span> ${product.oldPrice ? `<span class="text-muted text-decoration-line-through ms-2">$${product.oldPrice.toFixed(2)}</span>` : ''}`;
  
  modalDesc.innerText = product.description;
  
  // Variant Selection
  let selectedVariant = product.variants[0];
  modalVariants.innerHTML = '';
  product.variants.forEach(variant => {
    const btn = document.createElement('button');
    btn.className = `variant-btn ${variant === selectedVariant ? 'active' : ''}`;
    btn.innerText = variant;
    btn.onclick = () => {
      document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedVariant = variant;
    };
    modalVariants.appendChild(btn);
  });
  
  // Stock display
  const updateModalStock = () => {
    const reservedStock = window.cartState ? window.cartState.getReservedStock(product.id) : 0;
    const availableStock = product.stock - reservedStock;
    
    if (availableStock <= 0) {
      modalStock.innerHTML = `<span class="text-danger fw-bold"><i class="bi bi-x-circle"></i> Sold Out</span>`;
      modalAddToCartBtn.disabled = true;
      modalAddToCartBtn.innerHTML = 'Sold Out';
    } else {
      modalStock.innerHTML = `<span class="${availableStock <= 5 ? 'text-accent' : 'text-success'} fw-bold"><i class="bi bi-check-circle"></i> ${availableStock} in stock</span>`;
      modalAddToCartBtn.disabled = false;
      modalAddToCartBtn.innerHTML = 'Add to Cart';
    }
  };
  
  updateModalStock();
  
  // Setup Add To Cart handler
  modalAddToCartBtn.onclick = () => {
    if(window.cartState) {
      window.cartState.addToCart(product.id, selectedVariant);
      updateModalStock(); // refresh stock dynamically
    }
  };
  
  const modalInstance = new bootstrap.Modal(modalEl);
  modalInstance.show();
};

// Filtering & Search
const setupFilters = () => {
  const categoryBtns = document.querySelectorAll('.category-chip');
  const sortSelect = document.getElementById('sortSelect');
  
  let currentCategory = 'All';
  let currentSort = 'newest';
  
  const applyFilters = () => {
    let filtered = [...products];
    
    if (currentCategory !== 'All') {
      filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    const searchVal = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (searchVal) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchVal) || p.description.toLowerCase().includes(searchVal));
    }
    
    if (currentSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    window.currentFilteredProducts = filtered;
    window.renderProducts(filtered);
  };
  
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.getAttribute('data-category');
      applyFilters();

      // Auto collapse navbar on mobile after selection
      const navbarContent = document.getElementById('navbarContent');
      if (navbarContent && navbarContent.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarContent) || new bootstrap.Collapse(navbarContent);
        bsCollapse.hide();
      }
    });
  });
  
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFilters();
    });
  }
  
  window.applyGlobalFilters = applyFilters;
};

const setupSearch = () => {
  const searchInput = document.getElementById('searchInput');
  if(searchInput) {
    searchInput.addEventListener('input', () => {
      if(window.applyGlobalFilters) window.applyGlobalFilters();
    });
  }
};
