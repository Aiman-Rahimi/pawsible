# 🐾 Pawsible — Pet Adoption Platform

A full-stack pet adoption web application built with Next.js 14, TypeScript, PostgreSQL, and Prisma. Built as a portfolio project to demonstrate full-stack development skills.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss)

---

## ✨ Features (Current)

- 🔐 **Authentication** — Role-based auth with NextAuth.js (Admin, Moderator, Adopter)
- 🐶 **Pet Listings** — Browse, search, and filter pets by species, age, gender, and traits
- 📋 **Adoption Requests** — Submit and track adoption applications with status updates
- 📊 **Admin Dashboard** — Analytics, charts (Recharts), and request management
- 🏆 **Leaderboard & Points** — Gamification system to reward active users
- 📸 **Photo Upload** — Cloudinary integration for pet photo uploads
- 👤 **User Profiles** — Personal profile with adoption history

---

## 🚀 Planned Features

> This project is actively being developed. The following features are coming soon:

- [ ] 🔔 **Real-time Notifications** — Get notified when your adoption request is approved/rejected
- [ ] 🤖 **AI Pet Matching** — Answer a few questions and get matched with your perfect pet
- [ ] 💬 **Comments & Reviews** — Leave reviews after adopting a pet
- [ ] ❤️ **Favorites** — Save and revisit pets you love
- [ ] 🌙 **Dark Mode** — Toggle between light and dark theme
- [ ] 📧 **Email Notifications** — Email updates on request status changes
- [ ] 🗺️ **Shelter Map** — View shelter locations on a map

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js |
| Styling | Tailwind CSS + Inline Styles |
| Charts | Recharts |
| Image Upload | Cloudinary |
| Fonts | Fraunces + Cabinet Grotesk |

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account (free)

### Installation

1. **Clone the repo**
```bash
   git clone https://github.com/YOUR_USERNAME/pawsible.git
   cd pawsible
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/pawsible"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"

   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

4. **Set up the database**
```bash
   npx prisma migrate dev
   npx prisma db seed
```

5. **Run the development server**
```bash
   npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

---

## 👤 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@pawsible.com | admin123 |
| Moderator | mod@pawsible.com | admin123 |
| User | rahimi@gmail.com | 12345678 |

---

## 📁 Project Structure
```
pawsible/
├── app/
│   ├── api/          # API routes
│   ├── auth/         # Login & Register pages
│   ├── pets/         # Pet listing & detail pages
│   ├── adoption/     # Adoption request pages
│   ├── dashboard/    # Admin dashboard
│   ├── leaderboard/  # Points leaderboard
│   └── profile/      # User profile
├── components/       # Reusable components
├── lib/              # Utilities & helpers
├── prisma/           # Database schema & seed
└── types/            # TypeScript types
```

---

## 🔐 Role Permissions

| Feature | Admin | Moderator | User |
|---|---|---|---|
| Browse Pets | ✅ | ✅ | ✅ |
| Add Pet | ✅ | ✅ | ❌ |
| Edit Pet | ✅ | ✅ | ❌ |
| Delete Pet | ✅ | ❌ | ❌ |
| Submit Adoption Request | ❌ | ❌ | ✅ |
| Approve/Reject Requests | ✅ | ✅ | ❌ |
| View Dashboard | ✅ | ✅ | ❌ |

---

## 📄 License

This project is open source.

---

Built with ❤️ as Rahimi's portfolio project.
