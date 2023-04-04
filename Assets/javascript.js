 const apiKey = '39f23a391c6157c866eb13b5a33b4be5';
        document.getElementById('search').addEventListener('input', function() {
    searchMovies(this.value);
});

document.getElementById('genre-filter').addEventListener('change', function() {
    filterMoviesByGenre(this.value);
});

function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = `
            <div class="col s12 m6 l4">
                <div class="card">
                    <div class="card-image">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster">
                    </div>
                    <div class="card-content">
                        <span class="movie-title">${movie.title}</span>
                        <p class="movie-description">${movie.overview}</p>
                    </div>
                </div>
            </div>
        `;
        movieList.innerHTML += movieCard;
    });
}

// Fetch and display popular movies when search is empty
fetchPopularMovies();

function fetchMovies(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function searchMovies(query) {
    if (query) {
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        fetchMovies(searchUrl);
    } else {
        // If search is empty only popular movies are shown
        fetchPopularMovies();
    }
}

function filterMoviesByGenre(genre) {
    if (genre) {
        const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}`;
        fetchMovies(genreUrl);
    } else {
        // If no genre is selected, display the popular movies
        fetchPopularMovies();
    }
}

function fetchPopularMovies() {
    const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
    fetchMovies(popularUrl);
}
document.getElementById('search').addEventListener('input', function () {
    searchMovies(this.value);
});

document.addEventListener('DOMContentLoaded', function () {
    const elems = document.querySelectorAll('select');
    const instances = M.FormSelect.init(elems);

    // Adds an event listener for the genre filter
    instances[0].el.addEventListener('change', function () {
        filterMoviesByGenre(this.value);
    });
});