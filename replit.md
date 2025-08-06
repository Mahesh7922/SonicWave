# SonicWave E-commerce Platform

## Overview

SonicWave is a modern e-commerce platform specializing in premium headphones and audio equipment. The application features a sleek, dark-themed design with a complete shopping experience including product browsing, cart management, and Stripe payment integration. Built as a full-stack application with React frontend and Express backend, it demonstrates modern web development practices with TypeScript, responsive design, and smooth animations.

**Status**: ✅ COMPLETED - Fully functional e-commerce website with Stripe payment integration
**Last Updated**: August 6, 2025

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component system for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: Zustand for cart state with persistence, TanStack Query for server state
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript for API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL for scalable cloud database
- **Storage Pattern**: Repository pattern with both in-memory and database implementations
- **Payment Processing**: Stripe integration for secure payment handling
- **Session Management**: Express sessions with PostgreSQL session store

### Data Architecture
- **ORM**: Drizzle with PostgreSQL dialect for schema definition and migrations
- **Schema Validation**: Zod for runtime type validation integrated with Drizzle
- **Type Sharing**: Shared TypeScript types between frontend and backend via `/shared` directory
- **Database Tables**: Products, cart items, orders, and order items with proper foreign key relationships

### Authentication & Security
- **Session-based**: Express sessions for cart persistence across visits
- **Payment Security**: Stripe Elements for PCI-compliant payment processing
- **Environment Variables**: Secure configuration for API keys and database credentials

### Development & Build Pipeline
- **TypeScript**: Strict type checking across the entire application
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Code Organization**: Monorepo structure with clear separation of concerns

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Payment Processing**: Stripe API for payment intent creation and processing
- **UI Framework**: Radix UI primitives for accessible component foundation
- **Animation**: Framer Motion for page transitions and interactive elements

### Development Tools
- **Replit Integration**: Vite plugin for development environment and error handling
- **Database Management**: Drizzle Kit for schema migrations and database operations
- **Type Safety**: Zod for runtime validation and TypeScript for compile-time checking

### Third-party Services
- **Stripe**: Complete payment processing including webhooks for order status updates
- **Environment Configuration**: Support for development and production environment variables
- **Session Storage**: PostgreSQL-backed session management for user cart persistence

## Recent Completed Features (August 6, 2025)

### Authentication System
- ✅ User registration and login with secure password hashing (bcryptjs)
- ✅ Session-based authentication with PostgreSQL session storage
- ✅ Navbar integration with login/logout functionality and user greeting
- ✅ Authentication state management throughout the application

### Additional Pages & Features  
- ✅ About Us page with company story, team profiles, and values section
- ✅ Contact Us page with contact form, FAQ section, and business information
- ✅ User Profile page with personal information management and order history
- ✅ Enhanced navigation with About, Contact, and Profile links in navbar

## Previous Core Features

### Core Application Features
- ✅ Landing page with animated hero section and floating headphone images
- ✅ Product catalog with 6 premium headphone models from different categories
- ✅ Individual product detail pages with quantity selectors and add-to-cart functionality
- ✅ Shopping cart sidebar with real-time updates and smooth animations
- ✅ Multi-step checkout process with customer information forms
- ✅ Stripe payment integration for secure demo transactions
- ✅ Success page with order confirmation and tracking number
- ✅ Mobile responsive design with dark theme throughout

### Visual Design & Animation
- ✅ Modern dark theme with SonicWave branding (cyan blue and orange accents)
- ✅ Smooth page transitions and hover effects using Framer Motion
- ✅ Product card hover animations and category-based color coding
- ✅ Floating animations on hero section product images
- ✅ Cart badge animations and shopping cart slide-in effects
- ✅ Loading states and skeleton screens for better UX

### Technical Implementation
- ✅ Complete TypeScript implementation with proper type safety
- ✅ Zustand for cart state management with localStorage persistence
- ✅ TanStack Query for server state management
- ✅ High-quality product images from Unsplash
- ✅ Category filtering system (Premium, Gaming, Studio, Wireless, Sport, Classic)
- ✅ Session-based cart persistence across page refreshes
- ✅ Error handling and loading states throughout the application

### Payment Integration
- ✅ Stripe Elements integration for secure payment processing  
- ✅ Payment Intent creation with order tracking
- ✅ Multi-step checkout flow with form validation
- ✅ Order confirmation and success messaging
- ✅ Environment variables properly configured for Stripe API keys