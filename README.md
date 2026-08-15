# 🛍️ LootKart - Modern E-Commerce Online Portal

[![React 18](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![Vite 5](https://img.shields.io/badge/Vite-5.2.11-646CFF.svg)](https://vitejs.dev/)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3.svg)](https://getbootstrap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**LootKart** is an industry-grade, feature-packed online e-commerce application built with **React 18**, **Vite 5**, and **Bootstrap 5**. It provides a fast, responsive shopping experience with Indian Rupee (INR) pricing, real-time search & multi-facet filtering, wishlist persistence, order history with live delivery tracking, dark/light theme switching, and interactive checkout order placement.

---

## ✨ Key Features

- ⚡ **Vite 5 Build Engine**: Instantaneous dev server startup (~1.0s) and production builds (zero legacy Webpack errors on Node 20/24).
- 🇮🇳 **Indian Rupee (INR) Pricing**: All product prices and subtotals formatted in INR (`₹`) using `Intl.NumberFormat("en-IN")`.
- 🔍 **Real-Time Search & Advanced Filters**: 
  - Header search bar for instant title searching as you type.
  - Category filter pills (*All Items*, *Electronics*, *Jewelery*, *Men's Wear*, *Women's Wear*).
  - Price Range slider (₹0 to ₹1,00,000) & Customer Rating filters (4★ & above).
  - Sorting controls (*Featured*, *Price: Low to High*, *Price: High to Low*, *Top Rated*).
- ❤️ **Wishlist Management**: Save products to a persistent wishlist (`WishlistContext`) with header counter badge.
- 📦 **Order History & Live Order Tracking (`/orders`)**: Save completed purchases and view an interactive 4-step delivery progress timeline (*Order Placed ➔ In Transit ➔ Out for Delivery ➔ Delivered*).
- 💳 **Interactive Multi-Step Checkout Modal**:
  - Shipping & delivery address form.
  - Payment method selection (*UPI / GPay*, *Credit/Debit Card*, *Cash on Delivery*).
  - Coupon discount input (enter code **`LOOT10`** for an extra 10% OFF).
  - Order success confirmation screen with unique Order ID (`#LK-XXXXXX`).
- 🔑 **Authentication & User Profiles (`/login`)**:
  - Tabbed Sign In and Register forms.
  - Social sign-in simulation (Google & Mobile OTP).
  - Header user profile dropdown (*"Hi, Subham 👋"*, *My Orders*, *Logout*).
- 🌓 **Dark / Light Theme System**: Dynamic theme switch in navbar header backed by custom CSS variables (`data-theme="dark"`).
- 🍞 **Floating Toast Notifications**: Instant popups on cart and wishlist interactions.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18.3, React DOM 18.3, Vite 5.2
- **Routing**: React Router DOM 6.23
- **Styling & UI**: React Bootstrap 2.10, Bootstrap 5.3, FontAwesome Free 6.5, Google Font (*Plus Jakarta Sans*)
- **State Management**: React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `ThemeContext`, `OrderContext`)
- **API & Data**: Axios 1.7, FakeStore API

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Subham2050/LootKartApp.git
   cd LootKartApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm start
   # or
   npm run dev
   ```
   Open `http://localhost:3000` (or the port output in terminal) to view LootKart in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```
   Generates optimized static production bundle inside the `dist/` directory.

---

## 📂 Folder Structure

```text
LootKartApp/
├── index.html                 # Main entry HTML template
├── vite.config.js             # Vite configuration & dev server options
├── package.json               # Project dependencies & npm scripts
└── src/
    ├── main.jsx                # Application root entry point
    ├── App.jsx                 # Global routes & Provider wrappers
    ├── index.css               # Design system tokens & dark mode overrides
    ├── Product.css             # Card sizing & title truncation rules
    ├── components/
    │   ├── Header.jsx          # Top announcement bar, navbar, search & theme toggle
    │   ├── Footer.jsx          # Responsive footer links & copyright
    │   ├── Product.jsx         # Product card with discount badge & wishlist heart
    │   ├── Rating.jsx          # Accessible star rating component
    │   ├── HeroBanner.jsx      # Promotional deals slider & offer highlights
    │   ├── CheckoutModal.jsx   # Shipping address, payment & order confirmation modal
    │   └── ToastNotification.jsx # Floating notification toast
    ├── context/
    │   ├── AuthContext.jsx     # User authentication & session state
    │   ├── CartContext.jsx     # Shopping cart state & quantity calculations
    │   ├── WishlistContext.jsx # Wishlist state & localStorage persistence
    │   ├── ThemeContext.jsx    # Dark/Light mode theme state
    │   └── OrderContext.jsx    # Order history & status state
    ├── screenPages/
    │   ├── HomePage.jsx        # Catalog view with search, filter sidebar & sorting
    │   ├── ProductPage.jsx     # Product details, bank offers & customer reviews
    │   ├── CartPage.jsx        # Shopping cart view & order summary breakdown
    │   ├── WishlistPage.jsx    # Saved items wishlist view
    │   ├── LoginPage.jsx       # Tabbed Sign In & Register view
    │   └── OrdersPage.jsx      # Past orders list & live delivery progress stepper
    └── utils/
        └── formatCurrency.js   # USD to INR currency formatting helper
```

---

## 🏷️ Sample Promo Codes

- **`LOOT10`**: Applies **10% OFF** instant coupon discount at checkout.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
