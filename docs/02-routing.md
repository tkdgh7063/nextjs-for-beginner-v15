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

### usePathname

The `usePathname` hook returns the current URL pathname in your Next.js application.  
It must be used inside a **Client Component**, as reading the URL from a Server Component is not supported.  
Using Client Components for this purpose is intentional and does not cause de-optimization; they are an integral part of Next.js's Server Components architecture.

- Common use case: highlighting active navigation links or conditionally rendering content based on the current path.

```tsx
"use client";
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

- This Navigation component can be imported into any page to display the active route based on the current pathname.
- `"use client"` is required to ensure the hook works correctly in the browser.

#### Notes

- Server Components cannot read the current URL.
- This restriction is intentional to preserve layout state across page navigations.

## 3. SSR VS CSR

### SSR(Server-Side Rendering)

In SSR, the server generates the HTML for each request and sends it to the browser.

- Faster initial load, since the browser receives ready-to-render HTML.
- Better for **SEO (Search Engine Optimization)** because search engines can crawl the HTML content directly.
- Heavier load on the server, as it needs to render HTML for every request.

### CSR(Client-Side Rendering)

In CSR, the browser first receives a minimal HTML file, then executes JavaScript to dynamically render the page.

- Slower initial load, since rendering waits for JavaScript execution and data fetching.
- After the initial load, navigation between pages feels very fast (single-page app behavior).
- Dependant on JavaScript; the app won't function if it's disabled.
- Less SEO-friendly unless special handling (like pre-rendering) is applied.

---

### Comparison Table

|      Aspect       | SSR (Server-Side Rendering) | CSR (Client-Side Rendering) |
| :---------------: | --------------------------- | --------------------------- |
|   **Rendering**   | Server                      | Client                      |
| **Initial Load**  | Fast                        | Slower                      |
|  **Navigation**   | Slower                      | Fast                        |
|      **SEO**      | Good                        | Poor                        |
|  **Server Load**  | High                        | Low                         |
| **JS Dependency** | Optional                    | Required                    |

## 4. Hydration

Hydration is the process of turning static, non-interactive HTML (typically generated by **SSR**) into a fully interactive React application in the browser using client-side JavaScript.
It essentially "**attaches React to the HTML**" so that components gain state, interactivity, and event listeners.

### How it works

1. **Server-Side Rendering (SSR)** sends an HTML document to the browser.

   - Example: visiting `/about-us` first loads a "dummy" HTML from the server.

2. The browser displays this HTML immediately, but it is not yet interactive.

   - For example, navigation links behave like normal `<a>` tags and cause full page reloads.

3. Once React JavaScript loads and runs on the client, **hydration occurs**:

   - React takes over the static HTML.
   - Navigation links now behave like client-side navigation without full refresh.
   - Buttons or components with state become interactive.

### Important Notes

- Hydration is required to make event listeners work. Without it, buttons or interactive components won't respond.
- If JavaScript is disabled, the page will render but **React cannot hydrate**, so interactive parts (like forms, buttons, navigation) won't work.
- Hydration bridges SSR and CSR: fast first load from SSR + interactivity from CSR.
