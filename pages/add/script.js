import gameDB from '../../js/game-db/game-db.js';//there is a new approach of realing two js files

//Get a reference to the message output div.
const messageOutput = document.getElementById('message-output');

// const gameDB = new GameDB();
// Opens a Database
gameDB.open();

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
                console.log('Add error', error);
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


