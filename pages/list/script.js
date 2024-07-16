import gameDB from '../../js/game-db/game-db.js';

// Gets a refference to the list output div
const listOutput = document.getElementById('list-output');
console.log("GameDB:", gameDB)
// Opens the database
gameDB.open()
    .then(() => {

        // Loads the list of game
        gameDB.getAll()
            .then(displayGames) //get data from the database
            .catch((error) => {
                console.log("Failed to get:", error)
            });


        // For the single document
        // gameDB.get('VgFhRv6jiqe0blRg7MvW').then((game) => {
        //     console.log('Game:', game)
        // })
        //     .catch((error) => {
        //         console.log('Failde to open', error)
        //     })

    })
    .catch((error) => {
        console.log('Failed to open', error)
        listOutput.innerHTML = `
        <div class= 'game-not-found'>
        There was an error opening the database.
Please, check your connection and try again later.
</div>        `
        document.getElementById('game-filter').style.display = 'none'
    })

// Handle the List button click
document.getElementById('list-button').addEventListener('click', () => {
    const genre = document.getElementById('game-genre').value;
    if (genre) {
        gameDB.getByGenre(genre)
            .then(displayGames)
            .catch((error) => {
                console.log("Failed to get by genre:", error)
            })
    }
    else {
        gameDB.getAll()
            .then(displayGames)
            .catch((error) => {
                console.log("Failed to get:", error)
            });
    }
});

/**
 * Display all games
 */

function displayGames(games) {
    listOutput.innerHTML = '';

    // Display a 'not found games' with this genre
    if (games.length === 0) {
        listOutput.innerHTML = `
        <div class = 'game-not-found'>
        No game was found in the database.
        </div>
        `;
    }
    games.forEach((game) => {
        const elemGame = document.createElement('div');
        elemGame.className = 'game-item';
        listOutput.append(elemGame);

        // Includes the genre
        const elemGenre = document.createElement('span');
        elemGenre.innerText = game.genre;
        elemGame.append(elemGenre)

        // Includes the title.
        const elemTitle = document.createElement('h3');
        elemTitle.innerText = game.title;
        elemGame.append(elemTitle)

        // Includes the status.
        const elemStatus = document.createElement('div');
        elemStatus.className = 'status';
        elemStatus.innerHTML = '<b>Status:</b>';
        elemGame.append(elemStatus);

        function updateLabelStatus(labelStatus) {
            labelStatus.innerText = game.hasFinished ? 'Completed!' : 'Still playing'
        }
        // Includes the status label.
        const elemStatusLabel = document.createElement('span');
        updateLabelStatus(elemStatusLabel)
        // elemStatusLabel.innerText = game.hasFinished ? 'Completed!' : 'Still playing';
        elemStatus.append(elemStatusLabel)

        // Includes the change status button
        const buttonUpdate = document.createElement('button');
        buttonUpdate.className = 'update';
        buttonUpdate.innerText = 'Change Status';
        elemGame.append(buttonUpdate);

        buttonUpdate.addEventListener('click', () => {
            game.hasFinished = !game.hasFinished;
            gameDB.update(game)
                .then(() => {
                    updateLabelStatus(elemStatusLabel)
                    // elemStatusLabel.innerText = game.hasFinished ? 'Completed!' : 'Still playing'
                })
                .catch((error) => {

                })

        })

        // Includes the remove button
        const buttonRemove = document.createElement('button');
        buttonRemove.className = 'remove';
        buttonRemove.innerText = 'Remove';
        elemGame.append(buttonRemove);

        // Remove from the database
        buttonRemove.addEventListener('click', () => {
            gameDB.delete(game.id)
                .then(() => {
                    elemGame.remove();
                })
                .catch((error) => {
                    console.log('Failed to remove', error)
                })
        })

    })
}

