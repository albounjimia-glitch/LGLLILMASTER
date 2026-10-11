# Implementation Plan: Fix Product Add & Dashboard Currency

## Overview
Fix product creation failure and update currency display to MAD across admin dashboard.

## Current Issues

### 1. Product API uses wrong client
**File:** `src/app/api/products/route.ts`
- Uses `supabase` (browser client) instead of `supabaseAdmin` (server client)
- This causes INSERT operations to fail due to RLS policies
- Only SELECT should work with regular client

### 2. Dashboard shows $ instead of MAD
**File:** `src/app/admin/dashboard/page.tsx`
- Line 161: Revenue display shows `$` instead of `MAD`
- Line 217: Order total shows `$` instead of `MAD`
- Line 267: Product price shows `$` instead of `MAD`

## Implementation Steps

### Step 1: Fix Products API to use supabaseAdmin
**File:** `src/app/api/products/route.ts`

```typescript
// Change import from:
import { supabase } from '@/integrations/supabase/client';

// To:
import { supabaseAdmin } from '@/integrations/supabase/server';

// Change all supabase references to supabaseAdmin:
// - Line 9: supabase → supabaseAdmin
// - Line 37: supabase → supabaseAdmin
```

### Step 2: Update Dashboard Currency to MAD
**File:** `src/app/admin/dashboard/page.tsx`

```tsx
// Line 161: Revenue card
// Change from:
<p className="text-3xl font-bold text-white">${stats.revenue.toFixed(2)}</p>
// To:
<p className="text-3xl font-bold text-white">{stats.revenue.toFixed(2)} MAD</p>

// Line 217: Order total
// Change from:
<p><span className="font-medium">Total:</span> ${order.total.toFixed(2)}</p>
// To:
<p><span className="font-medium">Total:</span> {order.total.toFixed(2)} MAD</p>

// Line 267: Product price in table
// Change from:
<td className="py-4 font-semibold text-[#e94560]">${product.price.toFixed(2)}</td>
// To:
<td className="py-4 font-semibold text-[#e94560]">{product.price.toFixed(2)} MAD</td>
```

## Risks and Considerations
- supabaseAdmin bypasses RLS - ensure only server-side API routes use it
- All price displays should be consistent with MAD currency

## Testing & Verification
- Test adding a new product from admin panel
- Verify dashboard shows MAD currency correctly
- Verify products appear in storefront after creation
