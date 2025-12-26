# 🌌 Glimmer — Cosmic Social Platform

## Overview

Glimmer is a full-stack, cosmic-themed social web application designed to help users build meaningful connections through shared experiences. The platform blends real-time interaction, virtual companionship, and AI-powered assistance into an immersive, dark-mode cosmic environment.

Key ideas behind Glimmer:
- Friendship over followers
- Shared experiences over passive content
- Emotional engagement through playful, interactive features

---

## Core Features

### ✨ Real-Time Social Interaction
- One-to-one real-time chat using WebSockets
- Ephemeral chat messages (automatically disappear after 24 hours)
- Friendship-based access control (only accepted friends can interact)

### 🌠 Memory Orb Universe
- Users can share memories represented as stars in a 3D universe
- Each memory contributes to a growing personal constellation
- AI-generated insights based on recent memories

### 🐾 Virtual Pet (Shared Co-Care System)
- Each user owns a virtual cosmic pet
- Users can assign **one accepted friend** as a *Co-Care Partner*
- A shared pet is maintained by both users (single pet, shared state)
- Pet stats include happiness, energy, bond, and mood
- Actions by either user affect the same pet in real time

### 🔥 Friendship Streaks & Activity Tracking
- Daily activity tracking to encourage consistent engagement
- Friendship streak logic based on consecutive interactions
- Activity feed for recent actions (memories, pet care, interactions)

### 🤖 AI-Powered Features
- Cosmic Assistant chatbot for guidance and interaction
- AI-generated memory insights
- AI-driven pet interaction responses
- Powered by Google Gemini (Generative AI)

---

## Tech Stack

### Frontend
- **React + TypeScript**
- **Vite** for fast builds and development
- **Wouter** for lightweight routing
- **TanStack Query (React Query)** for server state management
- **Tailwind CSS** with custom cosmic theme
- **shadcn/ui** and **Radix UI** for accessible components
- **Framer Motion** for animations
- **Three.js** for 3D graphics (Memory Orb & pet visuals)
- **react-snowfall** for ambient visual effects

---

### Backend
- **Node.js + Express (TypeScript)**
- **Session-based authentication** using Passport.js
- **PostgreSQL-backed sessions** with connect-pg-simple
- **WebSocket server** (`ws`) for real-time chat and games
- RESTful API under `/api`

---

### Database
- **PostgreSQL** (hosted on Render)
- **Drizzle ORM** for type-safe schema and queries

#### Key Tables
- `users` — authentication, counts, streaks
- `friends` — friendship relationships & status
- `pets` — virtual pet state (shared ownership supported)
- `chat_messages` — ephemeral messages with timestamps
- `memories` — user memories with 3D metadata
- `activities` — dashboard activity feed
- `games` — multiplayer game state

---

## Chat Expiry Logic (Ephemeral Chats)

- Chat messages are automatically deleted after **24 hours**
- Cleanup is enforced at the backend during chat fetch
- No cron jobs or background workers required
- Ensures storage remains clean and scalable

---

## Deployment

### Hosting
- **Render** for backend, frontend, and PostgreSQL
- GitHub-connected auto-deploy on push to `main`

### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
SESSION_SECRET=...
GOOGLE_GENERATIVE_AI_API_KEY=...
