Rarity Leads Project Guide for Gemini Assistant
This document serves as the knowledge base and instruction guide for the development of the Rarity Leads project.
1. Project Overview
Rarity Leads is a lead generation platform that utilizes AI to help users find and qualify potential clients.
•	Frontend: HTML, CSS, and JavaScript (Vanilla).
•	Backend: Supabase for database and authentication.
•	Key Libraries: @supabase/supabase-js.
•	Design System: Styling is divided between dashboard.css (general dashboard layout) and rarity-design.css (main design system with variables, components, etc.).
2. Development Environment & Workflow
Initial Setup
•	Date: 2025-06-27
•	Operating System: win32
•	Project Root: C:\Users\55519\Desktop\DIGITAL MARKETING\SAAS AND APP DEVELOPMENT\Rarity Leads Saas\Rarity Leads in Cursor
Running the Application
•	Development: Use npm run dev to start the development server (live-server) on port 3000.
•	Production: Use npm run start to serve the files on port 8080.
Testing
•	No automated tests are configured.
•	To validate new features, create or update a test HTML file (e.g., dashboard-test.html) for manual verification.
Deployment
•	Deployment is managed by Netlify's GitHub integration.
•	A push to the main branch will trigger a new deployment.
•	The deployment configuration is in the netlify.toml file.
3. Technologies & Configuration
Supabase (Backend)
•	Configuration: Supabase URL and anon key are located in app-config.js. CRITICAL: Never expose these keys in client-side code that is committed to the repository. These should be managed via environment variables on the hosting platform (e.g., Netlify).
•	Database Schema: The schema is defined in supabase_schema.sql and supabase_schema_fixed.sql. Update these files when making database changes.
•	Authentication: The application uses Supabase Auth. The auth-guard.js file protects routes that require authentication.
Internationalization (i18n)
•	Language Files: The i18n/ directory contains JSON files for each supported language.
•	Implementation: The i18n.js file manages the translation logic. To add a new language, create a new JSON file in the i18n/ directory and update i18n.js to include it.
4. Code Conventions
JavaScript
•	Utilize modern JavaScript (ES6+).
•	All custom scripts should be included at the end of the <body> tag in HTML files.
CSS
•	The project uses two main CSS files:
o	dashboard.css: For general dashboard styling and specific components.
o	rarity-design.css: For the main design system (colors, typography, spacing, etc.).
•	When adding new styles, decide which file is most appropriate.
File Naming
•	Use kebab-case for all new files (e.g., new-feature.html).
Linting and Formatting
•	No specific linting or formatting rules are configured. Please maintain the existing code style and format.
5. UI/UX Improvement Plan
Objective
•	Improve the visual appeal and user experience throughout the application, focusing on consistency, readability, and a modern aesthetic.
General Approach
•	Consistency: Ensure uniform appearance and behavior for common elements (buttons, forms, navigation).
•	Typography: Optimize fonts, sizes, and spacing to enhance readability and visual hierarchy.
•	Color Palette: Apply a cohesive color scheme, utilizing existing CSS variables.
•	Spacing and Layout: Refine element spacing and overall layout for a cleaner, more organized look.
•	Responsiveness: Verify and enhance adaptability across various screen sizes.
Specific Page Improvements
•	index.html:
o	Description: This page serves as a simple redirect to dashboard.html.
o	Improvements: No UI/UX improvements are necessary, as it is a functional redirect page with minimal visual content.

