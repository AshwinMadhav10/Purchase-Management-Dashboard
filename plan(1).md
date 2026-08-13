# Purchase Management Dashboard --- Development Plan

## Assignment Goal

Build a professional ERP-style **Purchase Management Dashboard** using:

-   **Frontend:** HTML, CSS, JavaScript
-   **Backend:** PHP
-   **Database:** None
-   **Communication:** Frontend ↔ PHP through REST-style APIs using
    `fetch()` / AJAX
-   **Deployment:** Vercel
-   **Source Code:** GitHub

The assignment specifically requires Purchase Orders, Supplier Master,
Item Master, API-based frontend/backend communication, validation,
dynamic PO item rows, real-time calculations, and deployment/submission
links.

> **Important:** The original assignment PDF does not define a Customer
> Master section. However, the assignment description provided
> separately requires **Customers**, so a Customer Master should be
> included in the implementation.

------------------------------------------------------------------------

# Phase 1 --- Requirement Analysis & Feature Breakdown

### Tasks

-   [ ] Read and understand the complete assignment requirements.
-   [ ] Identify all required modules:
    -   [ ] Dashboard
    -   [ ] Purchase Orders
    -   [ ] Suppliers
    -   [ ] Items
    -   [ ] Customers
-   [ ] Identify all Purchase Order header fields.
-   [ ] Identify all Purchase Order item-detail fields.
-   [ ] Identify all Purchase Order summary calculations.
-   [ ] Identify required actions:
    -   [ ] Save as Draft
    -   [ ] Submit
    -   [ ] Edit
    -   [ ] Delete
    -   [ ] Cancel
-   [ ] Identify Supplier CRUD requirements.
-   [ ] Identify Item CRUD requirements.
-   [ ] Identify Customer CRUD requirements from the overall assignment
    requirement.
-   [ ] Identify all frontend/backend API requirements.
-   [ ] Identify validation requirements.
-   [ ] Identify deployment and submission requirements.

### Requirement Reference

The PDF defines the ERP-style sidebar, Dashboard, Purchase Orders,
Suppliers and Items, with the sidebar remaining consistent across
sections. fileciteturn0file0L15-L25

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 2 --- Project Architecture & Folder Structure

### Tasks

-   [ ] Decide on a clean frontend/backend architecture.
-   [ ] Separate frontend files from PHP API files.
-   [ ] Create the project root.
-   [ ] Create frontend directories.
-   [ ] Create backend/API directories.
-   [ ] Create data/mock-data storage without using a database.
-   [ ] Create reusable JavaScript modules.
-   [ ] Create reusable CSS components.
-   [ ] Create common PHP utilities.
-   [ ] Create API response/validation helpers.
-   [ ] Define naming conventions.
-   [ ] Define API endpoint naming conventions.

### Suggested Structure

``` text
purchase-management-dashboard/
│
├── frontend/
│   ├── index.html
│   ├── pages/
│   │   ├── dashboard.html
│   │   ├── purchase-orders.html
│   │   ├── create-purchase-order.html
│   │   ├── suppliers.html
│   │   ├── items.html
│   │   └── customers.html
│   │
│   ├── css/
│   │   ├── main.css
│   │   ├── dashboard.css
│   │   ├── forms.css
│   │   └── tables.css
│   │
│   └── js/
│       ├── api.js
│       ├── common.js
│       ├── dashboard.js
│       ├── purchase-orders.js
│       ├── suppliers.js
│       ├── items.js
│       └── customers.js
│
├── backend/
│   ├── api/
│   │   ├── dashboard.php
│   │   ├── purchase-orders.php
│   │   ├── suppliers.php
│   │   ├── items.php
│   │   └── customers.php
│   │
│   ├── config/
│   │   └── config.php
│   │
│   ├── helpers/
│   │   ├── response.php
│   │   └── validation.php
│   │
│   └── data/
│       ├── purchase_orders.json
│       ├── suppliers.json
│       ├── items.json
│       └── customers.json
│
├── README.md
└── vercel.json
```

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 3 --- Frontend Base Layout & ERP Dashboard UI

### Tasks

-   [ ] Create the main application layout.
-   [ ] Build a fixed/consistent sidebar.
-   [ ] Add Dashboard menu.
-   [ ] Add Purchase Orders menu.
-   [ ] Add Masters menu.
-   [ ] Add Suppliers under Masters.
-   [ ] Add Items under Masters.
-   [ ] Add Customers under Masters.
-   [ ] Make Masters expandable/collapsible.
-   [ ] Build a reusable top/header area.
-   [ ] Build responsive content area.
-   [ ] Add professional ERP-style styling.
-   [ ] Add buttons, badges, cards and tables.
-   [ ] Make navigation consistent across pages.
-   [ ] Verify the UI does not look like a basic HTML page.

### Dashboard Tasks

-   [ ] Create Total Purchase Orders card.
-   [ ] Create Draft Purchase Orders card.
-   [ ] Create Pending Purchase Orders card.
-   [ ] Create Completed Purchase Orders card.
-   [ ] Add purchase-order status chart/graph.
-   [ ] Add loading states.
-   [ ] Add empty states.
-   [ ] Add error states.

The PDF specifically asks for summary cards for Total, Draft, Pending
and Completed Purchase Orders and allows a status chart.
fileciteturn0file0L27-L36

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 4 --- Backend Foundation & API Layer

### Tasks

-   [ ] Set up PHP backend.
-   [ ] Configure JSON request handling.
-   [ ] Configure JSON responses.
-   [ ] Create common API response format.
-   [ ] Create validation helper functions.
-   [ ] Create ID generation helper.
-   [ ] Create PO number generation logic.
-   [ ] Create supplier code generation logic.
-   [ ] Create item code generation logic.
-   [ ] Create customer ID/code generation logic.
-   [ ] Implement GET request handling.
-   [ ] Implement POST request handling.
-   [ ] Implement PUT/PATCH-style update handling.
-   [ ] Implement DELETE request handling.
-   [ ] Handle invalid requests.
-   [ ] Handle missing fields.
-   [ ] Handle invalid JSON.
-   [ ] Return appropriate success/error messages.

### API Principle

The PDF requires the frontend to send data to PHP, PHP to
validate/process it, return JSON, and then have JavaScript update the
UI. fileciteturn0file0L148-L157

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 5 --- Supplier Master

### Tasks

-   [ ] Create Supplier page.
-   [ ] Create Supplier form.
-   [ ] Add automatically generated Supplier ID.
-   [ ] Add Supplier Code.
-   [ ] Add Supplier Name.
-   [ ] Add Contact Person.
-   [ ] Add Phone.
-   [ ] Add Email.
-   [ ] Add Address.
-   [ ] Add Tax/VAT Number.
-   [ ] Add Payment Terms.
-   [ ] Add Status.
-   [ ] Create Add Supplier API.
-   [ ] Create Get Suppliers API.
-   [ ] Create Update Supplier API.
-   [ ] Create Delete Supplier API.
-   [ ] Connect form to PHP API using `fetch()`.
-   [ ] Display suppliers in a table.
-   [ ] Add Edit action.
-   [ ] Add Delete action.
-   [ ] Add Supplier search.
-   [ ] Add frontend validation.
-   [ ] Add backend validation.
-   [ ] Display success/error messages.
-   [ ] Test CRUD operations.

The PDF requires Supplier CRUD, search, system-generated supplier ID and
the listed supplier fields. fileciteturn0file0L110-L128

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 6 --- Item Master

### Tasks

-   [ ] Create Item Master page.
-   [ ] Create Item form.
-   [ ] Generate Item Code automatically.
-   [ ] Add Item Name.
-   [ ] Add Description.
-   [ ] Add Category.
-   [ ] Add Unit.
-   [ ] Add Purchase Price.
-   [ ] Add Tax.
-   [ ] Add Status.
-   [ ] Create Add Item API.
-   [ ] Create Get Items API.
-   [ ] Create Update Item API.
-   [ ] Create Delete Item API.
-   [ ] Connect Item form to PHP API.
-   [ ] Display items in a table.
-   [ ] Add Edit action.
-   [ ] Add Delete action.
-   [ ] Add Item search.
-   [ ] Add frontend validation.
-   [ ] Add backend validation.
-   [ ] Test CRUD operations.

