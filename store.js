// ⚠️ تأكد إن الاسم هذا نفسه في كل الملفات!
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
      price: Number(price), // ✅ نخزن السعر كرقم من البداية
      img, 
      size,
      color,
      qty: 1,
      category,
      type,
      season
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
  const total = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  countEl.textContent = total;
}

// حساب المجموع الكلي — ✅ نحول لأرقام عشان ما يطلع NaN
export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    return sum + (price * qty);
  }, 0);
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

// تحويل بيانات السلة لنص منظم للإيميل
export function formatCartItemsForEmail(cart) {
  if (!cart || cart.length === 0) return 'لا توجد منتجات';
  
  return cart.map((item, index) => {
    const itemNumber = index + 1;
    const size = item.size || 'غير محدد';
    const color = item.color || 'غير محدد';
    const quantity = Number(item.qty) || 1;
    const price = Number(item.price) || 0;
    const totalPrice = price * quantity;
    const category = item.category || '';
    const type = item.type || '';
    const season = item.season || '';
    const classification = [category, type, season].filter(Boolean).join(' - ');
    
    return `المنتج رقم ${itemNumber}:
اسم المنتج: ${item.name || 'غير مسمى'}
${classification ? `التصنيف: ${classification}` : ''}
اللون: ${color}
المقاس: ${size}
الكمية: ${quantity}
السعر: ${totalPrice} درهم`;
  }).join('\n\n---\n\n');
}
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>إتمام الطلب - VAREN</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
    * { font-family: 'Cairo', sans-serif; }
    .toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); color: white; padding: 12px 24px; border-radius: 8px; z-index: 2000; display: none; }
    .toast.show { display: block; }
    .toast.success { background: #22c55e; }
    .toast.error { background: #ef4444; }
  </style>
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
    import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
    import firebaseConfig from './firebase-config.js';
    import * as Store from './store.js';

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    window.app = { auth, db, onAuthStateChanged, collection, addDoc, serverTimestamp };
    window.Store = Store;
  </script>
</head>
<body class="bg-gray-50 text-gray-800">

<nav class="bg-white shadow-md sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
    <a href="index.html" class="text-2xl font-bold text-gray-900">VAREN</a>
    <div class="hidden md:flex gap-8">
      <a href="index.html" class="font-medium hover:text-gray-600">الرئيسية</a>
    </div>
    <div class="flex items-center gap-4">
      <a href="cart.html" class="text-xl relative">
        <i class="fa-solid fa-cart-shopping"></i>
        <span id="cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
      </a>
    </div>
  </div>
</nav>

<main class="max-w-2xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-8 text-center">إتمام الطلب</h1>
  <form id="checkout-form" class="bg-white p-6 rounded-xl shadow-md space-y-4">
    <div>
      <label for="full-name" class="block font-semibold mb-1">الاسم الكامل *</label>
      <input type="text" id="full-name" class="w-full border rounded-lg p-3" required>
    </div>
    <div>
      <label for="email" class="block font-semibold mb-1">البريد الإلكتروني *</label>
      <input type="email" id="email" class="w-full border rounded-lg p-3" required>
    </div>
    <div>
      <label for="phone" class="block font-semibold mb-1">رقم الهاتف *</label>
      <input type="tel" id="phone" class="w-full border rounded-lg p-3" required>
    </div>
    <div>
      <label for="address" class="block font-semibold mb-1">العنوان بالكامل *</label>
      <textarea id="address" class="w-full border rounded-lg p-3" rows="3" required></textarea>
    </div>
    <div>
      <label for="notes" class="block font-semibold mb-1">ملاحظات (اختياري)</label>
      <textarea id="notes" class="w-full border rounded-lg p-3" rows="2"></textarea>
    </div>
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="font-bold text-lg mb-2">ملخص الطلب</h3>
      <div id="cart-items-summary" class="mb-2 text-sm space-y-1"></div>
      <p class="text-xl font-bold pt-2 border-t">المجموع: <span id="total-amount">0</span> درهم</p>
    </div>
    <button type="submit" id="submit-btn" class="w-full bg-black text-white py-3 rounded-lg text-lg hover:bg-gray-800">تأكيد الطلب</button>
  </form>
</main>

<footer class="bg-gray-900 text-white py-8 text-center">
  <p>&copy; 2026 VAREN. جميع الحقوق محفوظة.</p>
</footer>

<div id="toast" class="toast"></div>

<!-- EmailJS Library -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

<script>
  // تهيئة EmailJS
  (function(){
    emailjs.init("3A0NspFA3vlSd64jc");
  })();

  // عرض رسائل للمستخدم
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // تحويل محتوى السلة إلى نص
  function formatCartItems(cart) {
    if (!cart || cart.length === 0) return 'لا توجد منتجات';
    return cart.map(item => 
      `${item.name} × ${item.quantity} — ${item.price * item.quantity} درهم`
    ).join('\n');
  }

  // عرض ملخص السلة في الصفحة
  function renderCartSummary(cart) {
    const container = document.getElementById('cart-items-summary');
    if (!cart || cart.length === 0) {
      container.innerHTML = '<p class="text-gray-500">السلة فارغة</p>';
      return;
    }
    container.innerHTML = cart.map(item => `
      <div class="flex justify-between">
        <span>${item.name} × ${item.quantity}</span>
        <span>${item.price * item.quantity} درهم</span>
      </div>
    `).join('');
  }

  // إرسال إيميل الإشعار
  async function sendOrderEmail(orderData) {
    const serviceID = "service_3bs6onj";
    const templateID = "template_om7zrjs";

    const templateParams = {
      to_email: "y0892100@gmail.com",
      customer_name: orderData.userName,
      customer_email: orderData.userEmail,
      customer_phone: orderData.phone,
      customer_address: orderData.address,
      order_items: orderData.itemsText,
      order_total: orderData.total,
      order_date: new Date().toLocaleString('ar-AE'),
      order_id: orderData.orderId
    };

    console.log("📧 بيانات الإيميل المرسلة:", templateParams);

    try {
      const response = await emailjs.send("service_3bs6onj","template_om7zrjs");
      console.log("✅ تم إرسال الإيميل بنجاح!", response.status, response.text);
      return true;
    } catch (error) {
      console.error("❌ فشل إرسال الإيميل:", error);
      return false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ الصفحة محملة تماماً");
    if (window.Store && window.Store.updateCartCount) {
      window.Store.updateCartCount();
    }
    const cart = window.Store && window.Store.getCart ? window.Store.getCart() : [];
    const total = window.Store && window.Store.getCartTotal ? window.Store.getCartTotal() : '0';
    document.getElementById('total-amount').textContent = total;
    renderCartSummary(cart);

    document.getElementById('checkout-form').addEventListener('submit', async e => {
      e.preventDefault();
      console.log("📝 تم الضغط على زر الإرسال");

      const submitBtn = document.getElementById('submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'جاري المعالجة...';

      const cart = window.Store && window.Store.getCart ? window.Store.getCart() : [];
      if (cart.length === 0) {
        showToast('السلة فارغة!', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'تأكيد الطلب';
        return;
      }

      const user = window.app && window.app.auth ? window.app.auth.currentUser : null;
      if (!user) {
        showToast('سجّل دخول أولاً لإتمام الطلب', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'تأكيد الطلب';
        window.location.href = 'login.html';
        return;
      }

      const userName = document.getElementById('full-name').value.trim();
      const userEmail = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const address = document.getElementById('address').value.trim();
      const notes = document.getElementById('notes').value.trim();

      if (!userName || !userEmail || !phone || !address) {
        showToast('املأ جميع الحقول المطلوبة', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'تأكيد الطلب';
        return;
      }

      const itemsText = formatCartItems(cart);
      const orderData = {
        userId: user.uid,
        userName,
        userEmail,
        phone,
        address,
        notes,
        items: cart,
        itemsText,
        total,
        status: 'جديد',
        createdAt: window.app.serverTimestamp()
      };

      try {
        console.log("💾 جاري حفظ الطلب في قاعدة البيانات...");
        const orderRef = await window.app.addDoc(
          window.app.collection(window.app.db, 'orders'),
          orderData
        );
        orderData.orderId = orderRef.id;
        console.log("✅ الطلب محفوظ، رقم الطلب:", orderRef.id);

        console.log("📧 جاري إرسال الإيميل...");
        const emailSent = await sendOrderEmail(orderData);
        console.log("📧 نتيجة الإرسال:", emailSent ? "تم ✅" : "فشل ❌");

        if (window.Store && window.Store.clearCart) {
          window.Store.clearCart();
        }
        showToast('✅ تم استلام طلبك بنجاح! سنتواصل معك قريباً');
        setTimeout(() => window.location.href = 'index.html', 2000);
      } catch (err) {
        console.error("❌ خطأ في إتمام الطلب:", err);
        showToast('حدث خطأ: ' + err.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'تأكيد الطلب';
      }
    });
  });
</script>

</body>
</html>
