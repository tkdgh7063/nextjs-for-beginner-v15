"use client";

import { useEffect, useState } from "react";

export default function Hello() {
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const getMovies = async () => {
    const response = await fetch(
      "https://nomad-movies.nomadcoders.workers.dev/movies"
    );
    const json = await response.json();
    setMovies(json);
    setIsLoading(false);
  };
  useEffect(() => {
    getMovies();
  }, []);
  return (
    <div>
      <h1>Hello NextJS</h1>
      {isLoading ? "Loading Movies..." : JSON.stringify(movies)}
    </div>
  );
}