The PDF requires Item CRUD, search, automatically generated Item Code
and the listed item fields. fileciteturn0file0L130-L147

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 7 --- Customer Master

> This phase is included because the overall assignment description
> requires **Customers**, although the supplied PDF does not define
> Customer Master fields.

### Tasks

-   [ ] Decide the Customer Master fields.
-   [ ] Create Customer page.
-   [ ] Create Customer form.
-   [ ] Generate Customer ID/code automatically.
-   [ ] Add Customer Name.
-   [ ] Add Contact Person.
-   [ ] Add Phone.
-   [ ] Add Email.
-   [ ] Add Address.
-   [ ] Add Tax/VAT Number if required.
-   [ ] Add Status.
-   [ ] Create Customer CRUD APIs.
-   [ ] Connect frontend to PHP backend.
-   [ ] Add Customer search.
-   [ ] Add Edit action.
-   [ ] Add Delete action.
-   [ ] Add frontend validation.
-   [ ] Add backend validation.
-   [ ] Test Customer CRUD.

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 8 --- Purchase Order List

### Tasks

-   [ ] Create Purchase Order page.
-   [ ] Create Purchase Order table.
-   [ ] Display PO Number.
-   [ ] Display PO Date.
-   [ ] Display Supplier.
-   [ ] Display Total Amount.
-   [ ] Display Status.
-   [ ] Display Created By.
-   [ ] Add Actions column.
-   [ ] Add View action.
-   [ ] Add Edit action.
-   [ ] Add Delete action.
-   [ ] Create Get Purchase Orders API.
-   [ ] Connect list to PHP backend.
-   [ ] Add search/filter if useful.
-   [ ] Add status badges.
-   [ ] Add empty state.
-   [ ] Add loading state.

The PDF explicitly specifies the Purchase Order List and these suggested
columns/actions. fileciteturn0file0L37-L51

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 9 --- Create Purchase Order: Header

### Tasks

-   [ ] Create Purchase Order form.
-   [ ] Generate unique PO Number automatically.
-   [ ] Add PO Date.
-   [ ] Load Supplier options from Supplier Master API.
-   [ ] Add Expected Delivery Date.
-   [ ] Add Reference Number.
-   [ ] Add Payment Terms.
-   [ ] Add Delivery Location.
-   [ ] Add Notes.
-   [ ] Add form validation.
-   [ ] Validate required fields.
-   [ ] Validate date fields.
-   [ ] Prevent invalid submission.

The required PO header fields are defined on pages 3--4 of the
assignment. fileciteturn0file0L53-L66

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 10 --- Purchase Order: Dynamic Item Details

### Tasks

-   [ ] Create item-detail table inside PO form.
-   [ ] Add Item selector/popup.
-   [ ] Load items from Item Master API.
-   [ ] Auto-fill Item Code.
-   [ ] Auto-fill Description.
-   [ ] Allow Description editing.
-   [ ] Add Quantity.
-   [ ] Validate Quantity \> 0.
-   [ ] Auto-fill Unit.
-   [ ] Load Unit Price from Item Master.
-   [ ] Allow Unit Price editing.
-   [ ] Add Discount.
-   [ ] Define discount handling consistently as percentage or amount.
-   [ ] Add Tax percentage.
-   [ ] Calculate Line Total automatically.
-   [ ] Add Add Item button.
-   [ ] Allow multiple item rows.
-   [ ] Add Remove Item button for every row.
-   [ ] Prevent invalid/empty item rows.
-   [ ] Recalculate totals whenever quantity/price/discount/tax changes.

The assignment requires dynamic multiple item rows and data retrieval
from Item Master. fileciteturn0file0L69-L82

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 11 --- Purchase Order Calculations & Summary

### Tasks

