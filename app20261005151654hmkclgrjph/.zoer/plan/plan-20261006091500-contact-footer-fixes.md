# Implementation Plan: Contact Info Update & Currency Fixes

## Overview
Update the homepage footer with the user's contact information and fix currency display issues in cart and checkout pages.

## Implementation Steps

### Step 1: Update Homepage Footer Contact Info
**File:** `src/app/page.tsx` - Line 136-142

**Change:** Replace placeholder contact info with user-provided values
- Email: `lgllilmaster999@gmail.com`
- Phone: `0778593726`

```tsx
// Change from:
<div>
  <h4 className="font-semibold mb-4">Contact</h4>
  <ul className="space-y-2 text-gray-400">
    <li>Email: info@lgllilmaster.com</li>
    <li>Phone: +1 234 567 890</li>
    <li>Cash on Delivery Available</li>
  </ul>
</div>

// To:
<div>
  <h4 className="font-semibold mb-4">Contact</h4>
  <ul className="space-y-2 text-gray-400">
    <li>Email: lgllilmaster999@gmail.com</li>
    <li>Phone: 0778593726</li>
    <li>Cash on Delivery Available</li>
  </ul>
</div>
```

### Step 2: Fix Currency Display in Cart Page
**File:** `src/app/cart/page.tsx` - Line 69

**Change:** Remove erroneous `$` before MAD currency display

```tsx
// Change from:
<p className="font-bold text-[#e94560] mt-1">
  ${item.product.price.toFixed(2)} MAD
</p>

// To:
<p className="font-bold text-[#e94560] mt-1">
  {item.product.price.toFixed(2)} MAD
</p>
```

### Step 3: Fix Currency Display in Checkout Page
**File:** `src/app/checkout/page.tsx` - Line 238

**Change:** Remove erroneous `$` before MAD currency display

```tsx
// Change from:
<p className="text-sm font-semibold text-[#e94560]">
  ${item.product.price.toFixed(2)} MAD x {item.quantity}
</p>

// To:
<p className="text-sm font-semibold text-[#e94560]">
  {item.product.price.toFixed(2)} MAD x {item.quantity}
</p>
```

## Risks and Considerations
- All changes are straightforward string replacements
- No logic changes, no risk of breaking functionality
- Currency display consistency across pages

## Testing & Verification
- Verify homepage footer shows correct email and phone
- Verify cart page displays prices as "XX.XX MAD" without `$` symbol
- Verify checkout page displays prices as "XX.XX MAD x QTY" without `$` symbol
