import React from "react";
import * as api from "./api";
import {
  BrowserRouter,
  Route,
  Link,
  Switch,
  useParams,
  useHistory,
  useLocation,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/movies">View all movies</Link>
      </nav>
      <main>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/movies" exact>
            <AllMovies />
          </Route>
          <Route path="/movies/:id">
            <MovieDetails />
          </Route>
          <Route path="/search">
            <SearchMovies />
          </Route>
          <Route>
            <h1>No such page</h1>
          </Route>
        </Switch>
      </main>
    </BrowserRouter>
  );
}

function Home() {
  let history = useHistory();
  console.log(history);

  const handleSubmit = (event) => {
    event.preventDefault();
    const filmToSearch = event.target.movie.value;
    const results = api.searchMovies(filmToSearch);
    if (!results.length) {
      return;
    } else {
      let searchID = results[0].id;
    }
    history.push(`/search?query=${filmToSearch}`);
  };

  return (
    <div>
      <h1>Movie App</h1>
      <p>You can learn about movies and stuff</p>
      <form onSubmit={handleSubmit}>
        <label>
          Look up a thing:
          <input id="movie" type="text" placeholder="type any movie here..." />
          <input type="submit" value="Submit" />
        </label>
      </form>
    </div>
  );
}

function AllMovies() {
  return (
    <>
      <h1>All movies</h1>
      <ul>
        {api.getAllMovies().map((movie) => (
          <li key={movie.id} className="card">
            <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function MovieDetails() {
  const { id } = useParams();
  let movie = api.getMovie(parseInt(id));
  console.log(movie);
  return (
    <section>
      <h2>{movie.title}</h2>
      <h3>{movie.category_name}</h3>
      <p>Released: {movie.release_year}</p>
      <p>Running Time: {movie.running_time} minutes</p>
      <p>Rating: {movie.rating_name}</p>
    </section>
  );
}

function SearchMovies() {
  //url has now changed, we can grab it with location
  const location = useLocation();
  console.log(location);
  //the search value of the location object is our query string, ie /search?query=aliens
  const searchParams = new URLSearchParams(location.search);
  //get the value the person wanted to search
  let searched = searchParams.get("query");
  console.log(searched);
  //run the filter function and get the matching film
  let found = api.searchMovies(searched);
  console.log(found);
  return (
    <>
      {found.map((movie) => (
        <ul key={movie.id} className="card">
          <section>
            <h2>{movie.title}</h2>
            <h3>{movie.category_name}</h3>
            <p>Released: {movie.release_year}</p>
            <p>Running Time: {movie.running_time} minutes</p>
            <p>Rating: {movie.rating_name}</p>
          </section>
        </ul>
      ))}
    </>
  );
}

export default App;
