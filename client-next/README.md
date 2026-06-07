# Chadar Samaj (Next.js Version)

This is the Next.js version of the Chadar Samaj frontend application. It was recently migrated from a Vite + React (CSR) application to a **Next.js 14** application utilizing the modern **App Router**.

## 🚀 Getting Started

First, make sure you have **Node.js v18.17.0 or higher** installed.

Install the dependencies (if you haven't already):
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📂 Project Structure

This project uses the modern Next.js **App Router** with a **Route Group** `(pages)` to keep the root directory clean:

```
client-next/
├── src/
│   ├── api.js                # Common API fetchers (Axios for Client, Fetch for Server)
│   ├── app/
│   │   ├── (pages)/          # Route Group: Keeps URL clean (e.g. /login instead of /pages/login)
│   │   │   ├── admin/
│   │   │   ├── create-profile/
│   │   │   ├── edit-profile/
│   │   │   ├── login/
│   │   │   ├── profile/      # Contains MyProfile and [id] for specific profiles
│   │   │   ├── register/
│   │   │   ├── search/
│   │   │   └── page.jsx      # Home Page (/)
│   │   ├── globals.css       # Tailwind CSS v3 global styles
│   │   └── layout.js         # Global HTML layout, Navbar, and Context Providers
│   ├── components/           # Reusable UI components
│   └── context/              # React Context (AuthContext, LanguageContext)
```

## 🔄 Migration Notes (Vite -> Next.js)

When this project was converted from Vite to Next.js, the following key changes were made:

1. **Routing:** `react-router-dom` (`<Routes>`, `<Route>`, `useNavigate()`) was removed. We now use Next.js file-system routing.
   - Used `useRouter()` from `next/navigation` instead of `useNavigate()`.
   - Used Next.js `<Link href="...">` instead of React Router's `<Link to="...">`.
2. **Client Components:** Since the Vite application relied heavily on React Hooks (`useEffect`, `useState`, `useContext`), the `"use client";` directive was added to the top of interactive components and pages so they continue functioning properly within the Next.js App Router.
3. **Environment Variables:** `import.meta.env.VITE_API_URL` was changed to Next.js's standard `process.env.NEXT_PUBLIC_API_URL`.
4. **Absolute Imports:** Instead of confusing relative paths (`../../context/`), this project now uses the Next.js import alias `@/`. (e.g., `import { AuthContext } from '@/context/AuthContext'`).

## 🖥️ Client vs. Server Components (SSR)

By default, the pages migrated from Vite are **Client Components** (they have `"use client";` at the top). Next.js still pre-renders the basic HTML for these on the server for speed, but data is fetched on the client side after the page loads.

### True Server-Side Rendering (SSR)
If you want to convert a specific page to fetch data *on the server* (for better SEO and instant loading), use the "Wrapper" pattern:

1. Create a **Server Component** (No `"use client"`) that fetches data using `fetchServerAPI` from `@/api`.
2. Pass that data down as `props` to a **Client Component** (Has `"use client"`) which handles the interactivity (like buttons, modals, and state).
