const CART = 'fl_cart_v4';
const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const DEFAULT_COLORS = ['Black', 'White', 'Gray', 'Beige', 'Red', 'Blue', 'Green', 'Pink', 'Brown', 'Purple', 'Yellow', 'Orange'];
const COLOR_HEX = {
    Black: '#111', White: '#fff', Gray: '#9ca3af', Beige: '#d6c2a1', Red: '#ef4444',
    Blue: '#3b82f6', Green: '#22c55e', Pink: '#ec4899', Brown: '#8b5e3c', Purple: '#8b5cf6',
    Yellow: '#facc15', Orange: '#f97316'
};

let productsCache = null;
let productsLoaded = false;

// ✅ أسماء الأقسام الرئيسية
const names = { 
    women: 'النساء', men: 'الرجال', kids: 'الأطفال', boys: 'أولاد', girls: 'بنات',
    perfumes: 'العطور', shoes: 'الأحذية', accessories: 'اكسسوارات'
};

// ✅ تصنيفات الفلتر (المواسم + الأنواع الجديدة)
const seasons = { 
    winter: 'شتوية', summer: 'صيفية', underwear: 'ملابس داخلية', formal: 'رسمية',
    perfumes: 'عطور', shoes: 'أحذية', accessories: 'اكسسوارات'
};

// ✅ أنواع المنتجات الكاملة
const types = { 
    hoodies: 'هوديات', tshirts: 'تيشيرتات', underwear: 'ملابس داخلية', dresses: 'فساتين', shirts: 'قمصان',
    perfume: 'عطر', shoe: 'حذاء', bag: 'حقيبة', watch: 'ساعة', jewelry: 'مجوهرات', sunglasses: 'نظارات شمسية', belt: 'حزام'
};

