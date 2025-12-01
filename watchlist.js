let watchlists = JSON.parse(localStorage.getItem("watchlists")) || [];
let movieCache = {};   // ONLY IN MEMORY
let api_key = "xxxxxxxx"
(async function initWatchlist() {

    // Step 1 — fetch full movie data for each ID
    for (let id of watchlists) {
        const fd = await fetch(`https://www.omdbapi.com/?apikey=${api_key}&i=${id}`);
        const movie = await fd.json();
        movieCache[id] = movie;
    }

    // Step 2 — array of movies to render
    let movies = watchlists.map(id => movieCache[id]).filter(Boolean);

    renderMovies(movies);

    // Step 3 — search functionality
    const inp = document.getElementById("SearchInput");
    inp.addEventListener("input", () => {
        const v = inp.value.toLowerCase();
        const filtered = movies.filter(m =>
            m.Title.toLowerCase().includes(v)
        );
        renderMovies(filtered);
    });

    // Step 4 — remove movie
    document.addEventListener("click", e => {
        if (e.target.dataset.remove) {
            const id = e.target.dataset.remove;

            // remove id from watchlists
            watchlists = watchlists.filter(m => m !== id);
            localStorage.setItem("watchlists", JSON.stringify(watchlists));

            // update movies list (still using RAM cache)
            movies = watchlists.map(id => movieCache[id]).filter(Boolean);

            renderMovies(movies);
        }
    });

})();
function renderMovies(list) {
    const movdiv = document.getElementById("movies");

    if (list.length === 0) {
        movdiv.innerHTML = `<h2 style="color:white;text-align:center;">
            Your watchlist is empty.
        </h2>`;
        return;
    }

    movdiv.innerHTML = list.map(movie => `
        <div class="movie_card">
            <div class="info_section">
                <div class="movie_header">
                    <img class="locandina" src="${movie.Poster}" />
                    <h1>${movie.Title}</h1>
                    <h4>${movie.Year}, ${movie.Director}</h4>
                    <span class="minutes">${movie.Runtime}</span>
                    <p class="type">${movie.Genre}</p>
                </div>

                <div class="movie_desc">
                    <p class="text">${movie.Plot}</p>
                </div>

                <div class="movie_social">
                    <ul>
                        <li><i class="material-icons" data-remove="${movie.imdbID}">delete</i></li>
                    </ul>
                </div>
            </div>
            <div class="blur_back"></div>
        </div>
    `).join("");
}
