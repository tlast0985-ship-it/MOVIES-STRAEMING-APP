import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";

import { getMoviesVideos } from "../services/api";

function Home() {
  
const [page, setPage] = useState(1)
const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");

  const [movies, setMovies] = useState([]);

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);
  const [trailerKey,setTrailerKey] = useState(null)

  useEffect(() => {

    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies(1);
        setMovies(popularMovies);
      } catch (err) {
        console.log(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, []);



const handleSearch = async (e) => {

    e.preventDefault();
    if (!searchQuery.trim()) return

    if (loading) return

    setLoading(true)

    try {
        const searchResults = await searchMovies(searchQuery,1)
        setMovies(searchResults)
        setPage(1) //reset page
        setIsSearchMode(true) //mark search mode
        setError(null)
    } catch (err) {
        console.log(err)
        setError("Failed to search movies...")
    } finally {
        setLoading(false)
    }
  };



const handlePlay = async (movieId) =>{


      const videos = await getMoviesVideos(movieId)
      const trailer = videos.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      )

      if (trailer){

        setTrailerKey(trailer.key)
      }
      else {
        alert(" No trailer available")
      }

    
    }


const loadMoreMovies = async () => {
  if (loading) return;

  const nextPage = page + 1;
  setLoading(true);

  try {
    let newMovies = [];

    if (isSearchMode) {
      newMovies = await searchMovies(searchQuery, nextPage);
    } else {
      newMovies = await getPopularMovies(nextPage);
    }

    setMovies(prev => [...prev, ...newMovies]); // ⭐ append movies
    setPage(nextPage);
  } catch (err) {
    console.log(err);
    setError("Failed to load more movies...");
  } finally {
    setLoading(false);
  }
};

  

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>


{trailerKey && (
  <div className="video-container">
    <button onClick={() => setTrailerKey(null)}>Close</button>

    <iframe
      width="100%"
      height="400"
      src={`https://www.youtube.com/embed/${trailerKey}`}
      title="Trailer"
      frameBorder="0"
      allowFullScreen
    ></iframe>
  </div>
)}

{/* load more movies */}
    {!loading && movies.length > 0 && (
  <div className="load-more-top">
    <button className="load-more-btn" onClick={loadMoreMovies}>
      Load More
    </button>
  </div>
)}

        {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
        
      )   
  :  (
        
        <div className="movies-grid">
        {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} onPlay= {handlePlay} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home;
