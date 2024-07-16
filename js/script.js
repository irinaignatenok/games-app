// console.log(navigator);
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/', type: 'module' })
        .then((registration) => {
            console.log('Register Success:', registration)
        })
        .catch((error) => {
            console.log('Register Failed:', error)
        });
} else {
    console.log('Service Workers are not supported')
}


// function posts from the web

function loadposts() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(json => renderPost(json))
}

window.addEventListener('load', () => {
    if (navigator.onLine) {
        loadposts();
    }
    else {
        renderOffline();
    }
    getAvailableDiskSpace();
})

// Render offline message

function renderOffline() {
    const output = document.getElementById('post-output');
    output.innerHTML = `
    <div class = 'offline-message'>
    <h3>No internet connection</h3>
    <p>Please, check your connection and try again later </p>
    </div>`
}

// Render postd on the page
function renderPost(posts) {
    const output = document.getElementById("post-output")
    output.innerHTML = '';
    const topPost = posts.slice(0, 10)
    topPost.forEach(element => {
        output.innerHTML += `
            <div class="post-item">
                <h3> ${element.title}</h3>
                <div class = "text">${element.body}</div>
            </div>
            `

    });
}
//On connection lost
window.addEventListener('offline', () => {
    console.log('You are offline');
    // renderOffline();
})

// On connection recovered
window.addEventListener('online', () => {
    // console.log('You are online');
    loadposts();
})

// Counter
// let count = 0;
// setInterval(() => {
//     count++;
//     console.log('Count:', count);
// }, 1000);

// Display the amount of disk space available
// if (navigator?.storage?.estimate) it checks 
// first is navigator exists after it validates is storage exists
function getAvailableDiskSpace() {
    // if (navigator.storage && navigator.storage.estimate) { }//still app can crush
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate()
            .then((result) => {
                const storageOutput = document.getElementById('storage-output')
                storageOutput.innerHTML = '<h3>Device Storage</h3>'

                // Calculates the remaining quota
                const remaining = result.quota - result.usage;

                // Calculates the percentage used
                const percentageUsed = (result.usage / result.quota) * 100

                // Write the values on the page.
                storageOutput.innerHTML += `
                <div class = 'data'>
                <div class= 'entry'>
                ${(result.quota / 1000000).toFixed(2)}%
                <strong>Total</strong>
                </div>
                
                <div class = 'entry'>
                ${percentageUsed.toFixed(2)}%
                <strong>Used</strong>
                </div>
                <div class = 'entry'>
                ${(remaining / 1000000).toFixed(2)}%
                <strong>Remaining</strong>
                </div>
                </div>

                `
            })
    }
}