# Implementation Plan: WhatsApp Notifications, Currency Change, Admin Password & Image Upload

## Overview
1. Add WhatsApp notification when order is placed (sends to Moroccan number 0778593726)
2. Replace dollar ($) with Moroccan Dirham (MAD) across all pages
3. Update admin login password to: lgllilmaster321@@
4. Add image upload feature for products (file picker from phone gallery)

## Current State Analysis

### Admin Password
- File: `src/app/api/auth/route.ts`
- Current password check: `password === 'admin123'`

### WhatsApp Integration
- Orders API at `src/app/api/orders/route.ts`
- Will add WhatsApp notification using wa.me URL format

### Currency Display
Files to update for currency change ($ to MAD):
- `src/app/page.tsx` - Product prices on homepage
- `src/app/cart/page.tsx` - Cart summary
- `src/app/checkout/page.tsx` - Order summary
- `src/app/product/[id]/page.tsx` - Product detail page
- `src/components/ProductCard.tsx` - Product cards
- `src/app/admin/products/new/page.tsx` - Price label

### Image Upload for Products
- File: `src/app/admin/products/new/page.tsx`
- Currently uses text input for image URLs
- Need to add file input with image preview

## Implementation Steps

### Step 1: Update Admin Password
**File:** `src/app/api/auth/route.ts`

Change line 22:
```typescript
// From:
let isValid = password === 'admin123';
// To:
let isValid = password === 'lgllilmaster321@@';
```

Also update the demo credentials hint in `src/app/admin/page.tsx` line 109:
```typescript
// From: admin@lgllilmaster.com / admin123
// To: admin@lgllilmaster.com / lgllilmaster321@@
```

### Step 2: Add WhatsApp Notification to Orders API
**File:** `src/app/api/orders/route.ts`

Add at the top of the file:
```typescript
// WhatsApp notification function
async function sendWhatsAppNotification(order: {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: Array<{
    product_name: string;
    quantity: number;
    size: string;
    color: string;
  }>;
  total: number;
}) {
  const whatsappNumber = process.env.WHATSAPP_NUMBER;
  if (!whatsappNumber) {
    console.log('WhatsApp number not configured');
    return;
  }

  const itemsList = order.items
    .map((item) => `• ${item.product_name} (x${item.quantity}) - Size: ${item.size}, Color: ${item.color}`)
    .join('\n');

  const message = `🛒 *New Order!*

*Order ID:* ${order.id.slice(0, 8).toUpperCase()}
*Customer:* ${order.customer_name}
*Phone:* ${order.customer_phone}
*Address:* ${order.customer_address}

*Items:*
${itemsList}

*Total:* ${order.total} MAD`;

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  console.log('WhatsApp notification URL:', whatsappUrl);
}
```

After successful order creation (after clearing cart), call:
```typescript
// Send WhatsApp notification
await sendWhatsAppNotification({ id: order.id, customer_name, customer_phone, customer_address, items: orderItems, total });
```

### Step 3: Add Environment Variable
**File:** `.env.user`

Add:
```
WHATSAPP_NUMBER=0778593726
```

### Step 4: Replace Currency Display

#### A. Update cart/page.tsx
- Line 69: `$${item.product.price.toFixed(2)}` → `${item.product.price.toFixed(2)} MAD`
- Line 107, 115: `$${totalPrice.toFixed(2)}` → `${totalPrice.toFixed(2)} MAD`

#### B. Update checkout/page.tsx
- Line 238: `$${item.product.price.toFixed(2)}` → `${item.product.price.toFixed(2)} MAD`
- Line 248, 256: `$${totalPrice.toFixed(2)}` → `${totalPrice.toFixed(2)} MAD`

#### C. Update admin/products/new/page.tsx
- Line 99: Price label change from `Price ($)` to `Price (MAD)`

#### D. Check ProductCard and product detail page
- Update any remaining `$` displays to `MAD`

### Step 5: Add Image Upload for Products
**File:** `src/app/admin/products/new/page.tsx`

Add state for uploaded images:
```typescript
const [uploadedImages, setUploadedImages] = useState<string[]>([]);
const [uploading, setUploading] = useState(false);
```

Add file input component (replace current image URL input):
```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Product Images
  </label>
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleImageUpload}
      className="hidden"
      id="image-upload"
    />
    <label htmlFor="image-upload" className="cursor-pointer">
      <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">Click to upload images from your phone</p>
      <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</p>
    </label>
  </div>
  {uploadedImages.length > 0 && (
    <div className="flex gap-2 mt-3 flex-wrap">
      {uploadedImages.map((url, index) => (
        <div key={index} className="relative w-20 h-20">
          <Image src={url} alt={`Preview ${index}`} fill className="object-cover rounded" />
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>
```

Add upload handler:
```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  setUploading(true);
  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setUploadedImages(prev => [...prev, url]);
      }
    }
  } catch (error) {
    toast.error('Failed to upload images');
  } finally {
    setUploading(false);
  }
};
```

Note: This requires creating an `/api/upload` endpoint or using a service like Cloudinary. For simplicity, we can use base64 data URLs as a fallback for small images.

## Environment Variables

Add to `.env.user`:
```
WHATSAPP_NUMBER=0778593726
```

## Testing & Verification
1. Test admin login at /admin with new password
2. Place test order and verify WhatsApp URL is generated in logs
3. Check all pages display "MAD" instead of "$"
4. Test product creation with image upload from phone
