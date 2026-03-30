# 15th Annual Health Professions Conference – Feedback Website

This is an Astro-based feedback website created for the 15th Annual Health Professions Conference. Attendees can use it to submit session-specific feedback via linked Google Forms. The site organizes sessions by workshop and focus group times with native `<details>` sections for navigation.

## Features
- Categorized session listings by time slots (Workshop 1–3, Focus Group 1–3)
- Modular components for sessions and feedback boxes
- Accessible accordion structure for clean navigation
- Thematic visual design matching the event's color scheme
- External links to feedback forms (Google Forms)
- Responsive and mobile-friendly layout

## Tech Stack
- **Framework:** Astro
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Fonts:** Geist Sans + Geist Mono
- **Interactivity:** Native HTML `<details>` sections

## Installation
Clone the repository:
```bash
git clone https://github.com/bgar324/caduceus-club-website
```

Navigate to the project folder:
```bash
cd caduceus-club-website
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open the browser and visit:
```text
http://localhost:4321
```

## Deployment
This project is configured for Astro + Vercel with Supabase-backed CMS content and auth.

## Admin Access
- Dashboard login uses Supabase Auth email/password.
- Dashboard access is restricted to users whose Supabase `app_metadata.role` is `admin`.
- New admins should be invited from the dashboard with their email address after the first admin exists.
- The invite flow requires `SUPABASE_SERVICE_ROLE_KEY` on the server in addition to the public Supabase URL and publishable key.
- The invite email sends the admin to `/cms/set-password`, where they create their own password and then land in the CMS.
- To bootstrap the first admin, run `npm run admin:invite -- admin@example.com https://caduceuswebsitev1.vercel.app`.

## Credits
**Developed by:** Benjamin Garcia

**In partnership with:** Mt. SAC Caduceus Club and Mt. SAC Computer Science Club

**Contact:** crexach@mtsac.edu
