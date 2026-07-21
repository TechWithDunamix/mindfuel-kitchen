(function (global) {
  const cfg = () => global.S4M_CONFIG;

  function read() {
    try {
      const raw = localStorage.getItem(cfg().cartKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(cfg().cartKey, JSON.stringify(items));
    global.dispatchEvent(new CustomEvent('s4m:cart', { detail: items }));
  }

  const cart = {
    all: () => read(),

    count: () => read().reduce((n, i) => n + i.quantity, 0),

    total: () =>
      read().reduce((sum, i) => sum + Number(i.price) * i.quantity, 0),

    add(product, qty = 1) {
      const items = read();
      const existing = items.find((i) => i.product_id === product.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        items.push({
          product_id: product.id,
          name: product.name,
          price: Number(product.price),
          currency: product.currency || cfg().currencyFallback,
          image_url: (product.media_urls && product.media_urls[0]) || '',
          quantity: qty,
        });
      }
      write(items);
      return items;
    },

    setQty(productId, quantity) {
      let items = read();
      if (quantity <= 0) {
        items = items.filter((i) => i.product_id !== productId);
      } else {
        const row = items.find((i) => i.product_id === productId);
        if (row) row.quantity = quantity;
      }
      write(items);
      return items;
    },

    remove(productId) {
      write(read().filter((i) => i.product_id !== productId));
    },

    clear() {
      write([]);
    },
  };

  global.S4M_CART = cart;
})(window);
