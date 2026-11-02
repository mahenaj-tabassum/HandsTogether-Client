# HansTogether — Social Development Events Platform

HansTogether is a community platform where people discover local social-development events, create their own, join as volunteers, and keep track of everything they have signed up for. Think tree plantations, winter clothes distributions, community cleanups, food and blood donation drives.

**Live site:**

**Server repository:** https://github.com/mahenaj-tabassum/HandsTogether-Server

**Client repository:** https://github.com/mahenaj-tabassum/HandsTogether-Client

---

## Key Features

- **Discover upcoming events.** Browse a card grid of future events only. Events whose date has passed never appear, and you can filter by event type or search by title and location.
- **Create community events.** A validated form (title, type, date, start time, location, thumbnail URL, capacity, description) with a live card preview. Past dates are rejected on both the client and the server.
- **One-click joining with seat limits.** Join from the event details page. The server prevents double joins and never lets an event go over capacity, even when two people grab the last seat at the same time.
- **Joined Events with tabs.** Your joined events are split into Upcoming and Past tabs with live counts, sorting by date, and clear status badges.
- **Manage your own events.** Update an event in a dialog form or delete it after a confirmation step. Only the creator can edit or delete an event, and this is enforced on the server, not just in the interface.
- **Secure authentication.** Email and password sign-in plus social login, built with BetterAuth. Protected API routes are guarded with JWT validation, and private pages redirect to login and bring you back afterwards.
- **Profile management.** View your profile, change your display name and photo, and see how many events you have joined and created.
- **Light and dark themes.** A theme toggle that remembers your choice across pages and reloads.
- **Polished, accessible interface.** Loading skeletons, empty states, error states with retry, toast notifications (no browser alerts), keyboard-friendly dialogs and tabs, and `prefers-reduced-motion` support.
- **Fully responsive.** Designed for mobile, tablet and desktop.

---

## Tech Stack

**Client**

- Next.js (App Router) with TypeScript
- Tailwind CSS and shadcn/ui
- BetterAuth with the JWT plugin and MongoDB adapter
- react-toastify for notifications
- lucide-react for icons

**Server**

- Node.js and Express.js
- MongoDB
- JWT verification middleware

---

## Pages

| Route            | Access  | Purpose                                                              |
| ---------------- | ------- | -------------------------------------------------------------------- |
| `/`              | Public  | Banner, features, six upcoming events, community gallery, newsletter |
| `/events`        | Public  | All upcoming events with filters                                     |
| `/events/[id]`   | Public  | Event details and Join button (login required to join)               |
| `/login`         | Public  | Email/password and social login                                      |
| `/register`      | Public  | Name, email, photo URL, password with validation                     |
| `/create-event`  | Private | Create an event                                                      |
| `/manage-events` | Private | Update or delete your own events                                     |
| `/joined-events` | Private | Events you joined, in Upcoming and Past tabs                         |
| `/profile`       | Private | View and update your name and photo                                  |

---

## API Endpoints (server)

| Method | Endpoint               | Auth            | Description                                         |
| ------ | ---------------------- | --------------- | --------------------------------------------------- |
| GET    | `/api/events`          | Public          | Upcoming events (`limit`, `type`, `q` are optional) |
| GET    | `/api/events/:id`      | Public          | One event                                           |
| POST   | `/api/events`          | JWT             | Create an event                                     |
| PATCH  | `/api/events/:id`      | JWT, owner only | Update an event                                     |
| DELETE | `/api/events/:id`      | JWT, owner only | Delete an event and its join records                |
| GET    | `/api/events/mine`     | JWT             | Events created by the logged-in user                |
| GET    | `/api/events/joined`   | JWT             | Events joined by the logged-in user                 |
| GET    | `/api/events/:id/join` | JWT             | Has the logged-in user joined this event?           |
| POST   | `/api/events/:id/join` | JWT             | Join an event                                       |

---

## Getting Started

### Prerequisites

- Node.js 20 or newer
- A MongoDB database (local or MongoDB Atlas)
- The HansTogether server running (see the server repository)

### Installation

```bash
git clone https://github.com/mahenaj-tabassum/HandsTogether-Client
cd HandsTogether-Client
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
# MongoDB connection used by BetterAuth
MONGODB_DATABASE_URL=your-mongodb-connection-string

# The URL where this client runs (http://localhost:3000 in development)
BETTER_AUTH_CLIENT_URL=http://localhost:3000

# The URL where the Express server runs
NEXT_PUBLIC_API_URL=http://localhost:5000

# Social login (set up the ones you use)

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Never commit `.env.local`. Make sure it is listed in `.gitignore`.

### Run the app

```bash
npm run dev
```

Open http://localhost:3000.

### Build for production

```bash
npm run build
npm start
```

---

## Design

The interface follows a small design system: a violet brand color with warm amber accents in the light theme, a near-black base with champagne gold in the dark theme, Plus Jakarta Sans for headings and DM Sans for body text. Buttons, cards, radii and spacing are shared across every page, so the layout never shifts when the theme changes.

---

## Author

Built by **Mahenaj Tabassum Powshi**.

## 📄 Copyright & Usage

© 2026 [Your Name]. All Rights Reserved.

This project is published for portfolio and educational viewing purposes only.

- You may view the source code for learning and reference.
- You may not copy, reproduce, redistribute, modify, or use this project, in whole or in part, without my prior written permission.
- You may not claim this project or any part of it as your own.

**No license is granted for reuse or redistribution.**

For permission or inquiries, please contact me.
