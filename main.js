// main variable 
let input = document.querySelector(".get-repos input");
let getReposBtn = document.querySelector(".get-button");
let reposContainer = document.querySelector(".all-repos")
let loadMoreBtn = document.querySelector(".load-more");
getReposBtn.onclick = function () {
    if (input.value !== "") {
        loadMoreBtn.classList.add("is-hidden");
        reposContainer.innerHTML = "";
        showLoading();
        fetchData(`https://api.github.com/users/${input.value}/repos`);
    } else
        reposContainer.innerHTML = `<span class="error">*Please Enter Valid Username</span>`;
}
loadMoreBtn.onclick = function () {
    loadMoreData();
}

// fetch Data From Url
function fetchData(apiLink) {
    fetch(apiLink).then((response) => {
        if (!response.ok)
            throw new Error(`HTTP Error: Status ${response.status}`)
        return response.json();
    }).then((repo) => {
        hideLoading();
        if (repo.length === 0) {
            loadMoreBtn.classList.add("is-hidden");
            reposContainer.innerHTML = `<span class="error">*No repositories found</span>`;
        } else {
            loadMoreBtn.classList.remove("is-hidden");
            reposContainer.innerHTML = "";
            window.localStorage.setItem("repos", JSON.stringify(repo))
            loadInitialData();
        }
    }).catch((error) => {
        hideLoading();
        loadMoreBtn.classList.add("is-hidden");
        reposContainer.innerHTML = `<span class="error">*Failed to fetch data: ${error.message}</span>`
    })
}

function createRepoElement(repo) {
    return `<div class="repo">
        <div class="repo-title" title="${repo.name}">${repo.name}</div>
        <div class="links">
            <a href="${repo.html_url}" target="_blank">Repo</a>
            <a href="${repo.homepage === null ? "#" : repo.homepage}" target="${repo.homepage === null ? "" : "_blank"}">live Dimo</a>
        </div>
    </div>`
}

// load initial repos in page
function loadInitialData(step = 0) {
    let initialItems = 4;
    let repos = JSON.parse(window.localStorage.getItem("repos"));
    let div = document.createElement("div");
    reposContainer.appendChild(div);
    div.innerHTML = repos.slice(0, initialItems).map(createRepoElement).join("");
    if (initialItems === repos.length) loadMoreBtn.classList.add("is-hidden")
}

// load more data if the user press on the loadMore btn and display it in page 
function loadMoreData() {
    let repos = JSON.parse(window.localStorage.getItem("repos"));
    let initialItems = document.querySelectorAll(".repo").length;
    let toLoad = 4;
    let div = document.createElement("div");
    reposContainer.appendChild(div)
    div.innerHTML = repos.slice(initialItems, toLoad + initialItems).map(createRepoElement).join("");
    if (document.querySelectorAll(".repo").length === repos.length) loadMoreBtn.classList.add("is-hidden");
    fidIn(div);
}

function fidIn(div) {
    opacity = 0;
    div.style.opacity = 0;
    let interval = setInterval(() => {
        if (opacity <= 1) {
            opacity += 0.1;
            div.style.opacity = opacity;
        } else
            clearInterval(interval)

    }, 30);
}

function showLoading() {
    reposContainer.innerHTML = `<span class="loading"></span>`;
}

function hideLoading() {
    document.querySelector(".loading")?.remove();
}

