# Third-party storefront (Tech with Dunamix)

Standalone HTML / CSS / JS store using Sell4Me public APIs.

## Run

```bash
cd third-party-store
python3 -m http.server 8080
```

Open http://localhost:8080

Backend must be reachable at the URL in `js/config.js` (default `http://localhost:5040`).

## Config

Edit `js/config.js`:

| Key | Purpose |
|---|---|
| `apiBase` | Sell4Me API base |
| `apiKey` | Bearer key for `/v1/products`, `/v1/categories` |
| `storeId` | UUID for checkout + membership (auto-refreshed from product payload) |
| `storeUsername` | Display / branding |

## Features

- Product catalog + category chips + search
- Cart drawer + key-less `POST /checkout/`
- Membership plans (public list)
- Member email-OTP login
- Subscribe with product picker (respects `max_products`)
- Member portal: pause / resume / cancel, deliveries

## API map

| Action | Endpoint | Auth |
|---|---|---|
| List products | `GET /v1/products` | Bearer API key |
| Categories | `GET /v1/categories` | Bearer API key |
| Checkout | `POST /checkout/` | none |
| List plans | `GET /v1/membership/plans?store_id=` | none |
| Request OTP | `POST /v1/membership/auth/request-otp` | none |
| Verify OTP | `POST /v1/membership/auth/verify-otp` | none |
| Subscribe | `POST /v1/membership/subscribe` | member JWT |
| My subs | `GET /v1/membership/subscriptions` | member JWT |
