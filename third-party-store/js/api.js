(function (global) {
  const cfg = () => global.S4M_CONFIG;

  function memberToken() {
    try {
      return localStorage.getItem(cfg().memberTokenKey) || '';
    } catch {
      return '';
    }
  }

  function setMemberToken(token) {
    try {
      if (token) localStorage.setItem(cfg().memberTokenKey, token);
      else localStorage.removeItem(cfg().memberTokenKey);
    } catch {}
  }

  async function request(path, options = {}) {
    const { auth = 'apiKey', body, headers = {}, method = 'GET' } = options;
    const h = {
      Accept: 'application/json',
      ...headers,
    };

    if (body !== undefined) {
      h['Content-Type'] = 'application/json';
    }

    if (auth === 'apiKey') {
      h.Authorization = `Bearer ${cfg().apiKey}`;
    } else if (auth === 'member') {
      const t = memberToken();
      if (t) h.Authorization = `Bearer ${t}`;
    }

    const res = await fetch(`${cfg().apiBase}${path}`, {
      method,
      headers: h,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let data = null;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { detail: text || res.statusText };
    }

    if (!res.ok) {
      const detail =
        (data && (data.detail || data.message)) ||
        `Request failed (${res.status})`;
      const err = new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  const api = {
    memberToken,
    setMemberToken,
    isMemberLoggedIn: () => Boolean(memberToken()),

    listProducts: (params = {}) => {
      const q = new URLSearchParams();
      if (params.category_slug) q.set('category_slug', params.category_slug);
      if (params.category_id) q.set('category_id', params.category_id);
      const qs = q.toString();
      return request(`/v1/products${qs ? `?${qs}` : ''}`);
    },

    getProduct: (id) => request(`/v1/products/${id}`),

    listCategories: () => request('/v1/categories'),

    createCheckout: (payload) =>
      request('/checkout/', {
        method: 'POST',
        auth: 'none',
        body: payload,
      }),

    listMembershipPlans: () =>
      request(`/v1/membership/plans?store_id=${encodeURIComponent(cfg().storeId)}`, {
        auth: 'none',
      }),

    getMembershipPlan: (planId) =>
      request(
        `/v1/membership/plans/${planId}?store_id=${encodeURIComponent(cfg().storeId)}`,
        { auth: 'none' },
      ),

    requestOtp: ({ email, name }) =>
      request('/v1/membership/auth/request-otp', {
        method: 'POST',
        auth: 'none',
        body: { store_id: cfg().storeId, email, name: name || undefined },
      }),

    verifyOtp: ({ email, otp }) =>
      request('/v1/membership/auth/verify-otp', {
        method: 'POST',
        auth: 'none',
        body: { store_id: cfg().storeId, email, otp },
      }),

    memberMe: () => request('/v1/membership/auth/me', { auth: 'member' }),

    subscribe: ({ plan_id, items }) =>
      request('/v1/membership/subscribe', {
        method: 'POST',
        auth: 'member',
        body: { plan_id, items },
      }),

    listMySubscriptions: () =>
      request('/v1/membership/subscriptions', { auth: 'member' }),

    getMySubscription: (id) =>
      request(`/v1/membership/subscriptions/${id}`, { auth: 'member' }),

    pauseSubscription: (id) =>
      request(`/v1/membership/subscriptions/${id}/pause`, {
        method: 'POST',
        auth: 'member',
      }),

    resumeSubscription: (id) =>
      request(`/v1/membership/subscriptions/${id}/resume`, {
        method: 'POST',
        auth: 'member',
      }),

    cancelSubscription: (id) =>
      request(`/v1/membership/subscriptions/${id}/cancel`, {
        method: 'POST',
        auth: 'member',
      }),

    listMyDeliveries: (subscriptionId) =>
      request(`/v1/membership/subscriptions/${subscriptionId}/deliveries`, {
        auth: 'member',
      }),
  };

  global.S4M_API = api;
})(window);
