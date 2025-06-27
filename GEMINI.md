# Gemini Code Assistant Project Configuration

This file provides high-level configuration guidance for the Gemini code assistant. For more detailed instructions and explanations, please refer to the files located in the `.gemini/` directory.

## Core Technologies

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Supabase (for database and authentication)
- **Key Libraries:**
  - `@supabase/supabase-js`: Official Supabase client library.
- **Development Server:** `live-server`

## Project Structure

- **HTML Files:** Root directory (e.g., `dashboard.html`, `login.html`).
- **CSS:** `dashboard.css`, `rarity-design.css`.
- **JavaScript:** Core logic is in `.js` files (e.g., `app-config.js`, `auth-guard.js`).
- **Localization:** `i18n/` directory with JSON files for different languages.
- **Database:** SQL schema and queries are in `.sql` files.

## Quick Start

- **Run Development Server:** `npm run dev`
- **Run Production Server:** `npm run start`

For detailed instructions, see `.gemini/GEMINI.md`.
