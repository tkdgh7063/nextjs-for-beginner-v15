import { Suspense } from "react";
import MovieDetail from "../../../../components/movie-detail";
import MovieVideos from "../../../../components/movie-videos";

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <Suspense fallback={<h1>Loading Movie...</h1>}>
        <MovieDetail id={id} />
      </Suspense>
      <Suspense fallback={<h1>Loading Videos...</h1>}>
        <MovieVideos id={id} />
      </Suspense>
    </div>
  );
}
