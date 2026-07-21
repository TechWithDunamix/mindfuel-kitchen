const config = {
  apiBase: import.meta.env.VITE_SELL4ME_API_URL || 'https://api.sell4me.store',
  apiKey: import.meta.env.VITE_SELL4ME_API_KEY || '',
  storeId: import.meta.env.VITE_SELL4ME_STORE_ID || '',
  storeName: import.meta.env.VITE_SELL4ME_STORE_NAME || 'MindFuel Kitchen',
  storeUsername: import.meta.env.VITE_SELL4ME_STORE_USERNAME || '',
  currency: import.meta.env.VITE_SELL4ME_CURRENCY || 'usd',
  memberTokenKey: 'mfk_member_token',
  memberNameKey: 'mfk_member_name',
  cartKey: 'mfk_cart',
} as const

export default config
