import dbOnline from './game-db-cloud.js';
import dbOffline from './game-db-local.js';

// GameDB for using cloud or local DB

// Background synchronisation

class GameDB {
    constructor() {
        this.dbOffline = dbOffline
        this.dbOnline = dbOnline
        this.swController = null
        this.swRegistration = null
    }


    open() {
        return new Promise((resolve, reject) => {
            if ('serviceWorker' in navigator) {
                // to validate if our serviceWorker is ready to work
                navigator.serviceWorker.ready.then((registration) => {
                    if ('active' in registration && 'sync' in registration) {
                        console.log('SW and Sync available!')
                        this.dbOffline.open()
                            .then(() => {
                                this.swController = registration.active;
                                this.swRegistration = registration
                                // to open database
                                this.dbOnline.open().then(resolve).catch(reject)

                            })
                            .catch(() => {
                                this.dbOnline.open().then(resolve).catch(reject)
                            })
                    }
                    else {
                        this.dbOnline.open().then(resolve).catch(reject)
                    }
                })
            } else {
                // this.dbOnline.open()
                //     .then(() => { resolve() })
                //     .catch((error) => reject(error))

                // the shorter way to write the same code:
                this.dbOnline.open.then(resolve).catch(reject)
            }

        })
    }


    add(title, genre, hasFinished) {
        console.log('Is Online', navigator.onLine)
        if (navigator.onLine) {
            return this.dbOnline.add(title, genre, hasFinished) //return an object from cloud DB
        }
        else {

            // Validate if Background Sync is available and tag exist. if not to register a new tag
            // now offline data synchronize with online database
            this.swRegistration.sync.getTags()
                .then((tags) => {
                    if (!tags.includes('add-game')) {
                        this.swRegistration.sync.register('add-game');
                    }
                })
            return this.dbOffline.add(title, genre, hasFinished);
        }
    }

    getAll() {
        if (navigator.onLine) {
            return this.dbOnline.getAll()
        } else {
            return new Promise((resolve, reject) => {
                reject('You must be connected to the network')
            })
        }
    }
}
// get(id){

// }

// getByGenre(){ }
// update(){

// }
// delete (){

// }

export default new GameDB();