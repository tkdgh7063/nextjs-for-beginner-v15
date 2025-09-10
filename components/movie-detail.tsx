import { API_URL } from "../lib/config";

async function getMovie(id: string) {
  const response = await fetch(`${API_URL}/${id}`, { cache: "force-cache" });
  return response.json();
}

export default async function MovieDetail({ id }: { id: string }) {
  const movie = await getMovie(id);
  return <h3>{JSON.stringify(movie)}</h3>;
}
