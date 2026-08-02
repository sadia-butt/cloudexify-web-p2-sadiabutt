// Initial State from LocalStorage or default
let cart = JSON.parse(localStorage.getItem('elegance_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('elegance_wishlist')) || [];

const saveCart = () => {
  localStorage.setItem('elegance_cart', JSON.stringify(cart));
  updateCartUI();
};

const saveWishlist = () => {
  localStorage.setItem('elegance_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
};

const toggleWishlist = (productId) => {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    if(window.showToast) showToast('Removed from Wishlist', 'danger');
  } else {
    wishlist.push(productId);
    if(window.showToast) showToast('Saved to Wishlist', 'success');
  }
  saveWishlist();
  
  // Re-render UI to update heart icons if renderProducts exists
  if(window.renderProducts && window.currentFilteredProducts) {
    window.renderProducts(window.currentFilteredProducts);
  }
};

const addToCart = (productId, variant) => {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId && item.variant === variant);
  
  // Check total requested against stock
  const currentQty = existingItem ? existingItem.quantity : 0;
  if (currentQty >= product.stock) {
    if(window.showToast) showToast('Maximum stock reached!', 'danger');
    return;
  }

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: variant || product.variants[0],
      quantity: 1,
      maxStock: product.stock
    });
  }
  
  saveCart();
  if(window.showToast) showToast('Added to Cart', 'success');
  
  // Update stock UI
  if(window.updateStockUI) window.updateStockUI();
};

const updateQuantity = (productId, variant, change) => {
  const itemIndex = cart.findIndex(item => item.id === productId && item.variant === variant);
  if (itemIndex === -1) return;

  const item = cart[itemIndex];
  const newQty = item.quantity + change;

  if (newQty > 0 && newQty <= item.maxStock) {
    item.quantity = newQty;
  } else if (newQty === 0) {
    cart.splice(itemIndex, 1);
  } else if (newQty > item.maxStock) {
    if(window.showToast) showToast('Not enough stock available.', 'danger');
    return;
  }
  
  saveCart();
  if(window.updateStockUI) window.updateStockUI();
};

const removeFromCart = (productId, variant) => {
  cart = cart.filter(item => !(item.id === productId && item.variant === variant));
  saveCart();
  if(window.showToast) showToast('Removed from Cart', 'danger');
  if(window.updateStockUI) window.updateStockUI();
};

const clearCart = () => {
  cart = [];
  saveCart();
  if(window.showToast) showToast('Cart Emptied', 'secondary');
  if(window.updateStockUI) window.updateStockUI();
};

const getCartTotals = () => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

const checkout = () => {
  if (cart.length === 0) return;
  // Simulate successful checkout
  cart = [];
  saveCart();
  if(window.showToast) showToast('Order Confirmed! Payment verified via Easypaisa/JazzCash.', 'success');
  if(window.updateStockUI) window.updateStockUI();
  
  // Close offcanvas if open
  const offcanvasEl = document.getElementById('cartDrawer');
  if (offcanvasEl) {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) bsOffcanvas.hide();
  }
};

const getReservedStock = (productId) => {
  return cart.filter(item => item.id === productId)
             .reduce((sum, item) => sum + item.quantity, 0);
};

// Expose to window for UI updates
window.cartState = {
  get cart() { return cart; },
  get wishlist() { return wishlist; },
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartTotals,
  checkout,
  toggleWishlist,
  getReservedStock
};
