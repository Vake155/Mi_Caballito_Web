/* =========================================================
   Mi Caballito · app.js
   Para conectar pagos/backend más adelante, edita CONFIG y las
   funciones sendOrder() y sendCustomRequest() (al final).
   ========================================================= */
const CONFIG = {
  currency: "EUR",
  locale: "es-ES",
  orderEndpoint: "",   // p. ej. tu función de Stripe/PayPal o servidor
  customEndpoint: ""   // p. ej. https://formspree.io/f/xxxx
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => n.toLocaleString(CONFIG.locale, { style: "currency", currency: CONFIG.currency });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const CAT = { amigurumi: "Amigurumi", patrones: "Patrón de crochet", personalizados: "Personalizado" };

/* ---------- Imágenes: si no existe la foto, marcador azul ---------- */
function placeholder(path) {
  const name = (path || "foto").split("/").pop();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#C3D6F4"/><rect x="14" y="14" width="372" height="372" rx="22" fill="none" stroke="#5B8BD9" stroke-width="4" stroke-dasharray="12 10"/><text x="200" y="190" font-size="46" text-anchor="middle">🧶</text><text x="200" y="240" font-family="sans-serif" font-size="17" font-weight="700" fill="#1E4DB0" text-anchor="middle">Foto próximamente</text><text x="200" y="265" font-family="sans-serif" font-size="15" fill="#1E4DB0" text-anchor="middle">${name}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function img(path, alt, cls = "") {
  return `<img src="${esc(path)}" alt="${esc(alt)}" class="${cls}" loading="lazy" onerror="this.onerror=null;this.src=placeholder('${esc(path)}')">`;
}
function hydrateImages() {
  $$("img[data-src]").forEach(i => { i.onerror = () => { i.onerror = null; i.src = placeholder(i.dataset.src); }; i.src = i.dataset.src; });
}

/* ---------- Tienda ---------- */
const PAGE = document.body.dataset.page, HOME = PAGE === "home"; // portada: solo destacados
const SORTS = { "": (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0), recent: (a, b) => (b.added || "").localeCompare(a.added || ""), asc: (a, b) => a.price - b.price, desc: (a, b) => b.price - a.price, name: (a, b) => a.name.localeCompare(b.name, "es") };
const urlCat = new URLSearchParams(location.search).get("cat");
let filter = ["amigurumi", "patrones", "personalizados"].includes(urlCat) ? urlCat : "all", query = "", sort = "";

function renderGrid() {
  const list = (HOME ? PRODUCTS.filter(p => p.featured).slice(0, 8) : PRODUCTS).filter(p => (filter === "all" || p.category === filter) &&
    (p.name + " " + p.description).toLowerCase().includes(query)).sort(SORTS[sort] || (() => 0));
  const g = $("#grid"); g.style.minHeight = g.offsetHeight + "px"; setTimeout(() => (g.style.minHeight = "0px"), 350); // evita saltos al filtrar
  g.innerHTML = list.length ? list.map(card).join("") :
    `<div class="empty" style="grid-column:1/-1"><p>No hemos encontrado ningún producto con esa búsqueda.</p><button class="btn btn-alt" data-reset>Ver todos los productos</button></div>`;
  if ($("#count")) $("#count").textContent = list.length + (list.length === 1 ? " producto" : " productos");
  $$(".chip").forEach(c => c.classList.toggle("active", c.dataset.filter === filter));
  observe();
}

function badgeOf(p) {
  if (p.type === "digital") return ["digital", "PATRÓN DIGITAL"];
  if (p.category === "personalizados") return ["custom", "PERSONALIZADO"];
  return ["", "HECHO A MANO"];
}
function card(p, i = 0) {
  const digital = p.type === "digital", [bc, bt] = badgeOf(p), url = "producto.html?id=" + p.id, off = !digital && !p.available;
  const st = digital ? `<span class="state ok">DESCARGA DIGITAL</span>` : p.available ? `<span class="state ok">Disponible</span>` : `<span class="state no">Agotado</span>`;
  return `<article class="card reveal${off ? " off" : ""}" style="--d:${Math.min(i, 7) * 60}ms">
    <a class="card-img" href="${url}" aria-label="Ver ${esc(p.name)}">${img(p.image, p.name)}<span class="badge ${bc}">${bt}</span></a>
    <div class="card-body">
      <span class="cat">${CAT[p.category]}</span>
      <h3><a href="${url}">${esc(p.name)}</a></h3>
      <p class="desc">${esc(p.description)}</p>
      <div class="meta"><span class="price">${money(p.price)}</span>${st}</div>
      <button class="btn btn-sm" data-add="${p.id}" ${off ? "disabled" : ""}>${off ? "Agotado" : "Añadir al carrito"}</button>
    </div></article>`;
}

function setFilter(f) { filter = f; renderGrid(); }

/* ---------- Ficha de producto (producto.html?id=1) ---------- */
function detailHTML(p) {
  const digital = p.type === "digital", [bc, bt] = badgeOf(p), off = !digital && !p.available;
  const specs = digital
    ? [["Nivel", p.level], ["Idioma", p.language], ["Formato", p.format], ["Páginas", p.pages]]
    : [["Tamaño", p.size], ["Material", p.material], ["Elaboración", p.time], ["Disponibilidad", p.available ? "En stock" : "Bajo pedido"]];
  return `<div class="detail">
    <div class="detail-img">${img(p.image, p.name)}</div>
    <div>
      <span class="badge ${bc}" style="position:static;display:inline-block">${bt}${digital ? " · DESCARGA DIGITAL" : ""}</span>
      <p class="cat" style="margin:.6rem 0 0">${CAT[p.category]}</p>
      <h1>${esc(p.name)}</h1>
      <p class="price" style="font-size:1.6rem">${money(p.price)}</p>
      <p>${esc(p.long || p.description)}</p>
      <ul class="specs">${specs.map(x => `<li><b>${x[0]}:</b> ${esc(x[1])}</li>`).join("")}</ul>
      ${digital ? `<p class="notice">Es un archivo para descargar. No se envía nada a casa.</p>` : ""}
      ${off ? `<p class="notice">Ahora mismo está agotado. Escríbenos y lo tejemos bajo pedido.</p>` : `<label for="qtyIn">Cantidad</label>
      <input type="number" id="qtyIn" value="1" min="1" max="20" style="max-width:90px">
      <p><button class="btn" id="addDetail">Añadir al carrito</button></p>`}
    </div></div>`;
}
function initProductPage() {
  const p = PRODUCTS.find(x => x.id == new URLSearchParams(location.search).get("id")), box = $("#product");
  if (!p) { box.innerHTML = `<div class="empty"><h1>No encontramos este producto</h1><p><a class="btn" href="tienda.html">Volver a la tienda</a></p></div>`; return; }
  document.title = p.name + " · Mi Caballito";
  box.innerHTML = detailHTML(p);
  const b = $("#addDetail");
  if (b) b.onclick = () => { addToCart(p.id, Math.max(1, Math.min(20, +$("#qtyIn").value || 1))); openCart(); };
}

/* ---------- Carrito (localStorage) ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("mc_cart")) || []; } catch (e) { cart = []; }
const save = () => { try { localStorage.setItem("mc_cart", JSON.stringify(cart)); } catch (e) {} renderCart(); flash = null; };

let flash = null;
function bump() { const c = $("#cartCount"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
function addToCart(id, n = 1) {
  const l = cart.find(c => c.id == id);
  if (l) l.qty += n; else cart.push({ id: +id, qty: n });
  flash = +id; save(); bump();
}
function changeQty(id, d) {
  const l = cart.find(c => c.id == id); if (!l) return;
  flash = +id; l.qty += d; if (l.qty < 1) cart = cart.filter(c => c.id != id);
  save();
}
const removeLine = id => { cart = cart.filter(c => c.id != id); save(); };
const lines = () => cart.map(c => ({ ...PRODUCTS.find(p => p.id == c.id), qty: c.qty })).filter(l => l.id);
const subtotal = ls => ls.reduce((s, l) => s + l.price * l.qty, 0);

function renderCart() {
  const ls = lines();
  $("#cartCount").textContent = ls.reduce((s, l) => s + l.qty, 0);
  const row = l => `<div class="line${l.id === flash ? " pulse" : ""}">${img(l.image, l.name)}
    <div><b>${esc(l.name)}</b><span>${money(l.price)}</span>
    <div class="qty"><button data-q="${l.id}" data-d="-1" aria-label="Quitar uno">−</button><span>${l.qty}</span><button data-q="${l.id}" data-d="1" aria-label="Añadir uno">+</button></div></div>
    <div><b>${money(l.price * l.qty)}</b><br><button class="rm" data-rm="${l.id}">Eliminar</button></div></div>`;
  const ph = ls.filter(l => l.type === "physical"), di = ls.filter(l => l.type === "digital");
  $("#cartBody").innerHTML = ls.length
    ? (ph.length ? `<p class="group-title">🧸 PRODUCTOS FÍSICOS (envío a casa)</p>${ph.map(row).join("")}` : "") +
      (di.length ? `<p class="group-title">💾 PRODUCTOS DIGITALES (descarga)</p>${di.map(row).join("")}` : "")
    : `<div class="empty"><p>Tu cesta está vacía.</p><p>Elige un amigurumi para empezar.</p></div>`;
  $("#cartFoot").innerHTML = ls.length
    ? `<div class="total-row"><span>Subtotal físicos</span><span>${money(subtotal(ph))}</span></div>
       <div class="total-row"><span>Subtotal digitales</span><span>${money(subtotal(di))}</span></div>
       <div class="total-row big"><span>Total</span><span>${money(subtotal(ls))}</span></div>
       <button class="btn" id="checkout">Finalizar pedido</button>
       <button class="btn btn-alt" data-close>Continuar comprando</button>`
    : `<button class="btn btn-alt" data-close>Continuar comprando</button>`;
}

/* ---------- Checkout de demostración ---------- */
function openCheckout() {
  const ls = lines(), hasPhys = ls.some(l => l.type === "physical");
  closeAll();
  openModal(`<h2 id="modalTitle">Finalizar pedido</h2>
    <p class="notice">Demostración: aún no se cobra nada ni se envía el pedido.</p>
    <form id="orderForm">
      <div class="two"><div><label for="oN">Nombre</label><input id="oN" required></div><div><label for="oE">Email</label><input id="oE" type="email" required></div></div>
      ${hasPhys ? `<label for="oA">Dirección de envío (productos físicos)</label><input id="oA" required>` : ""}
      <p class="total-row big"><span>Total</span><span>${money(subtotal(ls))}</span></p>
      <button class="btn" type="submit">Confirmar pedido</button>
    </form>`);
  $("#orderForm").onsubmit = async e => {
    e.preventDefault();
    const order = { customer: { name: $("#oN").value, email: $("#oE").value, address: $("#oA") ? $("#oA").value : null },
      items: ls.map(l => ({ id: l.id, name: l.name, type: l.type, qty: l.qty, price: l.price })), total: subtotal(ls) };
    await sendOrder(order);
    cart = []; save();
    $("#modalBody").innerHTML = `<h2 id="modalTitle">¡Gracias, ${esc(order.customer.name)}!</h2><p>Tu pedido de demostración se ha registrado. En la tienda real recibirías un email de confirmación.</p><button class="btn" data-close>Seguir viendo</button>`;
  };
}

/* ---------- Personalizados ---------- */
function openCustom() {
  openModal(`<h2 id="modalTitle">Tu amigurumi personalizado</h2>
    <form id="customForm">
      <div class="two"><div><label for="cN">Nombre</label><input id="cN" required></div><div><label for="cE">Email</label><input id="cE" type="email" required></div></div>
      <label for="cW">¿Qué quieres que hagamos?</label><input id="cW" required placeholder="Mi perro, un regalo de cumpleaños…">
      <label for="cD">Descripción</label><textarea id="cD" rows="3" required></textarea>
      <div class="two"><div><label for="cC">Color</label><input id="cC" placeholder="Azul, crema…"></div>
      <div><label for="cS">Tamaño</label><select id="cS"><option>Pequeño (10-15 cm)</option><option>Mediano (15-25 cm)</option><option>Grande (+25 cm)</option></select></div></div>
      <label for="cB">Presupuesto aproximado</label><select id="cB"><option>Menos de 30 €</option><option>30-50 €</option><option>50-80 €</option><option>Más de 80 €</option></select>
      <label for="cF">Imagen de referencia</label><input id="cF" type="file" accept="image/*">
      <p><button class="btn" type="submit">Enviar solicitud</button></p>
    </form>`);
  $("#customForm").onsubmit = async e => {
    e.preventDefault();
    const f = $("#cF").files[0];
    await sendCustomRequest({ name: $("#cN").value, email: $("#cE").value, idea: $("#cW").value, description: $("#cD").value,
      color: $("#cC").value, size: $("#cS").value, budget: $("#cB").value, referenceImage: f ? f.name : null, file: f || null });
    $("#modalBody").innerHTML = `<h2 id="modalTitle">¡Solicitud recibida!</h2><p>Gracias por tu idea. Te escribiremos pronto para hablar de los detalles.</p><button class="btn" data-close>Cerrar</button>`;
  };
}

/* ---------- Puntos de conexión con backend (hoy: demo) ---------- */
async function sendOrder(order) {
  if (CONFIG.orderEndpoint) {
    // Aquí iría Stripe Checkout / PayPal: crear sesión en tu servidor y redirigir.
    await fetch(CONFIG.orderEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(order) });
  } else console.info("Pedido (demo):", order);
}
async function sendCustomRequest(data) {
  if (CONFIG.customEndpoint) {
    const fd = new FormData(); Object.entries(data).forEach(([k, v]) => { if (v) fd.append(k, v); });
    await fetch(CONFIG.customEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } });
  } else console.info("Solicitud personalizada (demo):", data);
}

