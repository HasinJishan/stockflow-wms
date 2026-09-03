# StockFlow WMS — React Frontend (Responsive)

Genuine, hand-written React components with real responsive breakpoints — not a static HTML wrapper. Matches your uploaded screenshots for desktop, with mobile/tablet layouts designed to match the same visual language.

## Setup

```bash
npm install
npm run dev
```

Open the URL shown (usually `http://localhost:5173`). Resize your browser or use DevTools device mode to see the responsive behavior.

## What's built so far

- **Landing page** (`/`) — full responsive nav with working hamburger menu on mobile, stacked hero on tablet/mobile, 2-column stats grid on mobile, single-column features/steps on mobile, stacked footer.
- **Login** (`/login`), **Signup** (`/signup`), **Forgot password** (`/forgot-password`), **Reset password** (`/reset-password`) — all built on a shared `AuthLayout` component (`src/components/AuthLayout.jsx`), so styling stays consistent across all four and any layout fix applies everywhere at once.

## Structure

```
src/
  styles/tokens.css       — shared colors, radii, shadows as CSS variables
  components/
    Icons.jsx             — shared SVG icon components
    AuthLayout.jsx         — shared card/form components for auth pages
    AuthLayout.css          — responsive styles for the auth card (desktop + mobile)
  pages/
    Landing.jsx / .css     — full landing page, own responsive stylesheet
    Login.jsx
    Signup.jsx
    ForgotPassword.jsx
    ResetPassword.jsx
```

## Breakpoints used

- **Desktop**: default styles, matches your screenshots exactly (1440px design)
- **Tablet** (`max-width: 1024px`): hero stacks, features/steps go 2-column
- **Mobile** (`max-width: 768px` for Landing, `640px` for auth cards): hamburger nav, single-column everything, full-width buttons

## Next pages

Send me the next screenshot(s) and I'll build them the same way — real components, shared design tokens, responsive from the start.
