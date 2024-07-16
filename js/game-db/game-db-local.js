/**
 * Game API for using IndexDB
 */


class GameDB {
    constructor() {
        this.db = null;
        this.isAvailable = false;

    }


    open() {
        return new Promise((resolve, reject) => {  //we need a promise in order to get to open DB and afler show th list

            //Validated whether the indexDB object is available
            if (indexedDB) {
                // at this step we do not create a DB, we just created a request which we gonna handle below
                const request = indexedDB.open('Games', 1);
                // console.log('Request', request)

                // Handles the errors when opening/ creating the database
                request.onerror = (event) => {
                    reject(event.target.error.message);
                }
                // Handles the success when opening/creating the database
                request.onsuccess = (event) => {
                    // Creating a db object
                    const db = event.target.result;
                    if (db) {
                        this.db = db,
                            this.isAvailable = true;
                        resolve();
                    } else {
                        reject('The database is not available')
                    }
                }

                // Handles the database upgrade.
                request.onupgradeneeded = (event) => {
                    console.log("On upgrade", event)
                    const db = event.target.result;
                    // Approach with autoincrement keys
                    // const objectStore = db.createObjectStore('Game', { autoIncrement: true });

                    // console.log('objectStore', objectStore)
                    // Approach we set up the keys
                    // 'Game' is like a table in the SQL
                    const objectStore = db.createObjectStore('Game', { keyPath: 'id' })


                    // Creates the indexes.
                    objectStore.createIndex('title', 'title');
                    objectStore.createIndex('genre', 'genre');
                }
            }
            else {
                reject("Your browser doesn't suport IndexDB")
            }

        })
    }


    // Adding to the Data base/ transactions
    add(title, genre, hasFinished) {

        // We need to add the promise to get the promise is everything was added to the database
        // without promise, first we get false just after a while we get true, because it is a asyncrinise fumction
        return new Promise((resolve, reject) => {
            // console.log('Add Game')
            // console.log('[add] Is available:', this.isAvailable)
            // console.log('[add] Database:', this.db)
            if (!this.isAvailable) {
                reject('Database not opened')
            }

            // Transaction handlers
            const transaction = this.db.transaction(['Game'], 'readwrite');
            transaction.onerror = (event) => {
                reject(event.target.error.message);
            }
            // we need this method just if we have multiple requests
            transaction.oncomplete = (event) => {
                console.log('[Transaction] All done:', event)
            }

            //Store handlers.
            // objectStore thre is a method which will retreive the store from the transaction
            const store = transaction.objectStore('Game');
            const storeRequest = store.add({
                id: Date.now(),//unique id which will never repeat, unless 2 defferent users will add at the same time
                title: title,
                genre: genre,
                hasFinished: hasFinished
            });
            storeRequest.onerror = (event) => {
                reject(event.target.error.message)
            }
            storeRequest.onsuccess = (event) => {
                resolve();

            }


        });
    }

    getAll() {

        return new Promise((resolve, reject) => {
            // console.log('Game get all')
            // console.log('[getAll] Is available', this.isAvailable);
            // console.log('[getAll] Database:', this.db);
            if (!this.isAvailable) {
                reject('Database not opened')
            }
            // Transaction handlers.
            const transaction = this.db.transaction(['Game'], 'readonly');
            transaction.onerror = (event) => {
                reject(event.target.error.message)
            }

            // Store handlers.
            const store = transaction.objectStore('Game');
            const request = store.getAll();
            request.onerror = (event) => {
                reject(event.target.error.message)
            }
            request.onsuccess = (event) => {
                resolve(event.target.result); //or(request.result)
            }
        })
    }

    // to get a single element from the database
    get(id) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject("Database not opened!")
            }

            // Transaction handlers.
            const transaction = this.db.transaction(['Game'], 'readonly')
            transaction.onerror = (event) => {
                reject(eve.target.error.message)
            };

            // Gets a data from the store
            const store = transaction.objectStore('Game');
            const request = store.get(id);
            request.onerror = (event) => {
                reject(eve.target.error.message)
            }
            request.onsuccess = (event) => {
                // the data that I received from the db
                resolve(event.target.result)
            }
        })
    }

    getByGenre(genre) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened')
            }

            // Transaction handlers.
            const transaction = this.db.transaction(['Game'], 'readonly')
            transaction.onerror = (event) => {
                reject(event.target.error.message)
            };

            // Get all data from the index genre
            const store = transaction.objectStore('Game');
            const index = store.index('genre');
            const request = index.getAll(genre);
            request.onerror = (event) => {
                reject(event.target.error.message)
            }
            request.onsuccess = (event) => {
                resolve(event.target.result);
            }

        })
    }

    // Update DB method
    update(updatedGame) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject("DataBase not opened")
            }

            // Transaction handlers.
            const transaction = this.db.transaction(['Game'], 'readwrite');
            // there is asynchronise function however it is not a promise, We have to call callback functions
            transaction.onerror = (event) => {
                reject(event.target.error.message)
            }

            // Gets the store
            const store = transaction.objectStore('Game');
            const request = store.put(updatedGame)
            request.onerror = (event) => {
                reject(event.target.error.message)
            }
            request.onsuccess = (event) => {
                resolve();
            }
        })
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened')
            }

            // Transaction handlers.
            const transaction = this.db.transaction(['Game'], 'readwrite');
            transaction.onerror = (event) => {
                reject(event.target.error.message)
            }

            // Get the Store
            const store = transaction.objectStore('Game');
            const request = store.delete(id);
            request.onerror = (event) => {
                reject(event.target.error.message)
            }
            request.onsuccess = (event) => {
                resolve();
            }
        })
    }
}
// it will be import an instance of the class
export default new GameDB();
