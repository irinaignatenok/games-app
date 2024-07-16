// console.log(window)

const notificationButton = document.getElementById('notification');

// We check if notification and service worker exist - our button is enabled
if ('Notification' in window && 'serviceWorker' in navigator) {
    notificationButton.addEventListener('click', () => {
        console.log('Permission', Notification.permission)
        switch (Notification.permission) {
            case 'default':
                requestUserPermission();
                break;

            case 'granted':
                displayNotification();
                break

            case 'denied':
                notificationNotAllowed();
                break
        }
    })
} else {
    notificationNotAllowed()
}
/**
 * Request the user's permission to send notifications.
 *  */

function requestUserPermission() {
    Notification.requestPermission()
        .then((permission) => {
            // console.log('User choice', permission);
            if (permission === 'granted') {
                displayNotification
            } else {
                notificationNotAllowed();
            }
        });
}

/**
 * Display a notification to the user
 */
function displayNotification() {
    // console.log('Showing Notification....')
    // console.log('Max actions', Notification.maxActions);
    const options = {
        body: 'Thank you for subsribing to our notifications!',
        icon: '/images/logo.jpeg',
        image: '/images/thankYou.png',
        actions: [{
            action: 'confirm',
            title: 'Okay',
            image: '/images/ok.png'
        }, {
            action: "cancel",
            title: 'Cancel'
        }],
        data: {
            id: 'abc123',
            name: "Danny",
            age: 28
        }
    }
    // new Notification('Successfully subscribed!', options)// this function does not allow us to use acction
    navigator.serviceWorker.ready
        .then((registration) => {
            registration.showNotification('Successfully subscribed!', options);
        })
}


// Disable the notification button
function notificationNotAllowed() {
    notificationButton.disabled = true
    console.log("Not allowed Notification")
}