-   [ ] Calculate Subtotal.
-   [ ] Calculate Total Discount.
-   [ ] Calculate Total Tax.
-   [ ] Add Additional Charges.
-   [ ] Calculate Grand Total.
-   [ ] Update calculations in real time using JavaScript.
-   [ ] Ensure calculations update after adding an item.
-   [ ] Ensure calculations update after removing an item.
-   [ ] Ensure calculations update after editing quantity.
-   [ ] Ensure calculations update after editing price.
-   [ ] Ensure calculations update after discount changes.
-   [ ] Ensure calculations update after tax changes.
-   [ ] Prevent NaN/invalid numerical values.
-   [ ] Format currency values consistently.

The PDF requires Subtotal, Total Discount, Total Tax, optional
Additional Charges and Grand Total. fileciteturn0file0L85-L93

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 12 --- Purchase Order Save, Submit, Edit & Delete

### Tasks

-   [ ] Implement Save as Draft.
-   [ ] Set status to `Draft`.
-   [ ] Implement Submit.
-   [ ] Set submitted PO status appropriately.
-   [ ] Implement Edit.
-   [ ] Load existing PO data into the form.
-   [ ] Allow editing of required fields.
-   [ ] Recalculate totals after editing.
-   [ ] Implement Delete.
-   [ ] Ask for delete confirmation.
-   [ ] Implement Cancel/Back.
-   [ ] Send final PO data to PHP backend using `fetch()`.
-   [ ] Validate PO on backend before saving.
-   [ ] Return JSON success/error response.
-   [ ] Refresh Purchase Order list after save/submit/edit/delete.
-   [ ] Show user-friendly notifications.

The required PO actions are Save as Draft, Submit, Edit, Delete and
Cancel. fileciteturn0file0L94-L100

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 13 --- Backend Purchase Order Validation

### Tasks

-   [ ] Validate PO number.
-   [ ] Validate PO date.
-   [ ] Validate supplier.
-   [ ] Validate expected delivery date.
-   [ ] Validate item list.
-   [ ] Validate at least one item exists.
-   [ ] Validate quantity \> 0.
-   [ ] Validate numeric price.
-   [ ] Validate discount.
-   [ ] Validate tax.
-   [ ] Validate additional charges.
-   [ ] Recalculate/verify totals on the backend.
-   [ ] Prevent invalid data from being saved.
-   [ ] Return structured JSON errors.
-   [ ] Test invalid requests directly against the PHP API.

The assignment explicitly states that the backend must validate all
fields before saving. fileciteturn0file0L103-L109

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 14 --- Dashboard API Integration

### Tasks

-   [ ] Create Dashboard API.
-   [ ] Calculate Total Purchase Orders.
-   [ ] Calculate Draft Purchase Orders.
-   [ ] Calculate Pending Purchase Orders.
-   [ ] Calculate Completed Purchase Orders.
-   [ ] Return dashboard statistics as JSON.
-   [ ] Connect dashboard JavaScript to API.
-   [ ] Display real API values in summary cards.
-   [ ] Connect chart to API data.
-   [ ] Test dashboard after creating/editing/deleting POs.

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 15 --- Complete Frontend ↔ Backend Integration Testing

### Tasks

-   [ ] Test Supplier → PHP API → response → UI.
-   [ ] Test Item → PHP API → response → UI.
-   [ ] Test Customer → PHP API → response → UI.
-   [ ] Test PO → PHP API → response → UI.
-   [ ] Test Item selection → Item API → PO form.
-   [ ] Test Supplier selection → Supplier API → PO form.
-   [ ] Test Dashboard → Dashboard API → cards.
-   [ ] Verify no major functionality exists only in JavaScript.
-   [ ] Verify PHP receives and processes submitted data.
-   [ ] Verify all APIs return valid JSON.
-   [ ] Verify API errors are handled in the frontend.
-   [ ] Test invalid form submissions.
-   [ ] Test duplicate/invalid identifiers.
-   [ ] Test empty data scenarios.
-   [ ] Test refresh/reload behavior.

