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

## 5. "use client"

The `'use client'` directive marks a component as a **Client Component** in Next.js.
Client Components are rendered on the server like all other components, but they are **hydrated** in the browser to become interactive. This is necessary when a component requires:

- State management
- Event handling
- Access to browser APIs
- Any interactive UI behavior

Using `'use client'` **does not mean the component is rendered only on the client**. It still renders on the server for SSR, but it becomes interactive in the browser.

### Usage

Place `'use client'` **at the top of the file**, before any imports:

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Server Components

Components without `'use client'`.
Used for:

- Static content
- Data fetching
- SEO-friendly elements

### Client Components

Components with `'use client'`.
Used for:

- interactive elements
- Components that require state, effects, or browser APIs

### Component composition

You can **nest Client Components inside Server Components** as needed, keeping server and client logic separate.

## 6. Layouts

Layouts in Next.js are **shared UI components** that wrap multiple pages. They preserve state, remain interactive on navigation, and do not re-render unnecessarily.

---

### 6.1 Creating a Layout

A layout is defined by default exporting a React component from a `layout` file. The component should accept a `children` prop, which represents a page or nested layout.

#### Example: Root Layout

The **root layout** is the top-most layout in the root `app` directory and is **required**. It must include `<html>` and `<body>` tags.

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Shared UI, e.g., header, sidebar */}
        <main>{children}</main>
      </body>
    </html>
  );
}
```

- The root layout is used for globally shared UI.
- Avoid manually adding `<head>` tags (like `<title>` or `<meta>`). Use the **Metadata API** instead.
- Multiple root layouts can exist using **route groups**, but navigating across them triggers a full page reload.
- Root layouts can also exist under **dynamic segments**, e.g., `app/[lang]/layout.tsx` for i18n.

---

#### Props for Layout Components

- `children` (required): Contains the page or nested layout components.
- `params` (optional): A promise resolving to dynamic route parameters for that layout.

```tsx
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ team: string }>;
}) {
  const { team } = await params;
}
```

---

### 6.2 Nesting Layouts

Layouts are **nested by default** based on folderr hierarchy. A parent layout wraps its child layouts via the `children` prop.

- To create a layout for a specific route segment, add a `layout` file inside that segment's folder.
- Example: For a `/blog` route:

```
├─ layout.tsx          # Root layout
└─ blog/
   ├─ layout.tsx       # Blog layout
   ├─ page.tsx         # /blog page
   └─ [slug]/page.tsx  # /blog/:slug page
```

- In this structure, `RootLayout` wraps `BlogLayout`, which in turn wraps the blog pages.
- This allows shared UI to be preserved while creating route-specific layouts.

---

### Notes

- Layouts enhance **code reuse** and **UI consistency** across multiple pages.
- Nested layouts help organize route-specific UI without duplicating global elements.
- Root layout is **mandatory** and prrovides the foundation for all nested layouts.

### 6.3 Route Groups

Next.js **Route Groups** allow you to organize routes without affecting the URL structure.
Folders wrapped in parentheses `()` are treated as route groups.

#### Convention

- Wrap a folder name with parentheses: `(foldername)`.
- The folder is for organizational purposes only and is **not included** in the route's URL.

#### Use Cases

- Organize routes by team, concern, or feature.
- Define multiple root layouts.
- Opt certain route segments into sharing a layout while keeping others excluded.

#### Caveats

- **Full page load**: Navigating between routes using different root layouts triggers a full page reload.
  Example: `/cart` uses `app/(shop)/layout.js` → `/blog` uses `app/(marketingg)/layout.js`.
- **Conflicting paths**: Avoid routes in different groups resolving to the same URL.
  Example: `(marketing)/about/page.js` and `(shop)/about/page.js` both resolving to `/about` causes errors.
- **Top-level root layout**: If multiple root layouts exist without a top-level `layout.js`, ensure the home route (`/`) is defined in one of the groups, e.g., `app/(marketing)/page.js`.

#### Notes

- Layouts improve **code reuse** and **UI consistency**.
- Nested layouts organize route-specific UI without duplicating global elements.
- Root layout is **mandatory** and provides the foundation for nested layouts.

---

## 7. Metadata

Next.js **Metadata** defines `<head>` information for pages and layouts.
It can be **static** or **dynamic**, and only Server Components can export metadata. Client Components cannot.

### Rules

- Only `page` or `layout` files can export metadata.
- Metadata in nested layouts is **merged**, not nested.
- Always include default meta tags:

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### Static Metadata

Define a static metadata object by exporting a `Metadata` object from a layout or page:

#### 1. Simple title

```tsx
// app/blog/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Blog",
  description: "...",
};

export default function Page() {}
```

- `title: "My Blog"`: uses the same title for all pages.

#### 2. Using template and default

```tsx
// app/blog/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | My Blog", // placeholder for the page-specific title
    default: "My Blog", // default title when a page doesn't define one
  },
  description: "Blog about ...",
};

export default function Page() {}
```

- `template`: `%s` is replaced with the page-specific title, allowing a consistent pattern.
- `default`: the default title used if a page doesn't define one.

### Dynamic Metadata

- Use `generateMetadata` function to generate metadata dynamically based on route parameters or API data.
- Only supported in Server Components.

### Notes

- Metadata ensures SEO optimization and proper `<head>` management.
- `title`, `description`, and other meta tags are automatically generated.
- Using **templates** in titles allows per-page customization while keeping a common pattern.
