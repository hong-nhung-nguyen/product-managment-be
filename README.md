# Product Management System

A server-rendered product catalogue and administration system built with Node.js, Express, MongoDB, Mongoose, and Pug. It combines a customer-facing catalogue and checkout flow with a role-based admin panel for managing products, categories, staff accounts, permissions, and general site settings.

> The repository directory is named `product-managment-be` (with “management” misspelled). Use that exact name in terminal commands.

## Features

### Admin panel

- Dashboard totals for products, categories, admin accounts, and customers
- Product management with search, filters, sorting, pagination, featured flags, bulk actions, soft deletion, and position ordering
- Nested product-category management
- Cloudinary uploads for product images, category images, account avatars, and the site logo
- Admin account and profile management
- Roles and granular permissions for products, categories, roles, permissions, and accounts
- General website settings
- Rich-text product descriptions through TinyMCE
- Cookie-based admin authentication

### Customer-facing application

- Active product listing, category browsing, product details, and keyword search
- Discounted-price calculation
- Cookie-backed shopping cart with add, update, and remove actions
- Checkout and order confirmation
- Registration, login, logout, and profile display
- Password recovery using an emailed, time-limited OTP
- Persistent carts that are associated with a customer after login

## Tech stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| Web framework | Express 5 |
| Database | MongoDB with Mongoose |
| Templates | Pug |
| Styling | Custom CSS and Bootstrap loaded by the templates |
| Uploads | Multer, Cloudinary, and Streamifier |
| Email | Nodemailer with Gmail |
| Rich-text editing | TinyMCE |
| Authentication | Cookies, database tokens, and MD5 password hashes |
| Development | Nodemon |

## Requirements

- Node.js **20.19 or newer** (required by the installed Mongoose version)
- npm
- A MongoDB database
- A Cloudinary account for image uploads
- A Gmail account and app password for password-recovery emails

## Getting started

1. Enter the application directory:

   ```bash
   cd product-managment-be
   ```

2. Install the locked dependencies:

   ```bash
   npm ci
   ```

3. Create `product-managment-be/.env`:

   ```dotenv
   PORT=3000
   MONGO_URL=mongodb://127.0.0.1:27017/product-management

   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_KEY=your_cloudinary_api_key
   CLOUD_SECRET=your_cloudinary_api_secret

   EMAIL_USER=your_gmail_address
   EMAIL_PASSWORD=your_gmail_app_password
   ```

   A MongoDB Atlas connection string can be used for `MONGO_URL`. Keep `.env` private; it is already ignored by Git.

4. Start the development server:

   ```bash
   npm start
   ```

5. Open:

   - Admin login: `http://localhost:3000/admin/auth/login`
   - Product catalogue: `http://localhost:3000/products`
   - Customer login: `http://localhost:3000/user/login`

The root URL currently redirects to the admin login page.

## Initial admin setup

The project does not include seed data or an admin-registration screen. Before signing in, create these MongoDB records manually:

1. A document in `roles`, with the permissions the admin should receive.
2. A document in `accounts` whose `role_id` is the role document’s `_id`, whose `status` is `"active"`, and whose `deleted` value is `false`.
3. Store the account password as an MD5 hash, because the current login controller compares `md5(submittedPassword)` with the stored value.

The permission names used by the UI are:

```text
products-category_view
products-category_create
products-category_edit
products-category_delete
products_view
products_create
products_edit
products_delete
roles_view
roles_create
roles_edit
roles_delete
permissions_view
permissions_edit
accounts_view
accounts_create
accounts_edit
accounts_delete
```

An account also needs a unique `token` string for its authentication cookie.

## Main routes

### Customer routes

| Route | Purpose |
| --- | --- |
| `/products` | List active products |
| `/products/:slugCategory` | Browse a category and its descendants |
| `/products/detail/:slugProduct` | View product details |
| `/search?keyword=...` | Search active products by title |
| `/cart` | View and update the current cart |
| `/checkout` | Enter customer details and place an order |
| `/user/register` | Create a customer account |
| `/user/login` | Sign in |
| `/user/password/forgot` | Start OTP password recovery |
| `/user/info` | View the authenticated customer profile |

### Admin routes

All admin management routes require an authenticated account.

| Route | Purpose |
| --- | --- |
| `/admin/dashboard` | Statistics dashboard |
| `/admin/products` | Product management |
| `/admin/products-category` | Category management |
| `/admin/roles` | Role management |
| `/admin/roles/permissions` | Permission assignment |
| `/admin/accounts` | Admin account management |
| `/admin/my-account` | Current admin profile |
| `/admin/setting/general` | General site settings |

## Project structure

```text
product-managment-be/
├── config/          # Database connection and admin-prefix configuration
├── controllers/
│   ├── admin/       # Back-office request handlers
│   └── client/      # Catalogue, cart, checkout, and customer handlers
├── helpers/         # Pagination, trees, pricing, search, mail, and utilities
├── middlewares/
│   ├── admin/       # Admin authentication and Cloudinary uploads
│   └── client/      # Customer, cart, category, and settings context
├── models/          # Mongoose schemas
├── public/          # Browser JavaScript, CSS, and static images
├── routes/
│   ├── admin/       # Routes mounted below /admin
│   └── client/      # Customer-facing routes
├── validates/       # Request validation middleware
├── views/
│   ├── admin/       # Admin Pug templates
│   └── client/      # Customer Pug templates
├── index.js         # Express application entry point
└── vercel.json      # Vercel rewrite configuration
```

## Data collections

The application uses these MongoDB collections:

- `accounts` — admin users
- `roles` — admin roles and permission arrays
- `users` — customer accounts
- `products` — catalogue products
- `products-catgory` — product categories (the spelling is intentional in the model)
- `carts` — cookie- or customer-associated carts
- `orders` — checkout snapshots
- `forgot-password` — expiring OTP records
- `setting-general` — site-wide contact and branding settings

Products, categories, accounts, users, roles, and orders use soft-deletion fields rather than being removed immediately.

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Run `index.js` with Nodemon and the Node inspector |
| `npm test` | Placeholder only; no automated test suite is configured |

## Current implementation notes

- `index.js` starts with Express Session deprecation warnings because `secret`, `resave`, and `saveUninitialized` are not configured. Add them before production use, and load the secret from an environment variable such as `SESSION_SECRET`.
- Passwords are currently hashed with MD5. MD5 is not suitable for password storage; migrate to a slow password hash such as Argon2 or bcrypt before production use.
- Authentication tokens are stored in cookies without explicit `httpOnly`, `secure`, or `sameSite` settings.
- The default session store is in memory and is intended only for development.
- Checkout records orders but does not process online payments or send fulfilment notifications.
- The Vercel rewrite is present, but the app calls `app.listen()` directly and uses in-memory sessions. Deployment may require adapting the Express entry point and using a persistent session store.
- There is no automated test suite, lint command, database seed, or migration system yet.

## License

This package is currently declared as ISC in `package.json`.
