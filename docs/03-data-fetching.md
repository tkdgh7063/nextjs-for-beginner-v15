# Data Fetching

## 1. Fetching Data

### 1.1 Client Components

There are two ways to fetch data in Client Components:

1. Using React's `use` hook
2. Using a community library such as [SWR](https://swr.vercel.app/ko) or [React Query](https://tanstack.com/query/latest)

---

#### 1) Streaming data with the `use` hook

You can use React's `use` hook to stream data from the server to the client.
The idea is to fetch data in a **Server Component** and then pass the unresolved promise down to a **Client Component** as a prop:

```tsx
// app/blog/page.tsx
import Posts from "@/app/ui/posts";
import { Suspense } from "react";

export default function Page() {
  // Don't await the data fetching function
  const posts = getPosts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  );
}
```

Then, in your Client Component, read the promise with the `use` hook:

```tsx
// app/ui/posts.tsx
"use client";
import { use } from "react";

export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>;
}) {
  const allPosts = use(posts);

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

Here, the `<Posts>` component is wrapped in a `<Suspense>` boundary.
The fallback will be shown while the promise is being resolved.

---

#### 2) Using community libraries

You can also use community libraries like SWR or React Query for data fetching in Client Components.
These libraries provide their own caching, revalidation, and other advanced features.

Example With **SWR**:

```tsx
// app/blog/page.tsx
"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function BlogPage() {
  const { data, error, isLoading } = useSWR(
    "https://api.vercel.app/blog",
    fetcher
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map((post: { id: string; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### 1.2 Server Components

There are two ways to fetch data in Server Components:

1. Using the `fetch` API
2. Using an ORM or database client

---

#### 1) Fetching with the `fetch` API

In Server Components, you can make your component asynchrounous and directly `await` the `fetch` call:

```tsx
// app/blog/page.tsx
export default async function Page() {
  const data = await fetch("https://api.vercel.app/blog");
  const posts = await data.json();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

##### Good to know

- Unlike in Client Components, you don't need hooks here — you can await data directly.
- `fetch` requests are cached by default in Next.js. The prerendered output will also be cached for better performance.
- To opt out of caching and enable **dynamic rendering**, use`{cache: "no-store"}`.
- For debugging in development, you can log `fetch` requests using the built-in logging options.
- **Security note**: Since Server Components run on the server, the `fetch` code and any secrets used in it are never sent to the client. This makes it safe to include API keys or database queries directly in these components.

---

#### 2) Fetching with an ORM or database

Because Server Components run on the server, you can query your database or use an ORM directly:

```tsx
// app/blog/page.tsx
import { db, posts } from "@/lib/db";

export default async function Page() {
  const allPosts = await db.select().from(posts);
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

### 1.3 Comparing Client and Server Components

|       Aspect       | Client Components                                        | Server Components                                           |
| :----------------: | -------------------------------------------------------- | ----------------------------------------------------------- |
|   **Execution**    | Runs in the browser (client-side)                        | Runs on the server                                          |
| **Data Fetching**  | Requires hooks (`use`, SWR, React Query, etc.)           | Can directly `await` `fetch` or query the database          |
| **Access to APIs** | Can use browser APIs (e.g., `window`, `localStorage`)    | Can access server-side APIs, ORMs, and databases            |
|    **Caching**     | Managed by libraries (SWR, React Query)                  | Built-in caching by Next.js `fetch` (default: cached)       |
|   **Rendering**    | Hydrated on the client, may cause larger bundle sizes    | Rendered on the server, reduces bundle size                 |
|   **Use Cases**    | Interactive UI, event handlers, animations, client state | Data fetching, heavy computation, secure API/database calls |

---

## 2. Streaming

When using `async/await` in Server Components, Next.js opts into **dynamic rendering**. This means the data is fetched and rendered on the server for **every user request**. If a request is slow, the entire route will be blocked from rendering.

To improve **initial load time** and user experience, you can use **streaming** to break up the page's HTML into smaller chunks and progressively send them from the server to the client.

There are two ways to implement streaming:

1. Using a `loading.tsx` file.
2. Wrapping a component with `<Suspense>`

### 2.1 Using `loading.tsx`

You can create a `loading.tsx` file in the same folder as your page to stream the **entire page** while data is being fetched. For example, to stream `app/blog/page.tsx`, add `loading.tsx` inside the `app/blog` folder:

```tsx
// app/blog/loading.tsx
export default function Loading() {
  // Define the loading UI here
  return <div>Loading...</div>;
}
```

On navigation, the user immediately sees the **layout and a loading state**, while the page is being rendered. Once the server finishes rendering, the content is automatically swapped in.

Behind-the-scenes, `loading.tsx` is nested inside `layout.tsx` and automatically wraps `page.tsx` (and its children) in a `<Suspense>` boundary.

This approach works well for **route segments** (layouts and pages). For more granular streaming at the component level, you can use `<Suspense>` directly.

### 2.2 Using `<Suspense>`

`<Suspense>` allows you to **stream specific parts of a page more granularly**.
For example, you can immediately render any content **outside the `<Suspense>` boundary**, while streaming content **inside the boundary** (like a list of blog posts) once it's ready.

```tsx
// app/blog/page.tsx
import { Suspense } from "react";
import BlogList from "@/components/BlogList";
import BlogListSkeleton from "@/components/BlogListSkeleton";

export default function BlogPage() {
  return (
    <div>
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>
      <main>
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  );
}
```

**Key points:**

- The `fallback` prop specifies what to render while the content inside `<Suspense>` is loading.
- `<Suspense>` can be used **inside the Server Components or Client Components**.
- This approach improves **perceived performance** by letting the user see stable content immediately, while other parts load progressively.
- You can **nest multiple `<Suspense>` boundaries** for even more granular streaming of different components.
