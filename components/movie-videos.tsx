import { API_URL } from "../lib/config";

async function getVideos(id: string) {
  const response = await fetch(`${API_URL}/${id}/videos`, {
    cache: "force-cache",
  });
  // throw new Error("Videos loading failed");
  return response.json();
}

export default async function MovieVideos({ id }: { id: string }) {
  const videos = await getVideos(id);
  return <h4>{JSON.stringify(videos)}</h4>;
}
