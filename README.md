# ÉLIXIR HAUTE BEAUTÉ · 2027 NEXT-GENERATION LUXURY SALON PLATFORM

An international luxury salon atelier and aesthetic sanctuary digital platform. Engineered for 2027 with haute couture editorial design, cinematic animations, atomic double-booking prevention, and a comprehensive executive administration studio.

---

## ✨ Features & Architecture

- **Next-Generation Editorial Aesthetics**: Deep Charcoal (`#111111`), Champagne Gold (`#C8A46A`), and Soft Beige (`#E8DDCE`) color architecture with custom typography (*Playfair Display* & *Plus Jakarta Sans*).
- **Cinematic Interactions**: Animated monogram preloader, fine-pointer interactive custom cursor, ambient lighting, and before/after metamorphosis comparison slider.
- **7-Step High-Performance Booking Engine**:
  1. *Choose Rituals*: Multi-service selection with dynamic price & duration accumulation.
  2. *Artisan Selection*: Choose specific master stylist or "Any Available Stylist".
  3. *Calendar Date*: Interactive month view with real-time disabled days and holidays.
  4. *Time Slots*: 30-minute intervals calculated from opening hours, stylist schedules, break times, and existing bookings.
  5. *Client Dossier*: Guest bookings without forced registration.
  6. *Review*: Transparent summary of durations, prices, and policies.
  7. *Instant Confirmation*: Atomic transaction (`prisma.$transaction`) with real-time availability check, reference code (`ELX-2027-XXXX`), printable pass, and WhatsApp concierge link.
- **Atomic Conflict Prevention**: Prevents concurrent duplicate reservations with ACID database isolation.
- **Patron Portal (`/dashboard`)**: Active reservations, booking pass display, live rescheduling, and cancellation with reason logging.
- **Executive Admin Studio (`/admin`)**: Live KPI metrics, monthly revenue trends, appointment management, service CRUD, stylist scheduling, and salon parameters.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & custom luxury utility classes
- **Animations**: Framer Motion & CSS hardware-accelerated animations
- **Database & ORM**: Prisma ORM with SQLite
- **Icons**: Lucide Icons
- **Celebration Effects**: Canvas Confetti
- **Authentication**: JWT HTTP-Only cookie sessions with bcrypt password hashing

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/krishanprageeth0/ELIXIR-HAUTE-BEAUTE.git
cd ELIXIR-HAUTE-BEAUTE
npm install
```

### 2. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Default configuration:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="elixir-haute-beaute-secret-luxury-key-2027"
```

### 3. Database Initialization & Seeding
```bash
npx prisma db push
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Access Credentials

| Portal | Email | Password | Access Route |
| :--- | :--- | :--- | :--- |
| **Admin Studio** | `admin@elixir.luxury` | `admin123` | [`/admin`](http://localhost:3000/admin) |
| **Patron Portal** | `client@demo.com` | `client123` | [`/dashboard`](http://localhost:3000/dashboard) |
| **Guest Booking** | Any guest email | *No password needed* | [`/book`](http://localhost:3000/book) |

---

## 🏛️ Page Routes Catalog

- `/` – Cinematic Homepage & Brand Narrative
- `/services` – Haute Rituals Menu with category filtering & sorting
- `/services/[slug]` – Deep-dive treatment protocol & artisan pairing
- `/stylists` – Master Stylists & Artistic Directors
- `/gallery` – Visual Archive & Before/After Lightbox
- `/about` – Heritage & Penthouse Architecture
- `/contact` – Concierge Desk & Bespoke Inquiries
- `/book` – 7-Step Appointment Reservation Engine
- `/booking-confirmation/[id]` – Permanent Digital Pass & Printable Receipt
- `/dashboard` – Customer Account & Reservation Management
- `/admin` – Executive Administration & Studio Management
- `/auth/login` – Patron & Staff Authentication

---

## 📄 License
© 2027 ÉLIXIR HAUTE BEAUTÉ. All rights reserved.
