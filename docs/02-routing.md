# Routing

## 1. Defining Basic Routes

Next.js uses **file-system routing**, which means the routes in your application are determined by the folder and file structure inside the `app/` directory.

### Create the `app` Directory and Layout

#### 1. Create an `app/` folder.

#### 2. Inside `app/`, create a `layout.tsx` file containing the required `<html>` and `<body>` tags:

```tsx
// app/layout.tsx
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

#### 3. Create a home page `page.tsx` with initial content:

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}
```

- Visiting the root URL (`/`) will render both `layout.tsx` and `page.tsx`.

---

### Create Additional Pages

To define a custom route, create a folder with the route name inside `app/` and add a `page.tsx` file.

**Example:** Creating an `/about-us` page

```
app/
├─ page.tsx        # Root page → /
└─ about-us/
   └─ page.tsx     # /about-us page
```

- The `/about-us` route will render the content of `app/about-us/page.tsx`.
- This is separate from the root `app/page.tsx`, so multiple pages can coexist independently.

---

### Handling Not Found Pages

Next.js provides **special file conventions** for handling 404 errors within a specific route segment:

- `not-found.tsx`: Used to render a 404 page for a specific route segment.
- `global-not-found.tsx` (experimental): Used to define a global 404 page for unmatched routes across the entire app, independent of layouts or pages.

#### `not-found.tsx`

The `not-found.tsx` file is rendered automatically when a route under its segment is not found, or when the `notFound()` function from `next/navigation` is called.

- Place `not-found.tsx` inside the relevant route segment folder, e.g., `app/not-found.tsx` or `app/blog/not-found.tsx`.
- Next.js will render this file for unknown routes in that segment.
- For streamed responses, a `200` HTTP status code is returned; for non-streamed responses, `404` is returned.

```tsx
// app/not-found.tsx
export default function NotFound() {
  return <h1>404 Not Found.</h1>;
}
```

- Using `not-found.tsx` ensures users see a friendly message instead of a blank screen or server error.

---

### Notes

- Folder names directly map to URL paths.
- Run the development server (`npm run dev`) to verify that routes work correctly.
- Use `not-found.tsx` to gracefully handle unknown routes.

## 2. Client-Side Routing Hooks

### usePathname

The `usePathname` hook returns the current URL pathname in your Next.js application.

- Example usage: highlighting active navigation links or conditionally rendering content based on the current path.
- Must be used inside a client component.

```tsx
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav>
      <ul>
        <li className={pathname === "/" ? "active" : ""}>Home</li>
        <li className={pathname === "/about-us" ? "active" : ""}>About Us</li>
      </ul>
    </nav>
  );
}
```

- Each page can import this component to display navigation based on the current route.