The assignment specifically warns not to implement everything only in
JavaScript and requires frontend/backend API communication.
fileciteturn0file0L148-L161

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 16 --- UI/UX Polish

### Tasks

-   [ ] Make the dashboard look like a real ERP application.
-   [ ] Ensure consistent spacing.
-   [ ] Ensure consistent typography.
-   [ ] Ensure consistent buttons.
-   [ ] Ensure consistent form controls.
-   [ ] Ensure consistent table styling.
-   [ ] Add status badges.
-   [ ] Add confirmation dialogs.
-   [ ] Add toast/alert messages.
-   [ ] Add loading indicators.
-   [ ] Add empty states.
-   [ ] Add API error states.
-   [ ] Check desktop responsiveness.
-   [ ] Check tablet responsiveness.
-   [ ] Check mobile responsiveness.
-   [ ] Check sidebar behavior.
-   [ ] Check modal/popup behavior.
-   [ ] Check long supplier/item lists.
-   [ ] Check PO forms with many item rows.

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 17 --- Full Functional Testing

### Tasks

-   [ ] Test Dashboard.
-   [ ] Test Supplier Add.
-   [ ] Test Supplier Edit.
-   [ ] Test Supplier Delete.
-   [ ] Test Supplier Search.
-   [ ] Test Item Add.
-   [ ] Test Item Edit.
-   [ ] Test Item Delete.
-   [ ] Test Item Search.
-   [ ] Test Customer Add.
-   [ ] Test Customer Edit.
-   [ ] Test Customer Delete.
-   [ ] Test Customer Search.
-   [ ] Test PO creation.
-   [ ] Test multiple PO item rows.
-   [ ] Test item removal.
-   [ ] Test calculations.
-   [ ] Test Save as Draft.
-   [ ] Test Submit.
-   [ ] Test Edit.
-   [ ] Test Delete.
-   [ ] Test Cancel.
-   [ ] Test validation.
-   [ ] Test API failures.
-   [ ] Test browser console for JavaScript errors.
-   [ ] Test PHP errors/logs.
-   [ ] Test all navigation links.
-   [ ] Test page refreshes.
-   [ ] Test deployment build/runtime behavior.

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 18 --- Code Cleanup & Architecture Review

### Tasks

-   [ ] Remove unused code.
-   [ ] Remove duplicate JavaScript.
-   [ ] Remove duplicate CSS.
-   [ ] Remove debug `console.log()` statements.
-   [ ] Remove unnecessary PHP output.
-   [ ] Check PHP error handling.
-   [ ] Check JavaScript error handling.
-   [ ] Check naming consistency.
-   [ ] Check folder structure.
-   [ ] Check reusable functions/components.
-   [ ] Check API endpoint organization.
-   [ ] Check JSON data structure.
-   [ ] Check security basics for API input handling.
-   [ ] Verify no database dependency exists.
-   [ ] Verify frontend/backend separation is clear.
-   [ ] Add comments only where useful.

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 19 --- GitHub Repository & Documentation

### Tasks

-   [ ] Create GitHub repository.
-   [ ] Add complete source code.
-   [ ] Add `.gitignore`.
-   [ ] Add README.md.
-   [ ] Explain project purpose.
-   [ ] Explain features.
-   [ ] Explain frontend technologies.
-   [ ] Explain backend technologies.
-   [ ] Explain API architecture.
-   [ ] Explain folder structure.
-   [ ] Explain how to run locally.
-   [ ] Document API endpoints.
-   [ ] Add sample API request/response examples.
-   [ ] Add screenshots.
-   [ ] Add known limitations if applicable.
-   [ ] Commit cleanly.
-   [ ] Push final code.
-   [ ] Verify repository can be cloned and run.

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 20 --- Vercel Deployment & Final Submission

### Tasks

-   [ ] Prepare the project for Vercel.
-   [ ] Configure Vercel deployment files if required.
-   [ ] Verify PHP/API runtime compatibility in the deployment
    environment.
