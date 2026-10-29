# Aurélia Maison Paris — Luxury E-Commerce

React + Vite + Tailwind CSS luxury e-commerce web application.

## Development Server

A Vite development server runs on `$PORT` (default 3000).

- Preview URL: Access the running app at `http://localhost:3000` (or `http://localhost:3001` if 3000 is occupied)
- Hot reload: Changes to source files are reflected immediately

## Project Structure

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component orchestrating sections, modals, and global providers
- `src/context/ShopContext.tsx` - Global state for cart, wishlist, live search, currency conversion, orders, and salon appointments
- `src/components/` - Modular component directories (`common`, `layout`, `home`, `modals`)
- `src/data/` - Curated products, categories, hero slides, testimonials, and currencies
- `src/types/index.ts` - TypeScript interfaces and models
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 styling
- `index.html` - HTML shell loading `src/main.tsx`
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Clean Vite configuration with React, Tailwind CSS v4, and `@` alias for `src`

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt
