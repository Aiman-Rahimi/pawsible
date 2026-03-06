# 🐾 Pawsible — Pet Adoption Platform

A fullstack pet adoption platform built with **Next.js 14 + TypeScript + PostgreSQL + Prisma**.

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | Next.js 14 (App Router), React 18 |
| Language    | TypeScript                        |
| Styling     | Tailwind CSS                      |
| Database    | PostgreSQL                        |
| ORM         | Prisma                            |
| Auth        | NextAuth.js (Credentials)         |
| File Upload | Cloudinary                        |
| Charts      | Recharts                          |
| Icons       | Lucide React                      |

---

## Project Structure

```
pawsible/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth + register
│   │   ├── pets/          # Pet CRUD + [id]
│   │   ├── adoption/      # Requests + [id] review
│   │   ├── dashboard/     # Admin analytics
│   │   ├── leaderboard/   # Points leaderboard
│   │   └── upload/        # Cloudinary upload
│   ├── auth/login/        # Login page
│   ├── auth/register/     # Register page
│   ├── pets/              # Pets list, detail, new, edit
│   ├── adoption/          # Admin requests + my requests
│   ├── dashboard/         # Admin dashboard
│   ├── leaderboard/       # Points leaderboard
│   └── profile/           # User profile
├── components/
│   ├── Navbar.tsx
│   ├── PetCard.tsx
│   ├── PetForm.tsx
│   ├── AdoptionRequestCard.tsx
│   ├── ChartDashboard.tsx
│   └── Providers.tsx
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── auth.ts            # NextAuth config
│   ├── points.ts          # Gamification utils
│   └── api.ts             # API helpers
├── prisma/
│   ├── schema.prisma      # Full schema
│   └── seed.ts            # Demo data
└── types/index.ts         # Shared TypeScript types
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL, NEXTAUTH_SECRET, and Cloudinary keys
```

### 3. Setup database
```bash
# Push schema to DB
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Run development server
```bash
npm run dev
# Open http://localhost:3000
```

---

## Demo Accounts

| Role      | Email                    | Password   |
|-----------|--------------------------|------------|
| Admin     | admin@pawsible.com       | admin123   |
| Moderator | mod@pawsible.com         | admin123   |
| Adopter   | alice@example.com        | user123    |

---

## Features

### Roles
- **Admin/Shelter Staff** — Full CRUD for pets, approve/reject adoption requests, analytics dashboard
- **Moderator** — Add/edit pets, review requests  
- **Adopter** — Browse pets, submit requests, track status

### Pages
| Route               | Description                            | Access       |
|---------------------|----------------------------------------|--------------|
| `/`                 | Landing page                           | Public       |
| `/pets`             | Pet listing with search & filters      | Public       |
| `/pets/[id]`        | Pet detail + adoption form             | Auth to adopt|
| `/pets/new`         | Add new pet                            | Admin/Mod    |
| `/pets/[id]/edit`   | Edit pet                               | Admin/Mod    |
| `/adoption`         | All adoption requests                  | Admin/Mod    |
| `/adoption/mine`    | My adoption requests                   | Authenticated|
| `/dashboard`        | Admin analytics dashboard              | Admin/Mod    |
| `/leaderboard`      | Points leaderboard                     | Public       |
| `/profile`          | User profile + activity                | Authenticated|
| `/auth/login`       | Sign in                                | Public       |
| `/auth/register`    | Create account                         | Public       |

### Gamification Points
| Action              | Points |
|---------------------|--------|
| Profile complete    | +50    |
| First request       | +100   |
| Request approved    | +200   |
| Daily visit         | +5     |
| Pet favorited       | +10    |
| Review left         | +25    |

---

## Database Schema

```
users              — id, name, email, password_hash, role, points
pets               — id, name, breed, species, age, photo_url, status, shelter_id
adoption_requests  — id, user_id, pet_id, status, message, request_date
pet_preferences    — id, user_id, species[], age_min/max, traits[]
activity_logs      — id, user_id, type, points, description
favorites          — id, user_id, pet_id
```

---

## API Routes

| Method | Route                  | Description               | Auth         |
|--------|------------------------|---------------------------|--------------|
| GET    | /api/pets              | List pets (filterable)    | Public       |
| POST   | /api/pets              | Create pet                | Admin/Mod    |
| GET    | /api/pets/[id]         | Get pet detail            | Public       |
| PATCH  | /api/pets/[id]         | Update pet                | Admin/Mod    |
| DELETE | /api/pets/[id]         | Delete pet                | Admin        |
| GET    | /api/adoption          | List requests             | Authenticated|
| POST   | /api/adoption          | Submit request            | Authenticated|
| GET    | /api/adoption/[id]     | Get request               | Authenticated|
| PATCH  | /api/adoption/[id]     | Approve/reject request    | Admin/Mod    |
| DELETE | /api/adoption/[id]     | Cancel request            | Owner/Admin  |
| GET    | /api/dashboard         | Analytics data            | Admin/Mod    |
| GET    | /api/leaderboard       | Top users by points       | Public       |
| POST   | /api/upload            | Upload pet image          | Admin/Mod    |
| POST   | /api/auth/register     | Register user             | Public       |

---

## Deployment

### Vercel + Railway (recommended)
1. Push to GitHub
2. Connect repo to Vercel
3. Create PostgreSQL DB on Railway or Supabase
4. Set environment variables in Vercel dashboard
5. Run `prisma migrate deploy` on first deploy

### Environment Variables
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-32-chars
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
