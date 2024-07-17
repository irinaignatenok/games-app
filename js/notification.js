import gameDbCloud from './game-db/game-db-cloud.js '
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
                // displayNotification();
                configurePushSubscription();  //push notifications
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
                displayNotification();
                configurePushSubscription();
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

/**
 * Subscribe the device to receive push messages
 * we know that we serviceWorker ready, we validated before
 */
async function configurePushSubscription() {
    // there is a old aproach
    // navigator.serviceWorker.ready
    //     .then((registration) => {
    //         // retrieve push API from push manager which is located in the registration
    //         // console.log('Registration:', registration)
    //         const pushManager = registration.pushManager;
    //         console.log('pushManager', pushManager)
    //     }).catch()

    // Working with await/async always works with try and catch to catch the error
    try {
        const registration = await navigator.serviceWorker.ready
        const pushManager = registration.pushManager;
        // console.log('pushManager', pushManager)

        // to validate is the device has a subscription got the push notification
        let subscription = await pushManager.getSubscription();
        if (subscription === null) {
            // Not subcribed
            // console.log('No subscription was found');
            const publicKey = "BAE7PMTm_LuDJW0kuf-wj1F_D2qAifC671shosiwViFnBf7xsPBW2u1Nc6W64ITBV4zWtjKaDzV-GVehbYbFpgA"
            const options = {
                userVisibleOnly: true,
                applicationServerKey: publicKey
            };
            subscription = await pushManager.subscribe(options); //to subscribe device

            // Save the new subscription to the database
            await gameDbCloud.open()
            await gameDbCloud.subscribe(subscription);//subscription came from db-cloud

            console.log('Subscription saved')
        }
        console.log('Current Subscription:', JSON.stringify(subscription))
    }
    catch (error) {
        console.log('Subscription error', error)
    }
}