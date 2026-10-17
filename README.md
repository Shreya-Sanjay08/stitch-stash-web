# Stitch Stash

A custom-built storefront and inventory dashboard for **Stitch Stash**, a handcrafted crochet brand based in the UAE. The owner has 10+ years of artisan experience and 1,000+ custom pieces made.

The site deliberately has **no shopping cart or checkout**. Each piece is handmade or one-of-a-kind, so customers enquire directly through Instagram DM or email, keeping the process personal.

## Features

**Storefront (public)**
- Product grid pulled live from Supabase, with prices in AED
- Real-time search across titles and descriptions
- Filter buttons (All Creations / Available Now)
- Sold-out items are dimmed with a "Sold Out" overlay and a disabled button
- Loading skeletons and an empty state when nothing matches

**Admin dashboard (`/admin`, owner only)**
- Email and password login at `/login`, with no public sign-up
- Add products with an image upload to Supabase Storage
- Change a product's status from a dropdown
- Delete products
- Sign out button

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16.3.8 (App Router) |
| UI | React 18.3.1, Tailwind CSS 3.4 |
| Language | TypeScript |
| Database, auth, storage | Supabase (PostgreSQL, Supabase Auth, Storage) |
| Session handling | `@supabase/ssr` (cookie-based sessions) |
| Hosting (planned) | Vercel (frontend), Supabase Cloud (backend) |

## How the admin area is secured

Two independent locks protect the dashboard:

1. **Route guard.** `proxy.ts` (the Next.js 16 name for middleware) checks the signed-in user on every request to `/admin` and redirects to `/login` if there isn't one. It uses `getUser()`, which verifies the session with Supabase rather than trusting the cookie. `app/admin/layout.tsx` repeats the check on the server as a second lock.
2. **Database rules.** Row Level Security on the `products` table and the `product-images` storage bucket allows the public to **read** only. Insert, update and delete require an authenticated user.

Public sign-ups are disabled in Supabase. The single admin account is created manually in the Supabase dashboard.

## Project structure

```
app/
  page.tsx            Public storefront
  layout.tsx          Root layout
  globals.css
  admin/
    layout.tsx        Server-side auth check
    page.tsx          Inventory manager
  login/
    layout.tsx
    page.tsx          Login form
lib/
  supabaseClient.ts   Browser Supabase client
  supabase/server.ts  Server Supabase client
  types.ts            Product type
proxy.ts              Route guard for /admin and /login
```

## Database

Table `public.products`:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key, `gen_random_uuid()` |
| `title` | text | |
| `description` | text | |
| `price_aed` | numeric | |
| `image_url` | text | Public link in the `product-images` bucket |
| `category` | enum | `bouquets`, `bags`, `wearables`, `plushies`, `other` |
| `status` | text | `available`, `sold_out`, `coming_soon` |
| `created_at` | timestamptz | Defaults to `now()` |

Row Level Security policies:

- `products`: public `SELECT`; `INSERT`, `UPDATE` and `DELETE` for `authenticated` only
- `storage.objects` (bucket `product-images`): public `SELECT`; `INSERT` and `DELETE` for `authenticated` only

## Getting started

**Prerequisites:** Node.js 20 or newer, and a Supabase project with the `products` table and a public `product-images` bucket.

```bash
git clone https://github.com/Shreya-Sanjay08/stitch-stash-web.git
cd stitch-stash-web
npm install
```

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Run the dev server:

```bash
npm run dev
```

Then open http://localhost:3000. Never commit `.env.local`; it is already in `.gitignore`.

### Setting up the admin account

1. In the Supabase dashboard, go to **Authentication > Users > Add user** and create the owner's account (tick "Auto Confirm User").
2. Turn off **Allow new users to sign up** in the authentication settings.
3. Apply the Row Level Security policies described above.
4. Visit `/admin`. You will be redirected to `/login`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |

## Roadmap

- [x] Storefront with search and status filter
- [x] Admin inventory manager
- [x] Supabase Auth with a protected `/admin` and locked-down database rules
- [ ] Instagram DM and pre-filled email inquiry buttons on each product
- [ ] Category filters (bouquets, bags, wearables, plushies, other)
- [ ] "Coming soon" status in the admin and storefront
- [x] Testimonial carousel celebrating the 1,000+ pieces milestone
- [ ] Keep-alive cron route and `vercel.json` to stop the free Supabase database from pausing
- [ ] Real product photography and Vercel deployment

## Notes

- Prices are in AED and the site targets the UAE market only.
- Instagram links cannot carry pre-written messages, so the DM button opens the chat and the email button carries the product name and price.
- Testimonials live in lib/testimonials.ts. Add real customer quotes there; sample slides only appear in development.
