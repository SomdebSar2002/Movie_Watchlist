let watchlists = JSON.parse(localStorage.getItem("watchlists"))||[];
document.getElementById('watchlist').textContent = watchlists.length
document.addEventListener('click',e=>{
    if(e.target.dataset.watch)
    {
        
        watchlists.push(e.target.dataset.watch)
        console.log(e.target.dataset.watch)
        let icon = document.getElementById(`heart-${e.target.dataset.watch}`)
        icon.textContent = 'library_add_check'
        document.getElementById('watchlist').textContent = watchlists.length
        localStorage.setItem('watchlists',JSON.stringify(watchlists))
    }
})


const inp = document.getElementById('SearchInput')
inp.addEventListener('input',(e)=>{
    e.preventDefault()
    let v = inp.value
    inp.reset
    func(v)
})


async function func(v){
     const fd = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=f8450963&s=${v}&type=movie`)
     const data = await fd.json()
     const movdiv = document.getElementById('movies')
     movdiv.innerHTML = (await Promise.all(
    data.Search.map(async (e2, i) => {
        const fd2 = await fetch(`https://www.omdbapi.com/?apikey=f8450963&i=${e2.imdbID}`);
        const movie = await fd2.json();
        console.log(movie)
        let text =  `favorite`
        if(watchlists.includes(e2.imdbID))
        text= `library_add_check`
        return `
    <div class="movie_card" id="${movie.id}">
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
                   <li><i class="material-icons" id="heart-${movie.imdbID}" data-watch="${movie.imdbID}">${text}</i></li>
                </ul>
            </div>
        </div>

        <div class="blur_back"></div>
    </div>`;
    })
)).join('')
    }
// func()