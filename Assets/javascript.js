const apiKey = '39f23a391c6157c866eb13b5a33b4be5';
document.getElementById('search').addEventListener('input', function() {
searchMovies(this.value);
});
function displayMovies(movies) {
const movieList = document.getElementById('movie-list');
movieList.innerHTML = '';
// Fetch IMDb ratings and store them in a new array
const moviePromises = movies.map(async (movie) => {
const tmdbMovieId = movie.id;
const tmdbData = await fetch(`https://api.themoviedb.org/3/movie/${tmdbMovieId}?api_key=${apiKey}`).then(response => response.json());
const imdbId = tmdbData.imdb_id;
if (imdbId) {
    const omdbData = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=f4a92005`).then(response => response.json());
    return { ...movie, omdbData };
} else {
    return null;
}
});
// Wait for all IMDb ratings to be fetched
Promise.all(moviePromises).then(moviesWithRatings => {
// Filter out movies without IMDb ratings
const filteredMovies = moviesWithRatings.filter(movie => movie !== null);
// Sort movies based on IMDb rating
filteredMovies.sort((a, b) => parseFloat(a.omdbData.imdbRating) - parseFloat(b.omdbData.imdbRating));
// Set the threshold for the lowest-rated movies (e.g., top 5 lowest-rated)
const lowestRatedMovies = filteredMovies.slice(0, 10);
lowestRatedMovies.forEach(movie => {
    const movieCard = `
        <div class="col s12 m6 l4">
            <div class="card">
                <div class="card-image">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster">
                </div>
                <div class="card-content">
                    <span class="movie-title">${movie.title}</span>
                    <p class="movie-imdb-rating">IMDb: ${movie.omdbData.imdbRating}</p>
                    <p class="movie-description">${movie.overview}</p>
                </div>
            </div>
        </div>
    `;
    movieList.innerHTML += movieCard;
});
}).catch(error => {
console.error('Error fetching movie data:', error);
});
}
function fetchMovies(url) {
fetch(url)
.then(response => response.json())
.then(async data => {
const moviePromises = data.results.map(async (movie) => {
const tmdbMovieId = movie.id;
const tmdbData = await fetch(`http://api.themoviedb.org/3/movie/${tmdbMovieId}?api_key=${apiKey}`).then(response => response.json());
const imdbId = tmdbData.imdb_id;
if (imdbId) {
    const omdbData = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=f4a92005`).then(response => response.json());
  return { ...movie, omdbData };
} else {
  return null;
}
});
Promise.all(moviePromises).then(moviesWithRatings => {
 const filteredMovies = moviesWithRatings.filter(movie => movie !== null && movie.poster_path && movie.omdbData && movie.omdbData.imdbRating);
filteredMovies.sort((a, b) => parseFloat(a.omdbData.imdbRating) - parseFloat(b.omdbData.imdbRating));
displayMovies(filteredMovies);
});
})
.catch(error => {
console.error('Error fetching data:', error);
});
}
let currentPage = 1;
const moviesPerPage = 10;
function fetchBadMovies(page = 1) {
const badMoviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_average.asc&vote_count.gte=50&page=${page}`;
fetchMovies(badMoviesUrl);
}
// Call fetchBadMovies function to display movies when the page loads
fetchBadMovies();
function searchMovies(query, page = 1) {
    if (query.trim()) {
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&sort_by=vote_average.asc&page=${page}`;
fetchMovies(searchUrl);
} else {
// If search is empty only bad movies are shown
fetchBadMovies(page);
}
}
function filterMoviesByGenre(genre, page = 1) {
if (genre) {
const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&sort_by=vote_average.asc&page=${page}`;
fetchMovies(genreUrl);
} else {
// If no genre is selected, display the bad movies
fetchBadMovies(page);
}
}
document.getElementById('search').addEventListener('input', function () {
currentPage = 1;
searchMovies(this.value, currentPage);
});
document.addEventListener('DOMContentLoaded', function () {
const elems = document.querySelectorAll('select');
const instances = M.FormSelect.init(elems);
});
document.getElementById('genre-filter').addEventListener('change', function () {
currentPage = 1;
filterMoviesByGenre(this.value, currentPage);
});
document.getElementById('previous-page').addEventListener('click', () => {
if (currentPage > 1) {
currentPage--;
updatePage();
}
});
document.getElementById('next-page').addEventListener('click', () => {
currentPage++;
updatePage();
});
function updatePage() {
const searchInput = document.getElementById('search');
const genreFilter = document.getElementById('genre-filter');
if (searchInput.value) {
searchMovies(searchInput.value, currentPage);
} else if (genreFilter.value) {
filterMoviesByGenre(genreFilter.value, currentPage);
} else {
fetchBadMovies(currentPage);
}
}
//--------------------------------------------------------------------------------------------
var watchlistDataElement = document.getElementById('watchlistData');
var watchlistDisplayElement = document.getElementById('watchlistDisplay');
var watchlistDataElement = document.getElementById('watchlistData');
var titleInputElement = document.getElementById('title');
var ratingInputElement = document.getElementById('rating');
var yearInputElement = document.getElementById('year');
var directorInputElement = document.getElementById('director');
var actorInputElement = document.getElementById('actor');
var synopsisInputElement = document.getElementById('synopsis');
var saveButton = document.getElementById('save-btn');
var watchlistArray = JSON.parse(localStorage.getItem("watchlist")) || [];
var movieForm = document.getElementById('movie-form')
console.log('hello')
movieForm.addEventListener("submit", function(event) {
    event.preventDefault();
console.log("submitted")
let watchlist = {
        title: titleInputElement.value,
        rating: ratingInputElement.value,
        year: yearInputElement.value,
        director: directorInputElement.value,
        actors: actorInputElement.value,
        synopsis: synopsisInputElement.value,
    };
console.log(watchlist)
watchlistArray.push(watchlist)
localStorage.setItem("watchlist", JSON.stringify(watchlistArray));
}
);