/* ---------- Modales y panel ---------- */
let lastFocus = null;
function openModal(html) { lastFocus = document.activeElement; $("#modalBody").innerHTML = html; $("#modal").hidden = false; document.body.style.overflow = "hidden"; const f = $("#modal input, #modal button.btn"); if (f) f.focus(); }
function openCart() { $("#overlay").hidden = false; $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
function closeAll() {
  $("#modal").hidden = true;
  const ov = $("#overlay");
  if (!ov.hidden) { ov.classList.add("out"); setTimeout(() => { if (!$("#drawer").classList.contains("open")) ov.hidden = true; ov.classList.remove("out"); }, 250); }
  $("#drawer").classList.remove("open"); $("#drawer").setAttribute("aria-hidden", "true");
  document.body.style.overflow = ""; if (lastFocus) lastFocus.focus();
}

/* ---------- Eventos ---------- */
document.addEventListener("click", e => {
  const t = e.target;
  const add = t.closest("[data-add]"); if (add) { addToCart(add.dataset.add); return; }
  if (t.closest("[data-reset]")) { query = ""; filter = "all"; sort = ""; const i = $("#searchInput"), so = $("#sortSel"); if (i) i.value = ""; if (so) so.value = ""; renderGrid(); return; }
  const q = t.closest("[data-q]"); if (q) { changeQty(q.dataset.q, +q.dataset.d); return; }
  const rm = t.closest("[data-rm]"); if (rm) { removeLine(rm.dataset.rm); return; }
  if (t.closest("[data-close]") || t === $("#overlay") || t === $("#modal")) { closeAll(); return; }
  if (t.closest("#checkout")) { openCheckout(); return; }
  const f = t.closest("a[data-filter],button.chip"); if (f) { setFilter(f.dataset.filter); $("#nav").classList.remove("open"); return; }
  if (t.closest(".nav a")) $("#nav").classList.remove("open");
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
$("#cartBtn").onclick = openCart;
if ($("#customBtn")) $("#customBtn").onclick = openCustom;
$("#burger").onclick = () => { const o = $("#nav").classList.toggle("open"); $("#burger").setAttribute("aria-expanded", o); };
$("#searchBtn").onclick = () => { const s = $("#searchbar"); if (s) { s.hidden = !s.hidden; if (!s.hidden) $("#searchInput").focus(); } else if (!$("#searchInput")) { location.href = "tienda.html"; } else { $("#searchInput").scrollIntoView({ behavior: "smooth", block: "center" }); $("#searchInput").focus(); } };
if ($("#sortSel")) $("#sortSel").onchange = e => { sort = e.target.value; renderGrid(); };
if (!$("#searchInput")) {} else if (HOME) $("#searchInput").onkeydown = e => { if (e.key === "Enter") location.href = "tienda.html?q=" + encodeURIComponent(e.target.value.trim()); };
else {
  const q0 = new URLSearchParams(location.search).get("q");
  if (q0) { $("#searchInput").value = q0; query = q0.trim().toLowerCase(); }
  $("#searchInput").oninput = e => { query = e.target.value.trim().toLowerCase(); renderGrid(); };
}

/* ---------- Aparición suave al hacer scroll ---------- */
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .12, rootMargin: "0px 0px -4% 0px" }) : null;
function observe() { $$(".reveal:not(.in)").forEach(el => io ? io.observe(el) : el.classList.add("in")); }

/* ---------- Revelado automático de secciones (con retraso escalonado) ---------- */
function autoReveal() {
  const sel = ".section h2, .custom-in .lead, .ideas li, .custom-in .btn, .about-in > div:not(.about-img) > *, .about-img, .insta img, .center .btn, .foot-in > div, .thread, .toolbar, .shop-bar";
  $$(sel).forEach(el => {
    if (el.closest(".hero")) return;
    const idx = [...el.parentElement.children].indexOf(el);
    el.style.setProperty("--d", Math.min(idx, 6) * 80 + "ms");
    el.classList.add("reveal");
  });
  observe();
}

/* ---------- Header: sombra suave al hacer scroll (sin cambiar de tamaño) ---------- */
const hd = $(".header");
if (hd) {
  let tick = false;
  const upd = () => { hd.classList.toggle("scrolled", scrollY > 8); tick = false; };
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  upd();
}

/* ---------- Inicio ---------- */
if ($("#insta")) $("#insta").innerHTML = INSTAGRAM.map((s, i) => img(s, `Foto ${i + 1} de Mi Caballito en Instagram`)).join("");
$("#year").textContent = new Date().getFullYear();
hydrateImages(); autoReveal(); if ($("#grid")) renderGrid(); renderCart(); if (PAGE === "product") initProductPage();
