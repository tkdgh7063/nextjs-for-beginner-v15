# Deployment

## 1. CSS

Next.js provides several ways to style your application:

\- Tailwind CSS
\- CSS Modules
\- Global CSS
\- External Stylesheets
\- Sass
\- CSS-in-JS

---

### 1.1 CSS Modules

CSS Modules provide **locally scoped styles** by generating unique class names at build time. This allows you to reuse the ssame class name in multiple files **without naming collisions**.

To use CSS Modules, create a file ending with `.module.css` and import it into a component inside the `app` directory:

```css
/* app/blog/blog.module.css */
.blog {
  padding: 24px;
}
```

```tsx
// app/blog/page.tsx
import styles from "./blog.module.css";

export default function Page() {
  return <main className={styles.blog}></main>;
}
```

---

### 1.2 Global CSS

Global CSS applies styles across the **entire application**.

Create an `app/global.css` file and import it in toe root `layout.tsx`.
This ensures the styles are applied to **every route**.

```css
/* app/global.css */
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

```tsx
// app/layout.tsx
// These styles apply to every route in the application
import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

#### Good to know

- Global styles can be imported into any `layout`, `page`, or `component` in the `app` directory.
- However, since Next.js integrates stylesheets with **React Suspense**, global CSS files are **not automatically removed** when navigating between routes.
  → This can sometimes lead to conflicts.
- Best practice:
  - Use **global styles** only for _truly global rules_ (e.g., resets, typography, Tailwind base).
  - Use **Tailwind CSS** for most comopnent-level styling.
  - Use **CSS Modules** for custom, scoped CSS when needed.
