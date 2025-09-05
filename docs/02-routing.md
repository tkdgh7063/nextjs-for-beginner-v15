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

### Notes

- Folder names directly map to URL paths.
- Run the development server (`npm run dev`) to verify that routes work correctly.