-   [ ] Deploy the project.
-   [ ] Open the deployed application.
-   [ ] Test Dashboard on deployed environment.
-   [ ] Test Supplier APIs on deployed environment.
-   [ ] Test Item APIs on deployed environment.
-   [ ] Test Customer APIs on deployed environment.
-   [ ] Test Purchase Order APIs on deployed environment.
-   [ ] Test create/edit/delete operations.
-   [ ] Test API requests from the deployed frontend.
-   [ ] Check browser console.
-   [ ] Check deployed API responses.
-   [ ] Verify no local-only paths are being used.
-   [ ] Verify the final UI works correctly.
-   [ ] Copy the live Vercel deployment link.
-   [ ] Copy the GitHub repository link.
-   [ ] Prepare final submission.

The assignment requires deployment on Vercel, verification of the
deployed application, and submission of both the live deployment link
and GitHub repository link. fileciteturn0file0L162-L169

### Completion

**Status:** Completed ✅

------------------------------------------------------------------------

# Phase 21 --- Final Submission Checklist

### Functionality

-   [ ] Dashboard works.
-   [ ] Purchase Orders work.
-   [ ] Suppliers work.
-   [ ] Items work.
-   [ ] Customers work.
-   [ ] Purchase Order creation works.
-   [ ] Multiple items can be added.
-   [ ] Items can be removed.
-   [ ] PO totals calculate correctly.
-   [ ] Draft functionality works.
-   [ ] Submit functionality works.
-   [ ] Edit functionality works.
-   [ ] Delete functionality works.
-   [ ] Backend validation works.
-   [ ] Frontend/backend APIs work.

### UI

-   [ ] ERP-style dashboard.
-   [ ] Consistent sidebar.
-   [ ] Professional forms.
-   [ ] Professional tables.
-   [ ] Responsive layout.
-   [ ] Clear success/error messages.

### Technical

-   [ ] HTML/CSS/JavaScript frontend.
-   [ ] PHP backend.
-   [ ] No database.
-   [ ] API-based communication.
-   [ ] Clear architecture.
-   [ ] Clean code.
-   [ ] README available.
-   [ ] GitHub repository available.
-   [ ] Vercel deployment available.

### Submission

-   [ ] Final GitHub link ready.
-   [ ] Final Vercel link ready.
-   [ ] Final application manually tested.
-   [ ] Final source code pushed.
-   [ ] README updated.
-   [ ] No unfinished TODOs.
-   [ ] No unnecessary files.
-   [ ] No debug/test data that should not be submitted.

### Final Status

**Status:** Completed ✅

------------------------------------------------------------------------

# Progress Tracking Rule

After finishing a phase, update **only that phase's Completion
section**.

Change:

``` text
**Status:** Completed ✅
```

to:

``` text
**Status:** Completed ✅
```

Do this immediately after completing each phase.

## Example

``` text
# Phase 5 — Supplier Master

...

### Completion

**Status:** Completed ✅
```

Do **not** mark a phase as completed until all tasks inside that phase
have been tested and are working.

------------------------------------------------------------------------

# Recommended Development Order

Follow the phases in this order:

1.  Phase 1 --- Requirement Analysis
2.  Phase 2 --- Architecture
3.  Phase 3 --- Base UI
4.  Phase 4 --- PHP API Foundation
5.  Phase 5 --- Supplier Master
6.  Phase 6 --- Item Master
7.  Phase 7 --- Customer Master
8.  Phase 8 --- Purchase Order List
9.  Phase 9 --- PO Header
10. Phase 10 --- PO Item Details
11. Phase 11 --- PO Calculations
12. Phase 12 --- PO Actions
13. Phase 13 --- Backend Validation
14. Phase 14 --- Dashboard API
15. Phase 15 --- Integration Testing
16. Phase 16 --- UI/UX Polish
17. Phase 17 --- Functional Testing
18. Phase 18 --- Code Cleanup
19. Phase 19 --- GitHub + README
20. Phase 20 --- Vercel Deployment
21. Phase 21 --- Final Submission

------------------------------------------------------------------------

# Overall Project Status

**Current Progress: 21 / 21 phases completed**

**Overall Status: Completed ✅**
