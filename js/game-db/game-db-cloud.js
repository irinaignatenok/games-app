import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/*
* GameDB API for using firebase
*/

class GameDB {
    constructor() {
        this.db = null;
        this.isAvailable = false
    }

    open() {
        return new Promise((resolve, reject) => {
            try {
                const firebaseConfig = {
                    apiKey: "AIzaSyBk6tWohYtIaPwXPCjPAKiBQ-dl0baKPYo",
                    authDomain: "games-app-8b49f.firebaseapp.com",
                    projectId: "games-app-8b49f",
                    storageBucket: "games-app-8b49f.appspot.com",
                    messagingSenderId: "698485933401",
                    appId: "1:698485933401:web:aaf9e280a8821505c57848"
                };

                // Initialize Firebase
                const app = initializeApp(firebaseConfig);


                // Initialize Cloud Firestore and get a reference to the service
                const db = getFirestore(app);
                if (db) {
                    this.db = db;
                    this.isAvailable = true
                    resolve();
                } else {
                    reject('DB is not available')
                }
                console.log('Open All', db)

            }

            catch (error) {
                reject(error.message)
            }
        })
    }
    add(title, genre, hasFinished) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject("Database not opened")
            }
            // Create the game object to be added
            const game = {
                title: title,
                genre: genre,
                hasFinished: hasFinished
            }

            // Connect to the Firebase collection  "GameList is a name of the collection"
            const dbCollection = collection(this.db, "GameList")

            // Include the new object to the collection
            addDoc(dbCollection, game)
                .then((docRef) => {
                    console.log("Firebase saved", docRef.id)
                    resolve();
                })
                .catch((error) => {
                    reject(error.message)
                });
        });
    }
    getAll() {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened');
            }

            // Connects to the Firebase collection.
            const dbCollection = collection(this.db, 'GameList')

            // Gets the date from the collection
            getDocs(dbCollection)
                .then((querySnapShot) => {
                    const result = [];
                    querySnapShot.forEach((doc) => {
                        const data = doc.data()
                        data.id = doc.id  //include id into the data oblect
                        result.push(data)
                    });
                    resolve(result);
                })
                .catch((error) => {
                    reject(error.message)
                })
        })
    }
    get(id) {
        console.log("GameDB get:", id);
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not found')
            }

            // Get the document reference
            const docRef = doc(this.db, 'GameList', id);

            // Retrieve the document
            getDoc(docRef)
                .then((docSnap) => {
                    const data = docSnap.data()
                    resolve(data)

                })
                .catch((error) => {
                    reject(error.message)
                })
        })
    }
    getByGenre(genre) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened!')
            }

            // Connection to the Firebase collection

            const dbCollection = collection(this.db, 'GameList');

            // Creates a query for the collection
            const dbQuery = query(dbCollection, where('genre', "==", genre))

            // Gets the data from the query
            getDocs(dbQuery)
                .then((querySnapShot) => {
                    const result = [];
                    querySnapShot.forEach((doc) => {
                        const data = doc.data()
                        data.id = doc.id;
                        result.push(data)
                    })
                    resolve(result)
                })
                .catch((error) => {
                    reject(error.message)
                })

        })
    }
    update(updateGame) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject("Database not opened")
            }

            // Get the document reference
            const docRef = doc(this.db, 'GameList', updateGame.id);

            // Update the document
            updateDoc(docRef, { hasFinished: updateGame.hasFinished })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error.message)
                })
        })
    }
    delete(id) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened!')
            }

            // Get the document reference
            const docRef = doc(this.db, 'GameList', id)

            // Delete the document
            deleteDoc(docRef)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error.message)
                })
        })
    }

    /**
     * Saves a push notification subcription
     * @param {*} subscription 
     */
    subscribe(subscription) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened')
            }

            // Connect to the Firebase collection by creating a new collection
            const dbCollection = collection(this.db, 'Subscriptions');
            addDoc(dbCollection, {
                subscription: JSON.stringify(subscription)
            })
                .then((docRef) => {
                    resolve()
                })
                .catch((error) => {
                    reject(error.message)
                })
        })
    }
}

export default new GameDB();