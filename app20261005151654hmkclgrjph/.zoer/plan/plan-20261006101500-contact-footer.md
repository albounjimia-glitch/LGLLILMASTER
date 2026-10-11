# Implementation Plan: Homepage Footer & Admin Login Updates

## Overview
1. Update homepage footer with contact information (email and phone)
2. Hide demo credentials from admin login page

## Implementation Steps

### Step 1: Update Homepage Footer Contact Info
**File:** `src/app/page.tsx`

**Change:** Replace placeholder contact info with user-provided values

```tsx
// Replace:
<div>
  <h4 className="font-semibold mb-4">Contact</h4>
  <ul className="space-y-2 text-gray-400">
    <li>Email: info@lgllilmaster.com</li>
    <li>Phone: +1 234 567 890</li>
    <li>Cash on Delivery Available</li>
  </ul>
</div>

// With:
<div>
  <h4 className="font-semibold mb-4">Contact</h4>
  <ul className="space-y-2 text-gray-400">
    <li>Email: lgllilmaster999@gmail.com</li>
    <li>Phone: 0778593726</li>
    <li>Cash on Delivery Available</li>
  </ul>
</div>
```

### Step 2: Remove Demo Credentials from Admin Login
**File:** `src/app/admin/page.tsx` - Lines 106-110

**Change:** Remove the demo credentials section

```tsx
// Remove this entire block:
<div className="mt-6 p-4 bg-gray-50 rounded-lg">
  <p className="text-sm text-gray-500 text-center">
    Demo credentials: admin@lgllilmaster.com / lgllilmaster321@@
  </p>
</div>
```

## Testing & Verification
- Verify footer displays correct email and phone number
- Verify admin login page no longer shows demo credentials
- Ensure Cash on Delivery message remains unchanged
