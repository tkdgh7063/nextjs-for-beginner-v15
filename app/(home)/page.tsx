import { Metadata } from "next";
import Movie from "../../components/movie";
import { API_URL } from "../../lib/config";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "Home",
};

async function getMovies() {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch(API_URL, { cache: "force-cache" });
  const json = await response.json();
  return json;
}

export default async function HomePage() {
  const movies = await getMovies();
  return (
    <div className={styles.container}>
      {movies.map((movie: any) => (
        <Movie
          key={movie.id}
          id={movie.id}
          title={movie.title}
          poster_path={movie.poster_path ?? movie.backdrop_path}
        />
      ))}
    </div>
  );
}
