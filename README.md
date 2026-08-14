# Purchase Management Dashboard

A lightweight ERP-style Purchase Management Dashboard for managing suppliers, items, and purchase orders with a clean multi-page frontend.

## Features

- Dashboard with summary cards, status breakdown, and recent purchase orders
- Supplier Master CRUD with search and status tracking
- Item Master CRUD with pricing, tax, and unit details
- Purchase Order creation, editing, filtering, and status workflow
- Auto-generated supplier/item/PO codes
- Real-time purchase order total calculations (subtotal, discount, tax, additional charges, grand total)
- Seed data support through browser localStorage for quick setup
- PHP API endpoints included for backend-based usage/deployment

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend (included):** PHP 8.1
- **Data Storage:**
  - Frontend local mode: browser localStorage
  - Backend mode: JSON files in `backend/data/`
- **Deployment config:** Vercel (`vercel-php`)

## Project Structure

```text
.
├── api/                  # Vercel-ready PHP entry points
├── backend/
│   ├── api/              # Core PHP CRUD APIs
│   ├── config/
│   ├── data/             # JSON data files
│   └── helpers/
├── frontend/
│   ├── css/
│   ├── js/
│   └── pages/
├── index.html            # Root redirect to frontend dashboard
└── vercel.json
```

## Requirements

- Node.js `22.x` (as defined in `package.json`)
- PHP `^8.1` (as defined in `composer.json`)

## Run Locally

### Option 1: Frontend localStorage mode (quick start)

Serve the project with any static server from the repository root:

```bash
npx serve .
```

Then open the shown local URL in your browser.  
The app redirects from `/` to `/frontend/pages/dashboard.html`.

### Option 2: PHP backend mode (API available)

Run the PHP built-in server from the repository root:

```bash
php -S localhost:8000
```

API endpoints are available under:

- `/api/dashboard.php`
- `/api/suppliers.php`
- `/api/items.php`
- `/api/purchase-orders.php`

## Notes

- Current frontend scripts are implemented with localStorage-based data handling for a zero-setup experience.
- Backend JSON files include seed/sample data and can be used for PHP API flows.

## Deployment

This repository includes `vercel.json` configured to run `api/*.php` routes with `vercel-php`.
