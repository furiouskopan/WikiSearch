let currentOffset = 0;
let currentKeyword = '';

function searchWikipedia() {
    const keyword = document.getElementById('search-input').value;
    
    if (keyword.trim() !== '') {
        document.querySelector('.search-container').style.top = '10%'; 
        document.getElementById('main-container').style.paddingTop = 0;

        document.getElementById('articles-container').innerHTML = '';
        currentOffset = 0;
        currentKeyword = keyword;

        fetchArticles(currentKeyword);
    }
}
document.getElementById('search-input').addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        searchWikipedia();
    }
});

async function fetchArticles(keyword, offset = 0) {
    const encodedKeyword = encodeURIComponent(keyword); 
    const endpoint = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=search&srsearch=${encodedKeyword}&srlimit=10&sroffset=${offset}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data.query.search.length) {
            displayArticles(data.query.search);
            document.getElementById('load-more').style.display = 'block';
        } else {
            // Display "Nothing found" message
            const container = document.getElementById('articles-container');
            container.innerHTML = '<p class="no-results">Nothing found.</p>';
            document.getElementById('load-more').style.display = 'none';
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayArticles(articles) {
    const container = document.getElementById('articles-container');
    for (const article of articles) {
        const articleCard = document.createElement('div');
        articleCard.classList.add('article-card');
        
        const title = document.createElement('h2');
        title.textContent = article.title;
        articleCard.appendChild(title);
        
        const snippet = document.createElement('p');
        snippet.innerHTML = article.snippet;
        articleCard.appendChild(snippet);
        
        const readMoreLink = document.createElement('a');
        readMoreLink.href = `https://en.wikipedia.org/?curid=${article.pageid}`;
        readMoreLink.textContent = 'Read more on Wikipedia';
        readMoreLink.target = '_blank';
        articleCard.appendChild(readMoreLink);
        
        container.appendChild(articleCard);
    }
}

function loadMoreArticles() {
    currentOffset += 10;
    fetchArticles(currentKeyword, currentOffset);
}