# ERP-Style Purchase Management Dashboard

A modern, responsive, professional ERP-style Purchase Management Dashboard built using a clean frontend/backend architecture with zero database dependencies. All data is persisted server-side via JSON files with robust CRUD, backend validation, real-time calculations, and dynamic tables.

## 🚀 Deployed Link
*   **Live Link:** [https://purchase-management-dashboard.vercel.app](https://purchase-management-dashboard.vercel.app) *(Deploy on Vercel to activate)*

---

## 🎨 Key Features

1.  **Dashboard Overview:**
    *   Dynamic summary cards for *Total*, *Draft*, *Pending*, and *Completed* Purchase Orders.
    *   Live purchase order value status chart (rendered via **Chart.js**).
    *   Recent Purchase Orders table.
    *   Stat counters for Master tables.

2.  **Purchase Order Lifecycle:**
    *   **Create/Edit Purchase Order Form:**
        *   Unique PO Number auto-generation.
        *   Supplier dropdown loaded dynamically from the Supplier Master.
        *   Dynamic item details table allowing users to dynamically add, edit, and remove rows.
        *   Interactive Item selection with real-time autosearch and auto-fill of Item Code, Unit, Unit Price, and Tax.
        *   Live calculations (Subtotal, Tax, Discount, Additional Charges, Grand Total) computed instantly in the browser.
        *   Save as **Draft** or **Submit PO** options.
    *   **PO Listing Table:**
        *   List view with columns for PO #, date, supplier, delivery date, grand total, status, and creator.
        *   Status filtering tabs (All, Draft, Pending, Completed, Cancelled).
        *   Search by PO # or supplier name.
        *   Actions to **View**, **Edit**, and **Delete** POs.

3.  **Supplier Master (CRUD):**
    *   Automatically generated Supplier ID/Code.
    *   Supplier information management (Name, Contact, Phone, Email, Address, Tax Number, Payment Terms, Status).
    *   Inline modal for creation/update and search filters.

4.  **Item Master (CRUD):**
    *   Automatically generated Item Code.
    *   Item details (Name, Category, Description, Unit, Purchase Price, Tax %, Status).
    *   Search and filter.

5.  **Customer Master (CRUD):**
    *   Automatically generated Customer ID/Code.
    *   Customer details (Name, Contact, Phone, Email, Address, Tax Number, Status).
    *   Search and filter.

6.  **Backend JSON Database:**
    *   Reads and writes data from static JSON database storage files in `backend/data/`.
    *   Full server-side request verification and validation.

---

## 📂 Project Structure

```text
purchase-management-dashboard/
│
├── frontend/
│   ├── index.html                   # Root index/redirection page
│   ├── css/
│   │   └── main.css                 # Consolidated ERP dashboard styling
│   ├── js/
│   │   ├── api.js                   # Fetch wrappers for PHP API communication
│   │   ├── common.js                # Shared UI controls (Modals, Toasts, Confirm Dialogs)
│   │   ├── sidebar.js               # Dynamic sidebar generator/injector
│   │   ├── dashboard.js             # Dashboard view logic
│   │   ├── purchase-orders.js       # PO list view logic
│   │   ├── create-purchase-order.js # PO creation/edit logic
│   │   ├── suppliers.js             # Suppliers CRUD logic
│   │   ├── items.js                 # Items CRUD logic
│   │   └── customers.js             # Customers CRUD logic
│   └── pages/
│       ├── dashboard.html
│       ├── purchase-orders.html
│       ├── create-purchase-order.html
│       ├── suppliers.html
│       ├── items.html
│       └── customers.html
│
├── backend/
│   ├── config/
│   │   └── config.php               # CORS headers, base data directory paths
│   ├── data/
│   │   ├── suppliers.json           # JSON Database stores
│   │   ├── items.json
│   │   ├── customers.json
│   │   └── purchase_orders.json
│   ├── helpers/
│   │   ├── response.php             # Unified JSON success/error response formats
│   │   └── validation.php           # Common request validations & sanitizations
│   └── api/
│       ├── dashboard.php            # Dashboard stats endpoint
│       ├── suppliers.php            # Suppliers API endpoint (GET/POST/PUT/DELETE)
│       ├── items.php                # Items API endpoint (GET/POST/PUT/DELETE)
│       ├── customers.php            # Customers API endpoint (GET/POST/PUT/DELETE)
│       └── purchase-orders.php      # Purchase Orders API endpoint (GET/POST/PUT/DELETE)
│
├── vercel.json                      # Vercel Serverless PHP Runtime configuration
└── README.md
```

---

## 🛠️ API Documentation

All API endpoints consume and return JSON.

### 1. Dashboard API (`GET /backend/api/dashboard.php`)
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Success",
      "data": {
        "total_po": 12,
        "draft_po": 4,
        "pending_po": 5,
        "completed_po": 3,
        "cancelled_po": 0,
        "total_value": 45890.5,
        "total_suppliers": 8,
        "total_items": 15,
        "total_customers": 4,
        "status_chart": [...]
      }
    }
    ```

### 2. Supplier Master API (`/backend/api/suppliers.php`)
*   **`GET`:** List all suppliers. Optional search query parameter `?q=searchterm`.
*   **`POST`:** Create a new supplier.
    *   *Payload:* `{ "name": "...", "contact_person": "...", "phone": "...", "email": "...", "address": "...", "tax_number": "...", "payment_terms": "...", "status": "Active" }`
*   **`PUT` (`?id=SUP0001`):** Edit supplier with given ID.
*   **`DELETE` (`?id=SUP0001`):** Delete supplier with given ID.

### 3. Item Master API (`/backend/api/items.php`)
*   **`GET`:** List all items. Optional search query parameter `?q=searchterm`.
*   **`POST`:** Create a new item.
    *   *Payload:* `{ "name": "...", "description": "...", "category": "...", "unit": "Pcs", "purchase_price": 450.00, "tax": 18, "status": "Active" }`
*   **`PUT` (`?id=ITM0001`):** Edit item.
*   **`DELETE` (`?id=ITM0001`):** Delete item.

### 4. Customer Master API (`/backend/api/customers.php`)
*   **`GET`:** List all customers. Optional search query parameter `?q=searchterm`.
*   **`POST`:** Create a new customer.
    *   *Payload:* `{ "name": "...", "contact_person": "...", "phone": "...", "email": "...", "address": "...", "tax_number": "...", "status": "Active" }`
*   **`PUT` (`?id=CUS0001`):** Edit customer.
*   **`DELETE` (`?id=CUS0001`):** Delete customer.

### 5. Purchase Order API (`/backend/api/purchase-orders.php`)
*   **`GET`:** List all POs. Filter by status `?status=Draft`. Search `?q=searchterm`. Get details of a single PO `?id=PO0001`.
*   **`POST`:** Create a new Purchase Order. Performs server-side validation and recalculates all line totals and summaries.
    *   *Payload:*
        ```json
        {
          "po_date": "2026-08-13",
          "supplier_id": "SUP0001",
          "supplier_name": "ABC Traders",
          "expected_delivery_date": "2026-08-25",
          "reference_number": "REF-001",
          "payment_terms": "Net 30",
          "delivery_location": "Main Warehouse",
          "notes": "Fragile items",
          "additional_charges": 150.00,
          "status": "Draft",
          "items": [
            {
              "item_id": "ITM0001",
              "item_code": "IC0001",
              "item_name": "Office Chair",
              "description": "Ergonomic chair",
              "quantity": 10,
              "unit": "Pcs",
              "unit_price": 2500.00,
              "discount": 5.0,
              "tax": 18.0
            }
          ]
        }
        ```
*   **`PUT` (`?id=PO0001`):** Edit Purchase Order.
*   **`DELETE` (`?id=PO0001`):** Delete Purchase Order.

---

## 💻 Running Locally

To run the application locally on your computer:

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd purchase-management-dashboard
    ```
2.  **Start a PHP Development Server:**
    Since the backend uses PHP, you need PHP installed on your computer. Start the development server from the root of the project:
    ```bash
    php -S localhost:8000
    ```
3.  **Access the Dashboard:**
    Open your web browser and navigate to:
    ```text
    http://localhost:8000/frontend/
    ```

---

## ⚡ Deployment to Vercel

The application is pre-configured for Vercel using the standard serverless PHP community runtime.

1.  **Install Vercel CLI (if not installed):**
    ```bash
    npm install -g vercel
    ```
2.  **Deploy from Project Root:**
    ```bash
    vercel
    ```
3.  Choose options to link to your project and verify/approve deployment.
