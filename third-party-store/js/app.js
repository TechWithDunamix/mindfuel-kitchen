(function () {
  const cfg = window.S4M_CONFIG;
  const api = window.S4M_API;
  const cart = window.S4M_CART;

  const state = {
    products: [],
    categories: [],
    plans: [],
    category: 'all',
    query: '',
    authStep: 'email',
    authEmail: '',
    subscribePlan: null,
    member: null,
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function money(amount, currency) {
    const cur = (currency || cfg.currencyFallback || 'NGN').toUpperCase();
    const n = Number(amount) || 0;
    const symbols = { NGN: '₦', USD: '$', EUR: '€', GBP: '£', GHS: 'GH₵', KES: 'KSh' };
    const sym = symbols[cur] || `${cur} `;
    try {
      return `${sym}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } catch {
      return `${sym}${n.toFixed(2)}`;
    }
  }

  function toast(message, type = '') {
    const el = $('#toast');
    el.textContent = message;
    el.className = `toast show${type ? ` ${type}` : ''}`;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 3200);
  }

  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
  }

  function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
  }

  function setCartOpen(open) {
    $('#cart-drawer').classList.toggle('open', open);
    $('#cart-overlay').classList.toggle('open', open);
    $('#cart-drawer').setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function navigate(name) {
    $$('.section').forEach((s) => s.classList.remove('active'));
    $$('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.nav === name));
    const section = document.getElementById(`section-${name}`);
    if (section) section.classList.add('active');
    if (name === 'portal') loadPortal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateMemberUI() {
    const loggedIn = api.isMemberLoggedIn();
    $('#member-chip').classList.toggle('show', loggedIn);
    $('#btn-member-auth').textContent = loggedIn ? 'Account' : 'Member login';
    $('#btn-logout-member').classList.toggle('hidden', !loggedIn);
  }

  function renderCart() {
    const items = cart.all();
    const badge = $('#cart-badge');
    badge.textContent = String(cart.count());
    badge.style.display = cart.count() ? 'grid' : 'none';
    $('#cart-total').textContent = money(cart.total(), items[0]?.currency);

    const body = $('#cart-body');
    if (!items.length) {
      body.innerHTML = `<div class="empty">Your cart is empty.<br/>Add something from the shop.</div>`;
      $('#btn-checkout').disabled = true;
      return;
    }
    $('#btn-checkout').disabled = false;
    body.innerHTML = items
      .map(
        (i) => `
      <div class="cart-line">
        <img src="${i.image_url || ''}" alt="" onerror="this.style.opacity=.2" />
        <div>
          <h4>${escapeHtml(i.name)}</h4>
          <p>${money(i.price, i.currency)}</p>
          <div class="qty">
            <button type="button" data-qty-dec="${i.product_id}">−</button>
            <span>${i.quantity}</span>
            <button type="button" data-qty-inc="${i.product_id}">+</button>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" type="button" data-remove="${i.product_id}">Remove</button>
      </div>`,
      )
      .join('');
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function filteredProducts() {
    const q = state.query.trim().toLowerCase();
    return state.products.filter((p) => {
      if (state.category !== 'all') {
        const slug = p.category?.slug || '';
        if (slug !== state.category) return false;
      }
      if (!q) return true;
      const hay = `${p.name} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function renderCategories() {
    const root = $('#category-chips');
    const chips = [{ slug: 'all', name: 'All' }, ...state.categories];
    root.innerHTML = chips
      .map(
        (c) =>
          `<button type="button" class="chip${state.category === c.slug ? ' active' : ''}" data-cat="${c.slug}">${escapeHtml(c.name)}</button>`,
      )
      .join('');
  }

  function renderProducts() {
    const grid = $('#product-grid');
    const list = filteredProducts();
    if (!list.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1">No products match your filters.</div>`;
      return;
    }
    grid.innerHTML = list
      .map((p) => {
        const img = (p.media_urls && p.media_urls[0]) || '';
        const cat = p.category?.name || 'Uncategorized';
        return `
        <article class="card">
          <div class="card-media">
            ${img ? `<img src="${img}" alt="${escapeHtml(p.name)}" loading="lazy" />` : ''}
          </div>
          <div class="card-body">
            <div class="card-cat">${escapeHtml(cat)}</div>
            <h3>${escapeHtml(p.name)}</h3>
            <div class="desc">${escapeHtml(p.description || 'No description')}</div>
            <div class="price-row">
              <div class="price">${money(p.price, p.currency)}</div>
            </div>
            <div class="card-actions">
              <button class="btn btn-primary btn-sm" type="button" data-add="${p.id}">Add to cart</button>
              <button class="btn btn-ghost btn-sm" type="button" data-view="${p.id}">Details</button>
            </div>
          </div>
        </article>`;
      })
      .join('');
  }

  function renderPlans() {
    const grid = $('#plan-grid');
    if (!state.plans.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1">No active membership plans yet.</div>`;
      return;
    }
    grid.innerHTML = state.plans
      .map((plan) => {
        const img = plan.image_url
          ? `<img src="${plan.image_url}" alt="" />`
          : `<div style="height:160px;border-radius:12px;background:var(--surface-2);display:grid;place-items:center;color:var(--faint);font-weight:700">PLAN</div>`;
        return `
        <article class="plan-card">
          ${img}
          <div>
            <h3 style="margin:0 0 .35rem;letter-spacing:-.02em">${escapeHtml(plan.name)}</h3>
            <p style="margin:0;color:var(--muted);font-size:.9rem">${escapeHtml(plan.description || 'Recurring product delivery plan')}</p>
          </div>
          <div class="price">${money(plan.price, plan.currency)} <span style="font-size:.85rem;font-weight:600;color:var(--muted)">/ ${escapeHtml(plan.billing_interval)}</span></div>
          <div class="plan-meta">
            <span class="pill">Up to ${plan.max_products} products</span>
            ${plan.delivery_day ? `<span class="pill">Delivers ${escapeHtml(plan.delivery_day)}</span>` : ''}
            <span class="pill ok">Active</span>
          </div>
          <button class="btn btn-primary" type="button" data-subscribe="${plan.id}">Subscribe</button>
        </article>`;
      })
      .join('');
  }

  function showProductModal(product) {
    $('#product-modal-title').textContent = product.name;
    const img = (product.media_urls && product.media_urls[0]) || '';
    $('#product-modal-body').innerHTML = `
      <div class="split">
        <div style="border-radius:16px;overflow:hidden;background:var(--surface);aspect-ratio:1;border:1px solid var(--border)">
          ${img ? `<img src="${img}" alt="" style="width:100%;height:100%;object-fit:cover" />` : ''}
        </div>
        <div>
          <div class="card-cat">${escapeHtml(product.category?.name || 'Product')}</div>
          <div class="price" style="margin:.5rem 0 1rem;font-size:1.4rem">${money(product.price, product.currency)}</div>
          <p style="color:var(--muted);font-size:.92rem;line-height:1.6">${escapeHtml(product.description || 'No description')}</p>
          <button class="btn btn-primary btn-block" style="margin-top:1.25rem" type="button" data-add="${product.id}" data-close-after="1">Add to cart</button>
        </div>
      </div>`;
    openModal('product-modal');
  }

  async function openSubscribe(plan) {
    if (!api.isMemberLoggedIn()) {
      toast('Log in as a member first', 'error');
      openModal('auth-modal');
      return;
    }
    state.subscribePlan = plan;
    $('#subscribe-title').textContent = `Subscribe · ${plan.name}`;
    $('#subscribe-sub').textContent = `Pick up to ${plan.max_products} products · ${money(plan.price, plan.currency)} / ${plan.billing_interval}`;

    const body = $('#subscribe-body');
    body.innerHTML = `<div class="loading">Loading products…</div>`;
    openModal('subscribe-modal');

    const products = state.products.length ? state.products : await api.listProducts();
    state.products = products;

    body.innerHTML = `
      <p style="margin:0 0 .5rem;color:var(--muted);font-size:.88rem">Selected: <strong id="pick-count">0</strong> / ${plan.max_products}</p>
      <div class="pick-list" id="pick-list">
        ${products
          .map(
            (p) => `
          <label class="pick-item" data-pick="${p.id}">
            <img src="${(p.media_urls && p.media_urls[0]) || ''}" alt="" onerror="this.style.opacity=.15" />
            <div>
              <h4>${escapeHtml(p.name)}</h4>
              <p>${money(p.price, p.currency)}</p>
            </div>
            <input type="checkbox" data-pick-check="${p.id}" />
          </label>`,
          )
          .join('')}
      </div>
      <button class="btn btn-primary btn-block" type="button" id="btn-confirm-subscribe">Confirm subscription</button>
    `;
  }

  function selectedPickIds() {
    return $$('#pick-list input[data-pick-check]:checked').map((el) => el.getAttribute('data-pick-check'));
  }

  function updatePickCount() {
    const el = $('#pick-count');
    if (el) el.textContent = String(selectedPickIds().length);
    $$('#pick-list .pick-item').forEach((row) => {
      const id = row.getAttribute('data-pick');
      const checked = row.querySelector('input')?.checked;
      row.classList.toggle('selected', Boolean(checked));
    });
  }

  async function confirmSubscribe() {
    const plan = state.subscribePlan;
    if (!plan) return;
    const ids = selectedPickIds();
    if (!ids.length) {
      toast('Select at least one product', 'error');
      return;
    }
    if (ids.length > plan.max_products) {
      toast(`This plan allows at most ${plan.max_products} products`, 'error');
      return;
    }

    const btn = $('#btn-confirm-subscribe');
    btn.disabled = true;
    btn.textContent = 'Creating…';
    try {
      const result = await api.subscribe({
        plan_id: plan.id,
        items: ids.map((product_id) => ({ product_id, quantity: 1 })),
      });
      closeModal('subscribe-modal');
      toast('Subscription created!', 'success');
      const url = result?.checkout?.checkout_url;
      if (url) {
        window.location.href = url;
        return;
      }
      navigate('portal');
    } catch (err) {
      toast(err.message || 'Subscribe failed', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Confirm subscription';
    }
  }

  async function loadPortal() {
    const root = $('#portal-content');
    if (!api.isMemberLoggedIn()) {
      root.innerHTML = `
        <div class="panel" style="text-align:center;padding:2.5rem 1rem">
          <h3 style="margin-top:0">You're not logged in</h3>
          <p style="color:var(--muted)">Use email OTP to open your membership portal.</p>
          <button class="btn btn-primary" type="button" id="portal-login-cta">Member login</button>
        </div>`;
      return;
    }

    root.innerHTML = `<div class="loading">Loading your membership…</div>`;
    try {
      const [me, subs] = await Promise.all([api.memberMe(), api.listMySubscriptions()]);
      state.member = me;
      updateMemberUI();

      if (!subs.length) {
        root.innerHTML = `
          <div class="panel">
            <h3 style="margin-top:0">Hi ${escapeHtml(me.name || me.email)}</h3>
            <p style="color:var(--muted)">No subscriptions yet. Browse plans and subscribe.</p>
            <button class="btn btn-primary" type="button" data-nav="membership">View plans</button>
          </div>`;
        return;
      }

      const blocks = await Promise.all(
        subs.map(async (sub) => {
          let deliveries = [];
          try {
            deliveries = await api.listMyDeliveries(sub.id);
          } catch {
            deliveries = [...(sub.upcoming_deliveries || []), ...(sub.delivery_history || [])];
          }
          const st = statusPill(sub.status);
          return `
            <div class="panel">
              <div class="list-row" style="border:0;padding-top:0">
                <div>
                  <h4>${escapeHtml(sub.plan?.name || 'Subscription')}</h4>
                  <p>${money(sub.price, sub.currency)} / ${escapeHtml(sub.billing_interval)} · Next ${formatDate(sub.next_delivery_date)}</p>
                </div>
                <span class="pill ${st.cls}">${escapeHtml(sub.status)}</span>
              </div>
              <div style="margin:.5rem 0 1rem">
                <div style="font-size:.75rem;font-weight:800;color:var(--faint);letter-spacing:.06em;text-transform:uppercase;margin-bottom:.45rem">Items</div>
                ${(sub.items || [])
                  .map(
                    (it) =>
                      `<div class="list-row"><div><h4>${escapeHtml(it.name)}</h4><p>Qty ${it.quantity}</p></div><strong>${money(it.price, sub.currency)}</strong></div>`,
                  )
                  .join('') || '<p style="color:var(--muted);font-size:.88rem">No items</p>'}
              </div>
              <div style="margin-bottom:1rem">
                <div style="font-size:.75rem;font-weight:800;color:var(--faint);letter-spacing:.06em;text-transform:uppercase;margin-bottom:.45rem">Deliveries</div>
                ${
                  deliveries.length
                    ? deliveries
                        .slice(0, 8)
                        .map((d) => {
                          const ds = statusPill(d.status);
                          return `<div class="list-row"><div><h4>${formatDate(d.delivery_date)}</h4><p>${money(d.total, d.currency)} · payment ${escapeHtml(d.payment_status)}</p></div><span class="pill ${ds.cls}">${escapeHtml(d.status)}</span></div>`;
                        })
                        .join('')
                    : '<p style="color:var(--muted);font-size:.88rem">No deliveries yet</p>'
                }
              </div>
              <div class="row-actions">
                ${
                  sub.status === 'active'
                    ? `<button class="btn btn-soft btn-sm" type="button" data-pause="${sub.id}">Pause</button>`
                    : ''
                }
                ${
                  sub.status === 'paused'
                    ? `<button class="btn btn-soft btn-sm" type="button" data-resume="${sub.id}">Resume</button>`
                    : ''
                }
                ${
                  sub.status !== 'cancelled'
                    ? `<button class="btn btn-danger btn-sm" type="button" data-cancel-sub="${sub.id}">Cancel</button>`
                    : ''
                }
              </div>
            </div>`;
        }),
      );

      root.innerHTML = `
        <div class="panel" style="margin-bottom:1rem">
          <h3 style="margin:0">Hi ${escapeHtml(me.name || me.email)}</h3>
          <p style="margin:.35rem 0 0;color:var(--muted);font-size:.9rem">${escapeHtml(me.email)} · ${subs.length} subscription${subs.length === 1 ? '' : 's'}</p>
        </div>
        ${blocks.join('')}`;
    } catch (err) {
      if (err.status === 401) {
        api.setMemberToken('');
        updateMemberUI();
        root.innerHTML = `<div class="error-box">Session expired. Please log in again.</div>`;
        return;
      }
      root.innerHTML = `<div class="error-box">${escapeHtml(err.message || 'Failed to load portal')}</div>`;
    }
  }

  function statusPill(status) {
    const s = String(status || '').toLowerCase();
    if (['active', 'delivered', 'paid'].includes(s)) return { cls: 'ok' };
    if (['paused', 'pending', 'preparing', 'shipped', 'unpaid'].includes(s)) return { cls: 'warn' };
    if (['cancelled', 'failed', 'skipped', 'disabled'].includes(s)) return { cls: 'bad' };
    return { cls: '' };
  }

  function formatDate(v) {
    if (!v) return '—';
    try {
      return new Date(v).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return String(v);
    }
  }

  async function bootstrap() {
    $('#brand-name').textContent = cfg.storeName;
    $('#footer-name').textContent = cfg.storeName;
    updateMemberUI();
    renderCart();

    $('#product-grid').innerHTML = Array.from({ length: 6 })
      .map(() => `<div class="skeleton"></div>`)
      .join('');
    $('#plan-grid').innerHTML = Array.from({ length: 2 })
      .map(() => `<div class="skeleton" style="min-height:320px"></div>`)
      .join('');

    try {
      const [products, categories, plans] = await Promise.all([
        api.listProducts(),
        api.listCategories().catch(() => []),
        api.listMembershipPlans().catch(() => []),
      ]);
      state.products = products || [];
      state.categories = categories || [];
      state.plans = plans || [];

      $('#stat-products').textContent = String(state.products.length);
      $('#stat-plans').textContent = String(state.plans.length);
      const cur = state.products[0]?.currency || cfg.currencyFallback;
      $('#stat-currency').textContent = cur;
      if (state.products[0]?.store_id) {
        cfg.storeId = state.products[0].store_id;
      }

      renderCategories();
      renderProducts();
      renderPlans();
    } catch (err) {
      $('#product-grid').innerHTML = `<div class="error-box" style="grid-column:1/-1">${escapeHtml(err.message || 'Failed to load catalog. Is the API running?')}</div>`;
      $('#plan-grid').innerHTML = `<div class="error-box" style="grid-column:1/-1">Could not load plans</div>`;
    }
  }

  document.addEventListener('click', async (e) => {
    const t = e.target.closest('[data-nav]');
    if (t) {
      e.preventDefault();
      navigate(t.getAttribute('data-nav'));
      return;
    }

    if (e.target.closest('#btn-cart')) {
      setCartOpen(true);
      return;
    }
    if (e.target.closest('#btn-close-cart') || e.target.id === 'cart-overlay') {
      setCartOpen(false);
      return;
    }

    const close = e.target.closest('[data-close]');
    if (close) {
      closeModal(close.getAttribute('data-close'));
      return;
    }

    const cat = e.target.closest('[data-cat]');
    if (cat) {
      state.category = cat.getAttribute('data-cat');
      renderCategories();
      renderProducts();
      return;
    }

    const add = e.target.closest('[data-add]');
    if (add) {
      const id = add.getAttribute('data-add');
      const product = state.products.find((p) => p.id === id);
      if (product) {
        cart.add(product, 1);
        toast(`${product.name} added`, 'success');
        if (add.hasAttribute('data-close-after')) closeModal('product-modal');
      }
      return;
    }

    const view = e.target.closest('[data-view]');
    if (view) {
      const product = state.products.find((p) => p.id === view.getAttribute('data-view'));
      if (product) showProductModal(product);
      return;
    }

    const inc = e.target.closest('[data-qty-inc]');
    if (inc) {
      const id = inc.getAttribute('data-qty-inc');
      const row = cart.all().find((i) => i.product_id === id);
      if (row) cart.setQty(id, row.quantity + 1);
      return;
    }
    const dec = e.target.closest('[data-qty-dec]');
    if (dec) {
      const id = dec.getAttribute('data-qty-dec');
      const row = cart.all().find((i) => i.product_id === id);
      if (row) cart.setQty(id, row.quantity - 1);
      return;
    }
    const rem = e.target.closest('[data-remove]');
    if (rem) {
      cart.remove(rem.getAttribute('data-remove'));
      return;
    }

    if (e.target.closest('#btn-checkout')) {
      if (!cart.all().length) return;
      setCartOpen(false);
      openModal('checkout-modal');
      return;
    }

    if (e.target.closest('#btn-member-auth') || e.target.closest('#portal-login-cta')) {
      if (api.isMemberLoggedIn()) {
        navigate('portal');
      } else {
        state.authStep = 'email';
        $('#otp-step').classList.add('hidden');
        $('#btn-resend-otp').classList.add('hidden');
        $('#btn-auth-submit').textContent = 'Send login code';
        openModal('auth-modal');
      }
      return;
    }

    if (e.target.closest('#btn-logout-member')) {
      api.setMemberToken('');
      state.member = null;
      updateMemberUI();
      toast('Logged out');
      loadPortal();
      return;
    }

    if (e.target.closest('#btn-refresh-portal')) {
      loadPortal();
      return;
    }

    const subBtn = e.target.closest('[data-subscribe]');
    if (subBtn) {
      const plan = state.plans.find((p) => p.id === subBtn.getAttribute('data-subscribe'));
      if (plan) openSubscribe(plan);
      return;
    }

    if (e.target.closest('#btn-confirm-subscribe')) {
      confirmSubscribe();
      return;
    }

    const pick = e.target.closest('[data-pick]');
    if (pick && e.target.tagName !== 'INPUT') {
      const cb = pick.querySelector('input[type="checkbox"]');
      if (cb) {
        const plan = state.subscribePlan;
        if (!cb.checked && plan && selectedPickIds().length >= plan.max_products) {
          toast(`Max ${plan.max_products} products for this plan`, 'error');
          return;
        }
        cb.checked = !cb.checked;
        updatePickCount();
      }
      return;
    }

    if (e.target.matches('input[data-pick-check]')) {
      const plan = state.subscribePlan;
      if (e.target.checked && plan && selectedPickIds().length > plan.max_products) {
        e.target.checked = false;
        toast(`Max ${plan.max_products} products for this plan`, 'error');
      }
      updatePickCount();
      return;
    }

    const pause = e.target.closest('[data-pause]');
    if (pause) {
      try {
        await api.pauseSubscription(pause.getAttribute('data-pause'));
        toast('Subscription paused', 'success');
        loadPortal();
      } catch (err) {
        toast(err.message, 'error');
      }
      return;
    }
    const resume = e.target.closest('[data-resume]');
    if (resume) {
      try {
        await api.resumeSubscription(resume.getAttribute('data-resume'));
        toast('Subscription resumed', 'success');
        loadPortal();
      } catch (err) {
        toast(err.message, 'error');
      }
      return;
    }
    const cancel = e.target.closest('[data-cancel-sub]');
    if (cancel) {
      if (!confirm('Cancel this subscription?')) return;
      try {
        await api.cancelSubscription(cancel.getAttribute('data-cancel-sub'));
        toast('Subscription cancelled', 'success');
        loadPortal();
      } catch (err) {
        toast(err.message, 'error');
      }
    }
  });

  $('#product-search').addEventListener('input', (e) => {
    state.query = e.target.value;
    renderProducts();
  });

  window.addEventListener('s4m:cart', renderCart);

  $('#checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const items = cart.all();
    if (!items.length) {
      toast('Cart is empty', 'error');
      return;
    }

    const btn = $('#btn-pay');
    btn.disabled = true;
    btn.textContent = 'Creating session…';
    try {
      const payload = {
        store_id: cfg.storeId,
        items: items.map((i) => ({
          name: i.name,
          price: Number(i.price),
          quantity: i.quantity,
          currency: (i.currency || cfg.currencyFallback).toLowerCase(),
          image_url: i.image_url || undefined,
        })),
        customer: {
          name: String(fd.get('name') || '').trim(),
          email: String(fd.get('email') || '').trim(),
          phone: String(fd.get('phone') || '').trim() || undefined,
          address: String(fd.get('address') || '').trim() || undefined,
        },
        promo_code: String(fd.get('promo_code') || '').trim() || undefined,
        redirect_to: `${window.location.origin}${window.location.pathname}?paid=1`,
      };
      const session = await api.createCheckout(payload);
      if (!session?.checkout_url) throw new Error('No checkout_url returned');
      cart.clear();
      window.location.href = session.checkout_url;
    } catch (err) {
      toast(err.message || 'Checkout failed', 'error');
      btn.disabled = false;
      btn.textContent = 'Continue to payment';
    }
  });

  $('#auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = String(fd.get('email') || '').trim();
    const name = String(fd.get('name') || '').trim();
    const otp = String(fd.get('otp') || '').trim();
    const btn = $('#btn-auth-submit');
    btn.disabled = true;

    try {
      if (state.authStep === 'email') {
        btn.textContent = 'Sending…';
        await api.requestOtp({ email, name });
        state.authStep = 'otp';
        state.authEmail = email;
        $('#otp-step').classList.remove('hidden');
        $('#btn-resend-otp').classList.remove('hidden');
        btn.textContent = 'Verify & login';
        toast('Code sent to your email', 'success');
      } else {
        btn.textContent = 'Verifying…';
        const res = await api.verifyOtp({ email: state.authEmail || email, otp });
        if (!res?.access_token) throw new Error('No token returned');
        api.setMemberToken(res.access_token);
        state.member = res.member || null;
        updateMemberUI();
        closeModal('auth-modal');
        toast('Welcome back!', 'success');
        e.target.reset();
        state.authStep = 'email';
        $('#otp-step').classList.add('hidden');
        navigate('portal');
      }
    } catch (err) {
      toast(err.message || 'Auth failed', 'error');
    } finally {
      btn.disabled = false;
      if (state.authStep === 'email') btn.textContent = 'Send login code';
      else btn.textContent = 'Verify & login';
    }
  });

  $('#btn-resend-otp').addEventListener('click', async () => {
    const email = state.authEmail || new FormData($('#auth-form')).get('email');
    if (!email) return;
    try {
      await api.requestOtp({ email: String(email) });
      toast('Code resent', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('paid') === '1') {
    toast('Payment complete — thank you!', 'success');
    history.replaceState({}, '', window.location.pathname);
  }

  bootstrap();
})();
