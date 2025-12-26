# Plan for Integrating Razorpay & Comprehensive E-Commerce Features

This document outlines the step-by-step plan to integrate high-security payment processing, authentication, and order management into the DesiThreads application.

## Core Philosophy
- **Security First:** No client-side order creation. Strict signature verification on the backend.
- **Data Integrity:** Database acts as the single source of truth for prices and inventory.
- **Scalability:** Modular code structure to allow easy swapping of delivery providers later.

---

## Phase 1: Database Schema & Authentication
We need to upgrade the database to support users, carts, and complex orders.

### 1.1 Supabase Tables
Run the following SQL additions (I will provide a file `schema_update.sql`):

1.  **`profiles`**: Linked to `auth.users`. Stores phone, address, display name.
2.  **`carts`**: One per user.
3.  **`cart_items`**: Links products to carts with quantity.
4.  **`orders`**: Stores final order details, payment status (`pending`, `paid`, `failed`), total amount, and Razorpay `order_id`.
5.  **`order_items`**: Snapshot of products at time of purchase.
6.  **`payments`**: Audit log for every Razorpay interaction (payment_id, signature, status).

### 1.2 Authentication
- Enable **Google Provider** in Supabase dashboard (User action required later).
- We will use `@supabase/auth-helpers-nextjs` or standard client for managing sessions.
- **RLS Policies:**
    - Users can only read/write their own cart/orders.
    - Admins can read all orders.

---

## Phase 2: Backend Payment Infrastructure
We will create secure API routes in Next.js to communicate with Razorpay.

### 2.1 Dependencies
- Install `razorpay` Node.js SDK.
- Install `crypto` (built-in) for signature verification.

### 2.2 API Routes
1.  **`POST /api/payment/create-order`**:
    - **Input:** `cart_id` (or infer from session).
    - **Logic:**
        - Fetch cart items from DB.
        - Calculate total price on **server** (Sum of `product.price * quantity`). **NEVER trust client price.**
        - Call `razorpay.orders.create({ amount: total * 100, currency: "INR", ... })`.
        - Insert into `orders` table with status `pending`.
    - **Output:** `{ order_id: "order_123", amount: 50000, key: "rzp_test_..." }`

2.  **`POST /api/payment/verify`**:
    - **Input:** `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`.
    - **Logic:**
        - Generate expected signature: `HMAC_SHA256(order_id + "|" + payment_id, secret)`.
        - **Compare** generated signature with received signature.
        - **IF MATCH:**
            - Update `orders` status to `paid`.
            - Decrement `products.stock`.
            - Clear `cart_items`.
            - Send Confirmation Email (Mock for now).
        - **IF MISMATCH:**
            - Log potential fraud.
            - Return 400 Error.

---

## Phase 3: Frontend Integration

### 3.1 Cart Logic
- Create `CartContext` to manage local cart state and sync with Supabase `cart_items`.
- "Add to Cart" button checks auth. If not logged in, prompt login.

### 3.2 Checkout Flow
1.  User clicks "Checkout" in Cart.
2.  **Address Selection:** User selects/adds address (stored in `profiles`).
3.  **Payment Trigger:**
    - Call `/api/payment/create-order`.
    - Initialize Razorpay options:
      ```javascript
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        order_id: data.order_id,
        handler: async function (response) {
            // Call /api/payment/verify
        },
        prefill: { name, email, contact },
        theme: { color: "#ff3f6c" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      ```

---

## Phase 4: Delivery Scaffolding
We will build the *structure* for delivery without tying to a specific vendor.

### 4.1 Delivery Interface
Create `lib/delivery/types.ts`:
```typescript
interface DeliveryProvider {
  createShipment(order: Order): Promise<string>; // Returns tracking ID
  trackShipment(trackingId: string): Promise<Status>;
}
```

### 4.2 Mock Implementation
Create `lib/delivery/mockProvider.ts` that simulates a successful shipment creation.

---

## Execution Steps for User

1.  **Update Database:** I will provide the SQL.
2.  **Env Variables:** User needs to add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
3.  **Code Implementation:** I will implement the Auth context, Cart logic, and Payment API routes.
4.  **Testing:** We will use Razorpay "Test Mode" credentials.

---

## Security Checklist
- [ ] RLS enabled on all new tables.
- [ ] Prices calculated server-side.
- [ ] Signatures verified using `crypto.createHmac`.
- [ ] API routes protected (session check).
