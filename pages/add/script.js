import gameDB from '../../js/game-db/game-db.js';//there is a new approach of realing two js files


// Check the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
        .then((registration) => {
            const controller = registration.active;
            // console.log('Sending a message to the Service Workeer...')
            const data = {
                name: "John",
                age: 32,
                isStudent: true,
                action: "include"
            }
            // controller.postMessage(data)

            // Validate id Background Sync is available.
            // if ('sync' in registration) {
            //     registration.sync.getTags()
            //         .then((tags) => {
            //             if (!tags.includes('my-tag-name')) {
            //                 registration.sync.register('my-tag-name')
            //                     .then(() => {
            //                         console.log("Tag registered!")
            //                     })
            //             }
            //         })
            // }


        });
    // const controller = navigator.serviceWorker.controller

    // On Message Posted to a Client. we got this data from the serviceWorker  clients.matchAll()
    navigator.serviceWorker.addEventListener('message', (event) => {
        // console.log('[Page Script (PS)]', event)
        const data = event.data;
        if (data.action === 'game-sync') {
            document.getElementById('message-output').innerHTML = `
            <p>Syncronized ${data.count} games!</p>
            `
        }
        // console.log('[PS] Data Recieved:', data)
    })
} else {
    console.log('Service Worker is not supported by this browser')
}


//Get a reference to the message output div.
const messageOutput = document.getElementById('message-output');

// const gameDB = new GameDB();
// Opens a Database
gameDB.open()
    .then(() => {
        console.log("Open success", gameDB)
    })
    .catch((error) => console.log('Open failed:', error));

// Handle the add button click.
document.getElementById('add-button').addEventListener('click', () => {
    // Get the user input
    const title = document.getElementById('game-title').value;
    const genre = document.getElementById('game-genre').value;
    const hasFinished = document.getElementById('has-finished-game').checked;//to get the value from the checkbox


    // Validate the user input.
    const invalidMessages = [];
    if (!title) {
        invalidMessages.push('The title field is required.');
    }
    if (!genre) {
        invalidMessages.push('The genre field is required.');
    }
    if (invalidMessages.length === 0) {
        // Add the game to the database
        gameDB.add(title, genre, hasFinished)
            .then(() => {
                console.log('Add successfuly')
                // Adds a successfull message
                messageOutput.innerHTML = `
        <div class = 'game-add-success'>
        Game added successfully!
        </div>
        `;

                // Clear the user input.
                document.getElementById('game-title').value = '';
                document.getElementById('game-genre').value = '';
                document.getElementById('has-finished-game').checked = false;

            })
            .catch((error) => {
                console.log('Add error', error.message);
                messageOutput.innerHTML = `
                <div class = 'game-failure'>
                Database error!
                <span>Failed to add data to the Database</span>
                </div>
                `
            });
    }

    // Adds a successfull message
    //     messageOutput.innerHTML = `
    //     <div class = 'game-add-success'>
    //     Game added successfully!
    //     </div>
    //     `;
    else {
        const description = invalidMessages.join('<br>');
        messageOutput.innerHTML = `
           <div class = 'game-failure'>
           Invalid Data!
           <span>${description}</span>
           </div>
           `
    }
});


