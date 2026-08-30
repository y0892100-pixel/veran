const CART_KEY = 'varen_cart_v1';

// جلب السلة
export function getCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

// حفظ السلة
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

// إضافة للسلة
export function addToCart(id, name, price, img, size, color, category = '', type = '', season = '') {
  const cart = getCart();
  const existing = cart.find(item => 
    item.id === id && item.size === size && item.color === color
  );
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ 
      id, 
      name, 
      price, 
      img, 
      size,        // المقاس
      color,       // اللون
      qty: 1,      // الكمية
      category,    // تصنيف إضافي (رجالي/نسائي)
      type,        // النوع (هودي/تيشيرت...)
      season       // الموسم (صيفي/شتوي)
    });
  }
  saveCart(cart);
  showToast('أضيف للسلة ✅');
}

// تحديث العدد في الأيقونة
export function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = total;
}

// حساب المجموع الكلي
export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// حذف عنصر من السلة
export function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

// تفريغ السلة
export function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

// عرض رسالة تنبيه
export function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.style.background = type === 'error' ? '#ef4444' : '#22c55e';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

// إرجاع لون الخلفية حسب اسم اللون
export function getColorBg(color) {
  const map = {
    'أحمر': '#ef4444', 'أسود': '#000000', 'أبيض': '#ffffff',
    'بيج': '#f5f0dc', 'رمادي': '#9ca3af', 'أزرق': '#3b82f6',
    'أخضر': '#22c55e', 'وردي': '#f472b6', 'بني': '#92400e',
    'برتقالي': '#f97316', 'أصفر': '#eab308', 'بنفسجي': '#a855f7'
  };
  return map[color] || '#ddd';
}

// ✅ دوال مساعدة للتوافق مع checkout.html
// تحويل بيانات السلة لنص منظم للإيميل
export function formatCartItemsForEmail(cart) {
  if (!cart || cart.length === 0) return 'لا توجد منتجات';
  
  return cart.map((item, index) => {
    const itemNumber = index + 1;
    const size = item.size || 'غير محدد';
    const color = item.color || 'غير محدد';
    const quantity = item.qty || 1;
    const totalPrice = (item.price || 0) * quantity;
    const category = item.category || '';
    const type = item.type || '';
    const season = item.season || '';
    const classification = [category, type, season].filter(Boolean).join(' - ');
    
    return `المنتج رقم ${itemNumber}:
اسم المنتج: ${item.name}
${classification ? `التصنيف: ${classification}` : ''}
اللون: ${color}
المقاس: ${size}
الكمية: ${quantity}
السعر: ${totalPrice} درهم`;
  }).join('\n\n---\n\n');
}
