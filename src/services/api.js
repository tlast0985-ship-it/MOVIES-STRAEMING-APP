const API_KEY = "API KEY";
const BASE_URL = "https://api.themoviedb.org/3";

export const getMoviesVideos = async (movieId) => {

  const response = await fetch(

    `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`

  );

  const data = await response.json();
  return data.results
}



export const getPopularMovies = async (page = 1) => {

  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );

  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  const data = await response.json();
  return data.results;
};
