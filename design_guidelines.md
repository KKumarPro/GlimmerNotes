# Glimmer Design Guidelines

## Design Approach
**Reference-Based: Discord + Steam + Dribbble Dark Mode Fusion**

Drawing from Discord's community-focused UI, Steam's immersive gaming aesthetic, and Dribbble's creative presentation. The cosmic theme demands a bold, immersive experience where glassmorphism and space elements create depth without overwhelming functionality.

**Core Principles:**
- Immersive cosmic atmosphere with functional clarity
- Glassmorphism for depth and modern appeal
- Animated backgrounds that enhance, not distract
- Social features remain accessible amid visual richness

## Typography

**Font Stack (Google Fonts):**
- Primary: 'Space Grotesk' - Modern, geometric, tech-forward
- Accent/Headings: 'Righteous' - Bold, futuristic statements
- Body: 'Inter' - Clean readability for chat/content

**Hierarchy:**
- Hero Headings: 4xl-6xl (Righteous, bold)
- Section Headings: 2xl-3xl (Space Grotesk, semibold)
- Card Titles: lg-xl (Space Grotesk, medium)
- Body Text: base-sm (Inter, regular)
- Captions: xs-sm (Inter, light)

## Layout System

**Spacing Primitives:** Tailwind units 2, 4, 6, 8, 12, 16
- Tight spacing: 2-4 (card content, button padding)
- Standard spacing: 6-8 (between elements, section padding)
- Generous spacing: 12-16 (section breaks, containers)

**Grid Strategy:**
- Landing: Full-width sections with max-w-7xl containers
- Dashboard: Sidebar (280px) + main content area
- Memory Orb Universe: Full viewport canvas with floating UI overlays

## Component Library

### Navigation
**Top Bar (Glassmorphic):**
- Frosted glass effect (backdrop-blur-xl, bg-opacity-10)
- Logo left, nav center, profile/notifications right
- Subtle glow border-b with purple gradient
- Floating above content with fixed positioning

### Hero Section
**Cosmic Entry Experience:**
- Full viewport height with animated starfield particle background
- Center-aligned headline + subheadline + dual CTAs
- Floating 3D Memory Orb preview (right side) with rotation animation
- Gradient text effects on headline
- CTA buttons: Blurred backgrounds (backdrop-blur-md) with gradient borders and subtle glow

### Cards & Glassmorphism
**Universal Card Treatment:**
- Semi-transparent backgrounds (bg-opacity-5-15)
- Thick backdrop-blur-lg for frosted effect
- Gradient borders (purple-to-blue, 1-2px)
- Rounded corners: lg-2xl
- Inner glow on hover (box-shadow with purple/blue)

### Memory Orb Universe Dashboard
**3D Canvas Layout:**
- Full-screen canvas background
- Floating glass panels for navigation (top-left)
- Pet care widget (bottom-right, 320px glass card)
- Quick chat overlay (bottom-left, expandable)
- Orb creation FAB (right side, glowing gradient button)

### Chat Interface
**Real-time Messaging:**
- Split view: Contacts sidebar (320px glass card) + active conversation
- Message bubbles: Sender (gradient purple-blue), Receiver (glass subtle)
- Timestamp and status indicators with low opacity
- Input bar: Glass effect with gradient accent border, emoji/attachment buttons

### Game Lobbies
**Multiplayer Cards:**
- Grid layout: 2-3 columns
- Each card: Glass effect, game thumbnail, player count, join button
- Active games: Pulsing gradient border
- Hover: Lift effect with enhanced glow

### Virtual Pet Care
**Pet Dashboard Card:**
- Avatar with animated stats ring (health/happiness/energy)
- Action buttons: Feed, Play, Care (gradient with icons)
- Progress bars: Gradient fills with glow effects
- Achievement badges: Small glass circles with cosmic icons

### Buttons
**Primary Action:**
- Gradient backgrounds (purple-to-blue)
- Glow effect (box-shadow with color blur)
- Bold text, medium padding (px-6 py-3)

**Secondary/Glass:**
- Transparent with gradient border
- Backdrop-blur-md
- Subtle hover glow

**Floating Action (FAB):**
- Large circular gradient button
- Strong glow, floating shadow
- Icon-only with tooltip

### Forms
**Input Fields:**
- Glass background with subtle border
- Focus: Enhanced glow, gradient border
- Placeholder text: Low opacity
- Labels: Small caps, Space Grotesk

### Social Features
**User Profile Cards:**
- Avatar with cosmic frame/ring
- Stats: Orbs created, Friends, Games played
- Glass card container
- Connection status indicator (glowing dot)

## Background Elements

**Animated Starfield:**
- Multiple layers at different speeds (parallax)
- Varying star sizes and opacities
- Occasional shooting stars (subtle)
- Purple/blue nebula gradients in background

**Gradient Overlays:**
- Radial gradients from corners (purple/blue/violet)
- Mesh gradients for depth
- Vignette effect on edges

## Images

**Hero Image:** Large cosmic 3D orb/sphere with swirling purple-blue galaxies inside, floating in space with particle effects around it. Position: Right side of hero, 45% width, with text on left.

**Feature Section Images:** 
- Memory Orb creation mockup (glowing interface)
- Virtual pet interaction screenshot (cute cosmic creature)
- Multiplayer game lobby preview
- Each in glass-framed cards

**Avatar Placeholders:** Cosmic silhouettes, galaxy patterns for user profiles

**Game Thumbnails:** Space-themed mini illustrations for each multiplayer game type

All images should have subtle glow effects and integrate with the cosmic theme through overlays and treatments.