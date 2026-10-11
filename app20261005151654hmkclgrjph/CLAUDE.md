# LGLLILMASTER - Project Documentation

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (Nubase)
- **Authentication**: Supabase Auth (Email + Google OAuth)
- **Styling**: Tailwind CSS
- **State Management**: React Context (CartContext, AuthContext, LanguageContext)

## Project Structure
```
src/
├── app/
│   ├── api/               # API routes
│   │   ├── auth/         # Admin auth endpoint (uses supabaseAdmin)
│   │   ├── products/     # Products API
│   │   └── orders/       # Orders API (uses supabaseAdmin for write operations)
│   ├── auth/callback/    # OAuth callback route
│   ├── admin/            # Admin dashboard
│   ├── cart/             # Shopping cart page
│   ├── checkout/         # Checkout page
│   ├── login/            # Login page
│   ├── product/[id]/     # Product detail page
│   └── signup/           # Signup page
├── components/            # Reusable components
│   ├── LanguageToggle.tsx # Language switcher (EN/AR)
│   └── ThemeToggle.tsx    # Theme switcher (Light/Dark/System)
├── context/
│   ├── AuthContext.tsx   # Authentication state
│   ├── CartContext.tsx   # Cart state
│   └── LanguageContext.tsx # i18n state (EN/AR with RTL support)
├── integrations/supabase/ # Supabase client
│   ├── client.ts         # Browser client (uses localStorage)
│   └── server.ts         # Server client (supabaseAdmin for bypass RLS)
└── types/                # TypeScript types
```

## Core Features

### Language Support (EN/AR)
- Toggle between English and Arabic from header
- RTL layout automatically applied for Arabic
- Persisted in localStorage
- Full translation coverage for all UI text

### Theme Support
- Light, Dark, and System modes
- Toggle accessible from header
- Uses next-themes for smooth transitions

### Authentication
- **Supabase Auth** for user management
- Email/password login and signup
- **Google OAuth** integration
- AuthContext for global auth state
- Automatic profile creation on signup

### Order System
- Checkout flow with delivery information
- Orders created via `/api/orders` using supabaseAdmin client (bypasses RLS)
- Cash on Delivery payment
- Order confirmation with order ID

### Database Tables
- `products` - Product catalog
- `orders` - Order records (RLS: SELECT only for public; INSERT via supabaseAdmin)
- `order_items` - Order line items (RLS: SELECT only for public; INSERT via supabaseAdmin)
- `profiles` - User profiles (auto-created via trigger)
- `users` - Custom users table for admin auth (uses supabaseAdmin)

### Cart System
- Client-side cart using CartContext
- Persists via localStorage
- Supports size and color selection
- Quantity management

### Admin
- Separate admin login at /admin
- Uses custom users table (NOT Supabase Auth)
- Product management capabilities
- Order management

## Environment Variables
- `NEXT_PUBLIC_DATABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_DATABASE_PUBLISHABLE_KEY` - Supabase anon key
- `DATABASE_URL` - Database connection URL (for supabaseAdmin)
- `DATABASE_SERVICE_ROLE_KEY` - Service role key (for supabaseAdmin)
- `WHATSAPP_NUMBER` - Phone number for order notifications (0778593726)

## Currency
- All prices displayed in **Moroccan Dirham (MAD)**
- Updated from USD across all pages (cart, checkout, product details, product cards)

## WhatsApp Notifications
- Orders trigger WhatsApp notification to configured number
- Notification includes: Order ID, customer details, items, and total
- Uses wa.me URL format for direct WhatsApp messaging

## Product Image Upload
- Admin can upload images directly from phone/PC via file picker
- Supports JPG, PNG, GIF (max 5MB per image)
- Images stored as base64 data URLs
- Preview before saving with remove option

## Product Image Gallery
- Product detail page displays multiple product images
- Navigation arrows (left/right) for browsing images
- Thumbnail strip for quick image selection
- Image counter showing current position
- Full RTL and i18n support

## Maintenance Log
- 2026-10-06: Added multi-image gallery to product detail page
- 2026-10-06: Added WhatsApp order notification to orders API
- 2026-10-06: Changed currency from USD to MAD across all pages
- 2026-10-06: Added image upload for products (base64 data URLs)
- 2026-10-06: Updated admin password to lgllilmaster321@@
- 2026-10-06: Added LanguageContext for EN/AR support with RTL
- 2026-10-06: Added ThemeToggle for Light/Dark/System modes
- 2026-10-06: Fixed orders API to use supabaseAdmin (bypasses RLS for INSERT)
- 2026-10-06: Fixed admin auth API to use supabaseAdmin
- 2026-10-06: Updated cart and checkout pages with translations
- 2026-10-05: Added Google OAuth login and Supabase Auth integration
- 2026-10-05: Created profiles table with RLS policies
- 2026-10-05: Implemented AuthContext for auth state management
- 2026-10-05: Added login/signup pages with email and Google auth options
