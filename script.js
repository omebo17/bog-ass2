// varriables
const baseUrl = 'https://api.giphy.com/v1/gifs';
const limit = 10;
const key = 'aFFKTuSMjd6j0wwjpFCPXZipQbcnw3vB';
const format = 'json';
let suggestionsArr = [`Internet Cats`, `Meme's`, `Typing`, `Space`, `Rick and Morty`];


class GiphyConfig {
    constructor(data) {
        this.imgUrl = data.images.fixed_height_still.url;
        this.gifUrl = data.images.fixed_height.url;
        this.rating = data.rating;
        this.isStill = true;
    }
}

class Giphy extends GiphyConfig {
    render() {
        const newElem = document.createElement('div');
        newElem.classList.add('gif-box');
        newElem.innerHTML = `
            <img src="${this.imgUrl}" />
            <div class="rating">${this.rating}</div>
        `;
        newElem.addEventListener('click', (event) => {
            this.isStill = !this.isStill;
            newElem.querySelector('img').setAttribute('src', this.isStill ? this.imgUrl : this.gifUrl);
        });
        document.querySelector('.gifs-container').appendChild(newElem);
    }
}

class SuggestionConfig {
    constructor(initialSuggestion) {
        this.initialSuggestion = initialSuggestion;
    }
}

class Suggestion extends SuggestionConfig {
    render() {
        const newElem = document.createElement('div');
        newElem.classList.add('suggestion');
        newElem.innerText = this.initialSuggestion;
        newElem.addEventListener('click', (event) => {
            onSubmit(this.initialSuggestion, true);
        });
        document.querySelector('#suggestions').appendChild(newElem);
    }
}

function renderSuggestions(suggestions) {
    document.querySelector('#suggestions').innerHTML = '';
    suggestions.forEach(sug => {
        const sugObject = new Suggestion(sug);
        sugObject.render();
    });
}

// isSuggetion is a boolean for catching if we are submiting suggestion value
async function onSubmit(searchValue, isSuggestion) {
    try {
        document.querySelector('.gifs-container').innerHTML = '';
        suggestionsArr = isSuggestion ? suggestionsArr : [...suggestionsArr.slice(1), searchValue];
        renderSuggestions(suggestionsArr);
        const requestUrl = 
            `${baseUrl}/search?q=${encodeURIComponent(searchValue)}&limit=${limit}&api_key=${key}&fmt=${format}`;
        const result = await (await fetch(requestUrl)).json();
        for(let gif of result.data) {
            const giphy = new Giphy(gif);
            giphy.render();
        }
    } catch(err) {
        console.log('Submit Error: ', err);
    }
}

async function trendingClickHandler(event) {
    try {
        document.querySelector('.gifs-container').innerHTML = '';
        const requestUrl = 
            `${baseUrl}/trending?limit=${limit}&api_key=${key}&fmt=${format}`;
        const result = await (await fetch(requestUrl)).json();
        for(let gif of result.data) {
            const giphy = new Giphy(gif);
            giphy.render();
        }
    } catch(err) {
        console.log('Trending Error: ', err);
    }
}

renderSuggestions(suggestionsArr);
document.querySelector('#btn-submit').addEventListener('click', () => 
    onSubmit(document.querySelector('#user-search').value, false));
document.querySelector('#btn-trending').addEventListener('click', trendingClickHandler);