// ✅ منتجات افتراضية + أمثلة جديدة
const defaultProducts = [
    { id: '1', name: 'هودي نسائي شتوي', gender: 'women', season: 'winter', type: 'hoodies', price: 199, img: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80' },
    { id: '2', name: 'تيشيرت نسائي', gender: 'women', season: 'summer', type: 'tshirts', price: 99, img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80' },
    { id: '3', name: 'ملابس داخلية نسائية', gender: 'women', season: 'underwear', type: 'underwear', price: 79, img: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80' },
    { id: '4', name: 'فستان نسائي صيفي', gender: 'women', season: 'summer', type: 'dresses', price: 249, img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80' },
    { id: '5', name: 'هودي رجالي', gender: 'men', season: 'winter', type: 'hoodies', price: 179, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80' },
    { id: '6', name: 'تيشيرت رجالي', gender: 'men', season: 'summer', type: 'tshirts', price: 89, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80' },
    { id: '7', name: 'ملابس داخلية رجالية', gender: 'men', season: 'underwear', type: 'underwear', price: 69, img: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=900&q=80' },
    { id: '8', name: 'قميص رجالي رسمي', gender: 'men', season: 'formal', type: 'shirts', price: 159, img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80' },
    { id: '9', name: 'هودي أولاد شتوي', gender: 'boys', season: 'winter', type: 'hoodies', price: 129, img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80' },
    { id: '10', name: 'تيشيرت أولاد', gender: 'boys', season: 'summer', type: 'tshirts', price: 69, img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80' },
    { id: '11', name: 'هودي بنات شتوي', gender: 'girls', season: 'winter', type: 'hoodies', price: 129, img: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80' },
    { id: '12', name: 'تيشيرت بنات', gender: 'girls', season: 'summer', type: 'tshirts', price: 69, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80' },
    { id: '13', name: 'عطر نسائي مميز', gender: 'women', season: 'perfumes', type: 'perfume', price: 199, img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80' },
    { id: '14', name: 'حذاء رجالي رسمي', gender: 'men', season: 'shoes', type: 'shoe', price: 299, img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80' },
    { id: '15', name: 'حقيبة نسائية أنيقة', gender: 'women', season: 'accessories', type: 'bag', price: 249, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80' }
];

// --- دوال مساعدة ---
function defaultVariants(p) {
    return DEFAULT_SIZES.flatMap(size => DEFAULT_COLORS.map(color => ({ size, color, stock: 3 })));
}
function normalizeProduct(p) {
    p.price = Number(p.price) || 0;
    p.salePrice = (p.salePrice === null || p.salePrice === undefined || p.salePrice === '') ? null : Number(p.salePrice);
    if (p.salePrice !== null && (!Number.isFinite(p.salePrice) || p.salePrice >= p.price)) p.salePrice = null;
    if (!Array.isArray(p.variants)) p.variants = defaultVariants(p);
    p.variants = p.variants.map(v => ({ size: v.size || 'M', color: v.color || 'أسود', stock: Math.max(0, Number(v.stock) || 0) }));
    return p;
}

// --- Firebase ---
async function initProducts() {
    if (!db) return defaultProducts;
    const snapshot = await db.ref('products').once('value');
    const data = snapshot.val();
    if (!data) {
        const updates = {};
        defaultProducts.forEach(p => { updates[p.id] = p; });
        await db.ref('products').update(updates);
        productsCache = defaultProducts;
        return defaultProducts;
    }
    productsCache = Object.values(data);
    return productsCache;
}
async function P() {
    if (!productsLoaded) {
        productsCache = await initProducts();
        productsLoaded = true;
    }
    return productsCache;
}
async function saveProductsToDB(list) {
    productsCache = list;
    const updates = {};
    list.forEach(p => updates[p.id] = p);
    return db.ref('products').set(updates);
}

// --- السلة ---
function C() { return JSON.parse(localStorage.getItem(CART) || '[]'); }
function saveC(x) { localStorage.setItem(CART, JSON.stringify(x)); }
function money(x) { return Number(x).toFixed(0) + ' د.إ'; }
function finalPrice(p) { return p.salePrice !== null && p.salePrice !== undefined && Number(p.salePrice) < Number(p.price) ? Number(p.salePrice) : Number(p.price); }
function discountPct(p) { let d = Number(p.price) - finalPrice(p); return d > 0 ? Math.round(d / Number(p.price) * 100) : 0; }
function priceHTML(p) { let d = discountPct(p); return d ? `<div class="price"><del>${money(p.price)}</del> <strong>${money(finalPrice(p))}</strong> <span class="saleBadge">-${d}%</span></div>` : `<div class="price"><strong>${money(p.price)}</strong></div>`; }
function labelGender(g) { return names[g] || g; }
function labelSeason(s) { return seasons[s] || s; }
function labelType(t) { return types[t] || t; }

// --- عرض المنتجات ---
function variantStock(p, size, color) {
    let v = (p.variants || []).find(x => x.size === size && x.color === color);
    return v ? Number(v.stock) || 0 : 0;
}
function availableSizes(p, color) {
    return [...new Set((p.variants || []).filter(v => (!color || v.color === color) && v.stock > 0).map(v => v.size))];
}
function availableColors(p, size) {
    return [...new Set((p.variants || []).filter(v => (!size || v.size === size) && v.stock > 0).map(v => v.color))];
}
function card(p) { return `<article class="card"><a href="product.html?id=${p.id}"><div class="pic"><img src="${p.img}" alt="${p.name}" loading="lazy"></div><div class="info"><div class="cat">${labelGender(p.gender)} • ${labelSeason(p.season) || labelType(p.type)}</div><b>${p.name}</b>${priceHTML(p)}</div></a></article>`; }
function grid(a) { return `<div class="grid">${a.map(card).join('')}</div>`; }

// --- الهيدر والقائمة الجانبية ---
function updateBadge() { document.getElementById('badge').textContent = C().reduce((a, x) => a + x.q, 0); }
function header() {
    return `<div class="top">🚚 شحن سريع • ↩️ إرجاع خلال 5 أيام • 🔒 دفع آمن</div>
    <header class="header">
        <button class="icon hamb" onclick="drawer(true)">☰</button>
        <a class="logo" href="index.html" style="display:flex; align-items:center; gap:10px; text-decoration:none; color:black;">
            <img src="varen.jpeg" alt="VAREN" class="site-logo" style="height:50px; width:auto;">
            <span style="font-size:24px; font-weight:bold;">VAREN</span>
        </a>
        <nav class="desktopnav">
            <a href="index.html">الرئيسية</a>
            <a href="category.html?g=women">النساء</a>
            <a href="category.html?g=men">الرجال</a>
            <a href="category.html?g=kids">الأطفال</a>
        </nav>
        <div class="actions">
            <button class="icon" onclick="searchToggle()">⌕</button>
            <a class="icon" href="cart.html">🛒<span class="badge" id="badge">0</span></a>
        </div>
    </header>
    <div class="searchbar" id="search">
        <input id="searchInput" oninput="searchNow()" placeholder="ابحث عن منتج، عطر، حذاء، اكسسوار...">
    </div>
    <div class="overlay" id="overlay" onclick="drawer(false)"></div>
    <aside class="drawer" id="drawer">
        <div class="drawerHead"><b>الأقسام</b><button class="icon" onclick="drawer(false)">×</button></div>
        
        <section><h3>👩 النساء</h3>
             <a class="sub" href="category.html?g=women&s=underwear">ملابس داخلية</a>
            <a class="sub" href="category.html?g=women&s=winter">شتوية</a>
            <a class="sub" href="category.html?g=women&s=summer">صيفية</a>
            <a class="sub" href="category.html?g=women&t=hoodies">هوديات</a>
            <a class="sub" href="category.html?g=women&t=tshirts">تيشيرتات</a>
            <a class="sub" href="category.html?g=women&t=dresses">فساتين</a>
            <a class="sub" href="category.html?g=women&s=shoes">الأحذية</a>
            <a class="sub" href="category.html?g=women&s=perfumes">العطور</a>
            <a class="sub" href="category.html?g=women&s=accessories">اكسسوارات</a>
        </section>

        <section><h3>👨 الرجال</h3>
              <a class="sub" href="category.html?g=men&s=underwear">ملابس داخلية</a>
            <a class="sub" href="category.html?g=men&s=winter">شتوية</a>
            <a class="sub" href="category.html?g=men&s=summer">صيفية</a>
            <a class="sub" href="category.html?g=men&t=hoodies">هوديات</a>
            <a class="sub" href="category.html?g=men&t=tshirts">تيشيرتات</a>
            <a class="sub" href="category.html?g=men&t=shirts">قمصان</a>
            <a class="sub" href="category.html?g=men&s=shoes">الأحذية</a>
            <a class="sub" href="category.html?g=men&s=perfumes">العطور</a>
            <a class="sub" href="category.html?g=men&s=accessories">اكسسوارات</a>
        </section>

        <section><h3>👧 البنات</h3>
              <a class="sub" href="category.html?g=girls&s=underwear">ملابس داخلية</a>
            <a class="sub" href="category.html?g=girls&s=winter">شتوية</a>
            <a class="sub" href="category.html?g=girls&s=summer">صيفية</a>
            <a class="sub" href="category.html?g=girls&t=hoodies">هوديات</a>
            <a class="sub" href="category.html?g=girls&t=tshirts">تيشيرتات</a>
            <a class="sub" href="category.html?g=girls&s=shoes">الأحذية</a>
            <a class="sub" href="category.html?g=girls&s=perfumes">العطور</a>
            <a class="sub" href="category.html?g=girls&s=accessories">اكسسوارات</a>
        </section>

        <section><h3>👦 الأولاد</h3>
            <a class="sub" href="category.html?g=boys&s=underwear">ملابس داخلية</a>
            <a class="sub" href="category.html?g=boys&s=winter">شتوية</a>
            <a class="sub" href="category.html?g=boys&s=summer">صيفية</a>
            <a class="sub" href="category.html?g=boys&t=hoodies">هوديات</a>
            <a class="sub" href="category.html?g=boys&t=tshirts">تيشيرتات</a>
            <a class="sub" href="category.html?g=boys&s=shoes">الأحذية</a>
            <a class="sub" href="category.html?g=boys&s=perfumes">العطور</a>
            <a class="sub" href="category.html?g=boys&s=accessories">اكسسوارات</a>
        </section>
    </aside>`;
}

function footer() { 
    return `<footer class="footer">
        <div class="container">
            <h3>VAREN</h3>
            <p>أزياء • عطور • أحذية • اكسسوارات</p>
            <p>سياسة الإرجاع: يمكن طلب الإرجاع خلال 5 أيام وفق الشروط.</p>
        </div>
    </footer>`; 
}

function shell(c) { document.getElementById('app').innerHTML = header() + c + footer(); updateBadge(); }
function drawer(v) { document.getElementById('drawer').classList.toggle('open', v); document.getElementById('overlay').classList.toggle('show', v); }
function searchToggle() { document.getElementById('search').classList.toggle('show'); if (document.getElementById('search').classList.contains('show')) document.getElementById('searchInput').focus(); }
async function searchNow() {
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    const products = await P();
    const a = products.filter(p => p.name.toLowerCase().includes(q));
    let old = document.getElementById('results');
    if (!old) { const m = document.querySelector('main'); m.insertAdjacentHTML('afterbegin', '<div id="results" class="container page"></div>'); old = document.getElementById('results'); }
    old.innerHTML = q ? `<h2>نتائج البحث</h2>${grid(a)}` : '';
}
function section(id, title, a) { return `<section class="section" id="${id}"><div class="head"><h2>${title}</h2><a href="category.html?g=${id}">عرض الكل ←</a></div>${grid(a)}</section>`; }

// --- الصفحات ---
async function home() {
    const a = await P();
    shell(`<main>
        <section class="hero"><div><h1>VAREN<br>أسلوبك يبدأ هنا</h1><p>نساء • رجال • بنات • أولاد • عطور • أحذية • اكسسوارات</p><button class="btn white" onclick="drawer(true)">تصفح الأقسام</button></div></section>
        <div class="container">
            <div class="benefits">
                <div class="benefit">🚚<b>شحن سريع</b>2-5 أيام</div>
                <div class="benefit">🔒<b>دفع آمن</b>بطاقات إلكترونية</div>
                <div class="benefit">↩️<b>إرجاع</b>خلال 5 أيام</div>
                <div class="benefit">✓<b>جودة</b>منتجات مميزة</div>
            </div>
            ${section('women', 'النساء', a.filter(p => p.gender === 'women').slice(0,4))}
            ${section('men', 'الرجال', a.filter(p => p.gender === 'men').slice(0,4))}
            ${section('perfumes', 'العطور', a.filter(p => p.season === 'perfumes').slice(0,4))}
            ${section('shoes', 'الأحذية', a.filter(p => p.season === 'shoes').slice(0,4))}
            ${section('accessories', 'اكسسوارات', a.filter(p => p.season === 'accessories').slice(0,4))}
        </div>
    </main>`);
}

async function categoryPage() {
    const u = new URLSearchParams(location.search), g = u.get('g') || 'women', s = u.get('s'), t = u.get('t');
    let a = await P();
    a = a.filter(p => (g === 'kids' ? ['girls', 'boys'].includes(p.gender) : p.gender === p.gender && p.gender === g) || p.season === g);
    if (s) a = a.filter(p => p.season === s);
    if (t) a = a.filter(p => p.type === t);
    let title = names[g] || g; if (s) title += ' - ' + seasons[s]; if (t) title += ' - ' + types[t];
    shell(`<main class="container page"><h1>${title}</h1>
        <div class="filters">
            <a class="pill" href="category.html?g=${g}">الكل</a>
            <a class="pill" href="category.html?g=${g}&s=underwear">داخلية</a>
            <a class="pill" href="category.html?g=${g}&s=winter">شتوية</a>
            <a class="pill" href="category.html?g=${g}&s=summer">صيفية</a>
            <a class="pill" href="category.html?g=${g}&s=perfumes">عطور</a>
            <a class="pill" href="category.html?g=${g}&s=shoes">أحذية</a>
            <a class="pill" href="category.html?g=${g}&s=accessories">اكسسوارات</a>
            <a class="pill" href="category.html?g=${g}&t=hoodies">هوديات</a>
            <a class="pill" href="category.html?g=${g}&t=tshirts">تيشيرتات</a>
        </div>${grid(a)}</main>`);
}

async function productPage() {
    const products = await P();
    const p = products.find(x => x.id === new URLSearchParams(location.search).get('id'));
    if (!p) { shell('<main class="container empty">المنتج غير موجود</main>'); return; }
    const colors = availableColors(p), sizes = availableSizes(p);
    const firstColor = colors[0] || 'أسود', firstSize = availableSizes(p, firstColor)[0] || sizes[0] || 'M';
    const opts = `<div class="variantbox">
        <label>اللون</label><div class="variant-options" id="colorOpts">${colors.map(c => `<button type="button" title="${c}" class="colorVariant ${c === firstColor ? 'selected' : ''}" data-color="${c}" onclick="chooseColor(this)"><i style="background:${COLOR_HEX[c] || '#999'}"></i><span>${c}</span></button>`).join('')}</div>
        <label>المقاس</label><div class="variant-options" id="sizeOpts">${availableSizes(p, firstColor).map(x => `<button type="button" class="variant ${x === firstSize ? 'selected' : ''}" data-size="${x}" onclick="chooseSize(this)">${x}</button>`).join('')}</div>
        <div id="stockMsg" class="stockmsg"></div>
    </div>`;
    shell(`<main class="container page"><div class="product"><div class="bigpic"><img src="${p.img}" alt="${p.name}"></div><div><div class="cat">${labelGender(p.gender)} • ${labelSeason(p.season) || labelType(p.type)}</div><h1>${p.name}</h1>${priceHTML(p)}<p class="desc">اختر اللون والمقاس قبل الإضافة إلى السلة.</p>${opts}<button id="addBtn" class="btn" onclick="addVariant('${p.id}')">أضف إلى السلة</button></div></div></main>`);
    window.currentProduct = p; window.selectedColor = firstColor; window.selectedSize = firstSize; updateVariantUI();
}
function chooseColor(el) {
    window.selectedColor = el.dataset.color;
    const sizes = availableSizes(window.currentProduct, window.selectedColor);
    window.selectedSize = sizes[0] || null;
    document.querySelectorAll('#colorOpts .colorVariant').forEach(x => x.classList.toggle('selected', x === el));
    document.getElementById('sizeOpts').innerHTML = sizes.map(x => `<button type="button" class="variant ${x === window.selectedSize ? 'selected' : ''}" data-size="${x}" onclick="chooseSize(this)">${x}</button>`).join('');
    updateVariantUI();
}
function chooseSize(el) { window.selectedSize = el.dataset.size; document.querySelectorAll('#sizeOpts .variant').forEach(x => x.classList.toggle('selected', x === el)); updateVariantUI(); }
function updateVariantUI() {
    const n = variantStock(window.currentProduct, window.selectedSize, window.selectedColor);
    const m = document.getElementById('stockMsg'), b = document.getElementById('addBtn');
    if (!n) { m.textContent = 'غير متوفر لهذا الاختيار'; m.className = 'stockmsg out'; b.disabled = true; }
    else { m.textContent = 'متوفر — الكمية: ' + n; m.className = 'stockmsg in'; b.disabled = false; }
}
async function addVariant(id) {
    const products = await P();
    const p = products.find(x => x.id === id);
    const size = window.selectedSize, color = window.selectedColor;
    if (!p || !size || !color || variantStock(p, size, color) < 1) { alert('هذا المنتج غير متوفر حالياً'); return; }
    const c = C(); const x = c.find(a => a.id === id && a.size === size && a.color === color);
    if (x) { if (x.q >= variantStock(p, size, color)) { alert('لا توجد كمية إضافية متاحة'); return; } x.q++; }
    else c.push({ id, q: 1, size, color });
    saveC(c); updateBadge(); alert('تمت الإضافة إلى السلة ✅');
}

async function cartPage() {
    const c = C(), a = await P();
    const rows = c.map((x, i) => { const p = a.find(y => y.id === x.id); return p ? `<div class="cartrow"><img src="${p.img}"><div><b>${p.name}</b><div>اللون: ${x.color || '—'} • المقاس: ${x.size || '—'}</div><div>${money(finalPrice(p))} × ${x.q}</div></div><b>${money(finalPrice(p) * x.q)}</b><button class="danger" onclick="removeCart(${i})">حذف</button></div>` : ''; }).join('');
    const total = c.reduce((sum, x) => { const p = a.find(y => y.id === x.id); return sum + (p ? finalPrice(p) * x.q : 0); }, 0);
    shell('<main class="container page"><h1>سلة المشتريات</h1>' + (rows || '<div class="empty">السلة فارغة، ابدأ بالتسوق!</div>') + (total ? `<div class="total">المجموع: ${money(total)}<br><a class="btn" href="checkout.html">إتمام الطلب</a></div>` : '') + '</main>');
}
function removeCart(index) { const c = C(); c.splice(index, 1); saveC(c); cartPage(); }
function checkoutPage() { if (!C().length) { location.href = 'cart.html'; return; } shell(`<main class="container page"><h1>إتمام الطلب</h1><div class="notice">الدفع الإلكتروني قيد التفعيل حالياً.</div><form class="form"><input placeholder="الاسم الكامل" required><input type="tel" placeholder="رقم الهاتف" required><input placeholder="المدينة" required><textarea placeholder="العنوان بالتفصيل" required></textarea><select required><option value="">اختر طريقة الدفع</option><option value="cod">الدفع عند الاستلام</option><option value="card">بطاقة ائتمان (قريباً)</option></select><button type="button" class="btn" onclick="finish()">تأكيد الطلب</button></form></main>`); }
function finish() { localStorage.removeItem(CART); shell('<main class="container page"><div class="notice"><h2>تم تأكيد طلبك 🎉</h2><p>سنتواصل معك قريباً لتأكيد التفاصيل وتسليم الطلب.</p><a class="btn" href="index.html">العودة للرئيسية</a></div></main>'); }

// --- لوحة التحكم ---
async function adminPage() {
    const a = await P();
    shell(`<main class="container page admin"><h1>لوحة تحكم المنتجات</h1><p class="notice">أضف منتجات جديدة، عدّل الأسعار، وحدث الكميات المتوفرة.</p>
        <form class="adminform" id="adminForm" onsubmit="adminAdd(event)">
            <input id="productName" required placeholder="اسم المنتج">
            <input id="priceBefore" type="number" min="0" step="0.01" required placeholder="السعر الأصلي (د.إ)">
            <input id="priceAfter" type="number" min="0" step="0.01" placeholder="السعر بعد الخصم (اختياري)">
            <input id="imageUrl" required placeholder="رابط صورة المنتج">
            <select id="gender" required>
                <option value="">اختر القسم</option>
                <option value="women">النساء</option>
                <option value="men">الرجال</option>
                <option value="girls">البنات</option>
                <option value="boys">الأولاد</option>
            </select>
            <select id="season" required>
                <option value="">اختر التصنيف</option>
                <option value="summer">ملابس صيفية</option>
                <option value="winter">ملابس شتوية</option>
                <option value="underwear">ملابس داخلية</option>
                <option value="formal">ملابس رسمية</option>
                <option value="perfumes">عطور</option>
                <option value="shoes">أحذية</option>
                <option value="accessories">اكسسوارات</option>
            </select>
            <select id="type" required>
                <option value="">اختر النوع</option>
                <option value="hoodies">هودي</option>
                <option value="tshirts">تيشيرت</option>
                <option value="dresses">فستان</option>
                <option value="shirts">قميص</option>
                <option value="perfume">عطر</option>
                <option value="shoe">حذاء</option>
                <option value="bag">حقيبة</option>
                <option value="watch">ساعة</option>
                <option value="jewelry">مجوهرات</option>
                <option value="sunglasses">نظارات شمسية</option>
                <option value="belt">حزام</option>
            </select>
            <div class="full admin-options"><b>الألوان المتاحة:</b><div class="checkgrid">${DEFAULT_COLORS.map(c => `<label><input type="checkbox" name="newColor" value="${c}" checked> <span class="miniDot" style="background:${COLOR_HEX[c]}"></span>${c}</label>`).join('')}</div></div>
            <div class="full admin-options"><b>المقاسات المتاحة:</b><div class="checkgrid">${DEFAULT_SIZES.map(x => `<label><input type="checkbox" name="newSize" value="${x}" checked>${x}</label>`).join('')}</div></div>
            <button type="submit" class="btn full">إضافة المنتج</button>
        </form>
        <h2>قائمة المنتجات (${a.length})</h2>${a.map(adminProduct).join('')}
    </main>`);
}
function adminProduct(p) {
    const colors = [...new Set((p.variants || []).map(v => v.color))];
    const sizes = [...new Set((p.variants || []).map(v => v.size))];
    return `<div class="adminProduct">
        <div class="adminProductHead">
            <div><img src="${p.img}" style="width:60px; height:60px; object-fit:cover; border-radius:8px; vertical-align:middle; margin-right:10px;">
            <b>${p.name}</b>
            <div class="muted">${priceHTML(p)} • ${labelGender(p.gender)} | ${labelSeason(p.season)}</div></div>
            <button class="danger" onclick="adminDel('${p.id}')">حذف</button>
        </div>
        <div class="inventory">
            <div class="inventoryHead"><b>المقاس ↓ / اللون →</b>${colors.map(c => `<b><span class="miniDot" style="background:${COLOR_HEX[c]}"></span></b>`).join('')}</div>
            ${sizes.map(size => `<div class="inventoryRow"><b>${size}</b>${colors.map(color => { const v = (p.variants || []).find(x => x.size === size && x.color === color); return `<input type="number" min="0" value="${v ? v.stock : 0}" onchange="setStock('${p.id}','${size}','${color}',this.value)">`; }).join('')}</div>`).join('')}
        </div>
    </div>`;
}
async function setStock(id, size, color, value) {
    const a = await P(); const p = a.find(x => x.id === id); if (!p) return;
    const v = (p.variants || []).find(x => x.size === size && x.color === color);
    const stock = Math.max(0, parseInt(value) || 0);
    if (v) v.stock = stock; else p.variants.push({ size, color, stock });
    await saveProductsToDB(a);
}
async function adminAdd(e) {
    e.preventDefault();
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('priceBefore').value);
    const saleRaw = document.getElementById('priceAfter').value.trim();
    const sale = saleRaw === '' ? null : parseFloat(saleRaw);
    const img = document.getElementById('imageUrl').value.trim();
    const gender = document.getElementById('gender').value;
    const season = document.getElementById('season').value;
    const type = document.getElementById('type').value;
    const colors = [...document.querySelectorAll('input[name="newColor"]:checked')].map(x => x.value);
    const sizes = [...document.querySelectorAll('input[name="newSize"]:checked')].map(x => x.value);
    
    if (!name || !img || !price || price <= 0) { alert('املأ البيانات المطلوبة بشكل صحيح'); return; }
    if (sale !== null && sale >= price) { alert('سعر الخصم يجب أن يكون أقل من السعر الأصلي'); return; }
    if (!colors.length || !sizes.length) { alert('اختر لوناً ومقاساً واحداً على الأقل'); return; }
    
    const variants = [];
    sizes.forEach(size => colors.forEach(color => variants.push({ size, color, stock: 0 })));
    
    const a = await P();
    a.push(normalizeProduct({ 
        id: Date.now().toString(), name, price, salePrice: sale, 
        gender, season, type, img, variants 
    }));
    
    await saveProductsToDB(a);
    alert('✅ تم إضافة المنتج بنجاح!');
    document.getElementById('adminForm').reset();
    adminPage();
}
async function adminDel(id) {
    if (!confirm('متأكد من حذف هذا المنتج؟')) return;
    const a = await P();
    await saveProductsToDB(a.filter(p => p.id !== id));
    adminPage();
}
