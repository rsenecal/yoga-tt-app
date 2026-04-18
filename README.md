# YTB Manual — 300-Hour Yoga Teacher Training App

A full-stack web application for the Yoga Tribe Brooklyn 300-Hour Teacher Training program. Built with Next.js, Firebase, and TypeScript.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Styling**: Tailwind CSS + CSS custom properties
- **Fonts**: Cormorant Garamond + DM Sans
- **Icons**: Lucide React

## Features

### Student App
- **Dashboard** — hero banner, progress stats, curriculum quick-access grid
- **Postures** — searchable filterable grid; tabbed detail view with Teaching Dialogue, Alignment, Benefits and Muscles; dialogue rendered as large readable serif text
- **Anatomy** — card grid grouped by category; rich detail view with sub-cards (e.g. individual Mudras with image and description)
- **Philosophy** — same structure as Anatomy with sub-cards support
- **Teaching Guidelines** — module checklist with per-section progress bars; each module opens a modal with description, video, tips, and curated content items with assigned teachers
- **Our Teachers** — responsive card grid with photo and bio
- **Search** — live search across Postures, Anatomy, and Philosophy
- **Bookmarks** — save postures for quick access
- **Progress tracking** — module completion stored in Firebase per anonymous device session

### Admin Panel at /admin
- **Password-protected** — single admin password stored in env, verified server-side
- **Postures** — full CRUD with alignment cues, teaching dialogue editor, benefits, key muscles, video, category, image URL
- **Anatomy and Philosophy** — CRUD with rich text editor and sub-cards editor
- **Team** — manage teacher profiles
- **Modules** — create modules with rich description, video, tips, and a visual content picker to curate items from Postures/Anatomy/Philosophy; assign a teacher to each item
- **Categories** — manage categories for Postures, Anatomy, and Philosophy
- **Images** — paste any public URL (Google Drive, Dropbox, Unsplash); automatic URL normalization

## Project Structure

    app/
      admin/page.tsx              Admin login gate
      api/
        admin-auth/route.ts       Password verification
        admin/add, delete, list, update, upload
        progress/route.ts         Student progress
      globals.css                 Design tokens and fonts
      layout.tsx
      page.tsx

    components/
      AdminPanel.tsx
      YogaApp.tsx                 App shell, routing, state
      pages/
        AnatomyPage.tsx
        HomePage.tsx
        ModulesPage.tsx
        PhilosophyPage.tsx
        PosturesPage.tsx
        TeamPage.tsx
      ui/
        BackButton, CategoryChip, ContentCardGrid
        Pagination, RichContent, RichEditor, VideoPlayer

    lib/
      constants.ts
      fetchData.ts
      firebase.ts
      firebase-admin.ts
      groupAndSort.ts
      types.ts

## Environment Variables

Copy .env.local.example to .env.local and fill in your values:

    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
    FIREBASE_ADMIN_PROJECT_ID=
    FIREBASE_ADMIN_CLIENT_EMAIL=
    FIREBASE_ADMIN_PRIVATE_KEY=
    ADMIN_PASSWORD=your-secure-password-here

## Design System

All colours are CSS variables in app/globals.css:

    --sage:         #4a6741
    --terracotta:   #b85c38
    --cream:        #faf7f2
    --charcoal:     #2c2c2a
    --warm-white:   #fff9f4
    --sand:         #e8ddd0
    --mid-gray:     #6b6b68

Fonts: Cormorant Garamond for headings, DM Sans for body and UI.

## Firebase Collections

- postures — yoga postures
- anatomy_topics — anatomy topics with sub-cards
- philosophy_topics — philosophy topics with sub-cards
- team_members — teacher profiles
- modules — curriculum modules with curated content
- posture_categories — posture category labels
- anatomy_categories — anatomy category labels
- philosophy_categories — philosophy category labels
- progress — student module completion by device ID

## Getting Started

    npm install
    npm run dev

Admin panel: http://localhost:3000/admin

## Roadmap

- Mobile app (React Native + Expo)
- App Store and Google Play submission
- Student authentication for per-user progress tracking
- Push notifications for new content
