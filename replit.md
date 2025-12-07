# Glimmer - Cosmic Social Platform

## Overview

Glimmer is a full-stack romantic/cosmic-themed social web application that enables users to create meaningful connections through unique features like a 3D Memory Orb Universe, virtual pet care, real-time chat, and multiplayer games. The platform emphasizes friendship streaks, shared experiences, and AI-assisted interactions, all wrapped in an immersive dark-mode cosmic aesthetic with purple/blue gradients and glassmorphism design elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and caching

**UI/Component System:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library built on top of Radix UI
- Tailwind CSS for utility-first styling with custom cosmic theme
- Framer Motion for animations and page transitions
- Three.js for 3D graphics (starfield universe, animated pets)

**State Management:**
- React Query for server state with optimistic updates
- Context API for auth state (AuthContext) and WebSocket connections (SocketContext)
- React Hook Form with Zod validation for form handling

**Design System:**
- Custom CSS variables for theming (purple/blue cosmic palette)
- Glassmorphism effects using backdrop-blur and semi-transparent backgrounds
- Dark mode as default with cosmic-themed color scheme
- Google Fonts: Space Grotesk (primary), Righteous (accents), Inter (body text)

### Backend Architecture

**Server Framework:**
- Express.js running on Node.js
- TypeScript for type safety across the stack
- ESM module system (type: "module" in package.json)

**Authentication & Sessions:**
- Passport.js with Local Strategy for email/password authentication
- Session-based auth using express-session with PostgreSQL session store (connect-pg-simple)
- Password hashing using Node.js crypto (scrypt with salt)
- JWT tokens mentioned in requirements but implemented as session-based auth

**API Design:**
- RESTful API endpoints under `/api` namespace
- WebSocket server for real-time features (chat, game updates) using `ws` library
- Structured error handling with status codes and JSON responses

**Real-time Communication:**
- WebSocket server mounted at `/ws` path on the same HTTP server
- Connection management with userId-to-WebSocket mapping
- Message types: 'auth', 'chat', game moves
- Automatic reconnection handling on client side

### Data Storage

**Database:**
- PostgreSQL as primary database (via DATABASE_URL environment variable)
- Drizzle ORM for type-safe database queries and schema management
- node-postgres (pg) driver with connection pooling

**Schema Design:**
- Users table: authentication, streaks, counts, activity tracking
- Memories table: user-generated content with 3D star positions (JSON field)
- Friends table: relationship management with streak tracking and status
- Pets table: virtual pet state (happiness, energy, bond, mood)
- ChatMessages table: conversation history with sender/receiver/room support
- Games table: multiplayer game state management
- Activities table: user activity logging for dashboard

**Session Storage:**
- PostgreSQL-backed sessions via connect-pg-simple
- Session data persists across server restarts

### External Dependencies

**AI Integration:**
- OpenAI API (GPT-5 model) for three main features:
  - Cosmic Assistant chatbot for user guidance
  - Memory insights generation from user memories
  - Pet interaction personality responses
- API key managed via environment variables

**Third-Party Services:**
- MSN Games integration for casual games (Solitaire, Mahjong, Sudoku, etc.)
- External game embedding via iframes

**Development Tools:**
- Replit-specific plugins for development (vite-plugin-runtime-error-modal, cartographer, dev-banner)
- Drizzle Kit for database migrations and schema management

**Graphics & Animation:**
- Three.js for 3D rendering (version ^0.181.0)
- WebGL requirement for Memory Orb starfield visualization
- Canvas-based rendering for virtual pet animations

**Deployment Considerations:**
- Production build uses esbuild for server bundling
- Vite for client-side bundling with optimizations
- Static assets served from dist/public in production
- Environment-based configuration (NODE_ENV, DATABASE_URL, OPENAI_API_KEY, SESSION_SECRET)