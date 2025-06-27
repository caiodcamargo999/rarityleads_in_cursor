# Gemini Code Assistant - Detailed Project Guide

This document provides in-depth instructions for the Gemini code assistant to ensure it can effectively assist with the development of this project.

## 1. Project Overview

This is a lead generation platform that uses AI to help users find and qualify leads. The frontend is built with HTML, CSS, and vanilla JavaScript, and it uses Supabase for the backend.

## 2. Development Workflow

### Running the Application

- **Development:** Use `npm run dev` to start the development server with `live-server` on port 3000.
- **Production:** Use `npm run start` to serve the files on port 8080.

### Testing

There are no automated tests configured. When adding new features, you should create or update an existing HTML file (like `dashboard-test.html`) to validate the functionality manually.

### Linting and Formatting

There are no specific linting or formatting rules. Please maintain the existing code style and format.

## 3. Key Technologies and Libraries

### Supabase

- **Configuration:** The Supabase URL and anon key are located in `app-config.js`. **Never expose these keys in client-side code that is committed to the repository.**
- **Schema:** The database schema is defined in `supabase_schema.sql` and `supabase_schema_fixed.sql`. When making changes to the database, update these files accordingly.
- **Authentication:** The application uses Supabase Auth. The `auth-guard.js` file protects routes that require authentication.

### Internationalization (i18n)

- **Language Files:** The `i18n/` directory contains JSON files for each supported language.
- **Implementation:** The `i18n.js` file handles the translation logic. To add a new language, create a new JSON file in the `i18n/` directory and update `i18n.js` to include it.

## 4. Code Conventions

- **JavaScript:** Use modern JavaScript (ES6+). All custom scripts are included at the end of the `<body>` tag in the HTML files.
- **CSS:** The project uses two main CSS files: `dashboard.css` for general styling and `rarity-design.css` for the design system. When adding new styles, decide which file is more appropriate.
- **File Naming:** Use kebab-case for all new files (e.g., `new-feature.html`).

## 5. Deployment

Deployment is handled via Netlify's GitHub integration. Pushing to the `main` branch will trigger a new deployment. The `netlify.toml` file contains the deployment configuration.
