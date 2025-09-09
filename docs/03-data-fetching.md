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
