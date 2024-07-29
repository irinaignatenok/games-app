const output = document.getElementById('device-output')

document.getElementById('feature-selector').addEventListener('change', (event) => {
    const selectedOption = event.target.value;
    console.log('Selected option', selectedOption)
    switch (selectedOption) {
        case 'battery':
            handleBatteryStatusAPI();
            break;

        case 'network-info':
            handleNetworkInformation();
            break;

        case 'fullscreen':
            handleFullscreenAPI();
            break
        case 'screen-orientation':
            handleScreenOrientationAPI();
            break;
        case 'vibration':
            handleVibrationAPI();
            break;
        case 'page-visibility':
            handlePageVisibility();
            break
        case 'idle-detection':
            handleIdleDetectionAPI();
            break;
        case 'screen-wake-lock':
            handleScreenWakeLockAPI();
            break
        case 'geolocation':
            handleGeolocationAPI();
            break

        case 'permission':
            handlePermissionAPI();
            break
        case 'accelerometer':
            handleAccelerometer();
            break;
        case 'linear-acceleration':
            handleLinearAccelerationSensor();
            break
        case 'gyroscope':
            handleGyroscope();
            break

        case 'gravity':
            handleGravity();
            break
        default:
            output.innerText = 'No feature available'
            break;
    }
})


async function handleBatteryStatusAPI() {
    if ('getBattery' in navigator) {
        const battery = await navigator.getBattery()
        console.log('Battery', battery)

        // Helper function  to write the battery info
        const writeBatteryInfo = () => {

            const batteryCharging = battery.charging ? 'Yes' : 'No';
            const batteryLevel = (battery.level * 100).toFixed(0) + '%';

            output.innerHTML = `
            <div>
            Battery charging:
            <strong>${batteryCharging}</strong>
            </div>
            <div> 
            Battery level:
            <strong> ${batteryLevel}</strong>
            </div>
            `;

        }

        // Write the initial state
        writeBatteryInfo()

        battery.addEventListener('chargingchange', () => {
            writeBatteryInfo()
        })

        battery.addEventListener('levelchange', () => {

            writeBatteryInfo();
        })
    } else {
        output.innerText = 'Battery API not supported on this device;'
    }

}
function handleNetworkInformation() {
    if ('connection' in navigator) {

        // Helper function to write the network information
        const writeNetworkInfo = () => {
            console.log("Connection", navigator.connection)
            const networktype = navigator.connection.type || 'unknown'; //we use unknown if our mochine does not have this property
            const networkEffectiveType = navigator.connection.effectiveType || 'unknown';
            const networkDownlink = navigator.connection.downlink || 'unknown';
            const networkDownlinkMax = navigator.connection.downlinkMax || 'unknown';

            output.innerHTML = `
            <div>Current network type: <strong>${networktype}</strong></div>
            <div>Cellular connection type: <strong>${networkEffectiveType}</strong></div>
            <div>Estimated bandwidth: <strong>${networkDownlink}</strong>Mbps</div>
            <div>Maximum downlink:<strong>${networkDownlinkMax}</strong> Mbps</div>
            `;

        }
        //   Write the initial state 
        writeNetworkInfo();

        navigator.connection.addEventListener('change', () => {
            writeNetworkInfo();
        })
    } else {
        output.innerText = 'Network information not available for this device'
    }

}
function handleFullscreenAPI() {
    if ('fullscreenElement' in document && 'exitFullscreen' in document) {
        // Create the helper elements
        const button = document.createElement('button');
        button.innerHTML = 'Toggle Fullscreen';
        output.appendChild(button);

        const message = document.createElement('div');
        message.innerText = 'Click on the button above';
        output.appendChild(message)

        button.addEventListener('click', () => {
            // console.log('Toggle fullscreen ...')
            if (!document.fullscreenElement) {
                // document.documentElement.requestFullscreen() // documentElement is an entire screen
                // full screen for the particular element o the screen e.x main 
                document.getElementById('main-content').requestFullscreen()
                    .then(() => {
                        message.innerText = 'You are in the fullscreen now.';
                    })
            } else {
                document.exitFullscreen()
                    .then(() => {
                        message.innerText = "You left fullscreen mode"
                    })
            }
        })
    } else {
        output.innerText = 'Fullscreen not available or enabled o this device.'
    }
}

function handleScreenOrientationAPI() {
    console.log('Screen', screen) //this API in the window object so we can call just screen
    if ('screen' in window && 'orientation' in screen) {
        // Create the helper elements
        const buttonLockPortrait = document.createElement('button');
        buttonLockPortrait.innerText = 'Lock Portrait';
        output.appendChild(buttonLockPortrait);

        const buttonLockLandscape = document.createElement('button');
        buttonLockLandscape.innerText = 'Lock Landscape';
        output.appendChild(buttonLockLandscape);

        const buttonUnlock = document.createElement('button');
        buttonUnlock.innerText = 'Unlock';
        output.appendChild(buttonUnlock)

        const message = document.createElement('div');
        message.innerText = 'Choose an opition above';
        output.appendChild(message);

        buttonLockPortrait.addEventListener('click', () => {
            screen.orientation.lock('portrait-primary')
                .then(() => {
                    message.innerText = 'Locked to portrait';
                })
                .catch((error) => {
                    message.innerText = `Lock error: ${error}`
                })
        })

        buttonLockLandscape.addEventListener('click', () => {
            screen.orientation.lock('landscape-primary')
                .then(() => {
                    message.innerText = "locked to landscape"
                })
                .catch((error) => {
                    message.innerText = `Lock error: ${error}`
                })
        })
        buttonUnlock.addEventListener('click', () => {
            screen.orientation.unlock()
            message.innerText = 'Orientation unlocked'
        })

    } else {
        output.innerText = 'Screen orientation is not available on the device'
    }
}

function handleVibrationAPI() {
    // Vibration for 200ms
    if ('vibrate' in navigator) {
        // Create the helper elements

        const buttonMultiple = document.createElement('button');
        output.appendChild(buttonMultiple);
        buttonMultiple.innerHTML = 'Multiple vibration '

        const buttonSingle = document.createElement('button');
        output.appendChild(buttonSingle);
        buttonSingle.innerHTML = 'Single vibration'

        // Single vibration
        buttonSingle.addEventListener('click', () => {
            navigator.vibrate(200);
        });

        // Multiple vibration
        buttonMultiple.addEventListener('click', () => {
            //A sequence of vibrations ans pauses.
            navigator.vibrate([200, 100, 200, 300, 600])
        })

    } else {
        output.innerText = "Vibration is not supported on ths device";
    }

}

function handlePageVisibility() {
    console.log("visibility", document.visibilityState);
    document.addEventListener('visibilitychange', () => {
        console.log("visibility", document.visibilityState);
        if (document.visibilityState === 'hidden') {
            Notification.requestPermission((permission) => {
                if (permission === 'granted') {
                    navigator.serviceWorker.ready
                        .then((registration) => {
                            registration.showNotification('Come back, please!!!', {
                                body: "Don't leave me here alone.",
                                icon: '/images/logo.jpeg'
                            })
                        })
                }
            })
        } else {
            output.innerHTML = 'Welcome back!!!'
        }
    })
}

async function handleIdleDetectionAPI() {
    if ('IdleDetector:, IdleDetector') {
        const permisson = await IdleDetector.requestPermission()
        if (permisson === 'granted') {
            // Creates a new IdleDetector object.
            const idleDetector = new IdleDetector();
            console.log('idleDetector', idleDetector)

            // Helper function to write the state.
            const writeState = () => {
                output.innerHTML = `
                <div>User State: <b>${idleDetector.userState}</b>.</div>
                <div>Screen state: <b> ${idleDetector.screenState}</b>.</div>
                `
            }

            // Start the detector
            await idleDetector.start({ threshold: 60000 })
            writeState()

            idleDetector.addEventListener('change', () => {
                console.log('State Changed', idleDetector)
                writeState();
            })
        } else {
            output.innerText = 'You must allow using the IdleDetector'
        }
    } else {
        output.innerText = "IdleDetector not supported on this device"

    }
}

async function handleScreenWakeLockAPI() {
    if ('wakeLock' in navigator) {
        const sentinel = await navigator.wakeLock.request('screen')
        output.innerHTML = `
        <div>Wake Lock is active</div>`;

        // Create the button to release the lock
        const button = document.createElement('button');
        button.innerText = 'Release screen';
        output.append(button);

        button.addEventListener('click', async () => {
            await sentinel.release();
            output.innerHTML = ` 
            Wake Lock deactivated. <br>
            The screen was released!`
        })
    }
}

function handleGeolocationAPI() {
    if ('geolocation' in navigator) {
        console.log("Geolocation", navigator.geolocation)
        navigator.geolocation.getCurrentPosition(
            // On Success callback
            (position) => {
                console.log('Current Position:', position);
                output.innerHTML = `
                <strong>Current Position: </strong>
                <div> Latitude: ${position.coords.latitude}</div>
                <div> Longitude: ${position.coords.longitude}</div>
                <div> More or less ${position.coords.accuracy}meters.</div>
                `
            },

            // On Error callback
            (error) => {
                console.log('Current Position Error:', error)
                output.innerText = 'Geolocation failed to get the current position'
            });

        // Watch position change when we move with the device
        navigator.geolocation.watchPosition(
            // On Success callback
            (position) => {
                output.innerHTML = `
<strong> Watching Position: </strong>
<div>Latitude: ${position.coords.latitude}</div>
<div>Longitude: ${position.coords.longitude}</div>
<div>More or Less ${position.coords.accuracy}meters.</div>
`
            },
            (error) => {
                console.log('Watch Positin Error:', error)
                output.innerText = 'Geolocation failed to watch position.'

            });

    } else {
        output.innerText = 'Geolocation API not available on this device'
    }
}

async function handlePermissionAPI() {
    if ('permissions' in navigator) {
        console.log('Permission', navigator.permissions)
        const permissionStatus = await navigator.permissions.query({
            name: 'notifications',
            userVisibleOnly: true //Only necessary for the Push API
        })
        console.log('Status:', permissionStatus)
        output.innerHTML = `
        Status for <b>${permissionStatus.name}</b>: ${permissionStatus.state}
        `;

        // Watches for changes on the permissons; this triggers when the permission changes
        permissionStatus.addEventListener('change', (event) => {
            const permissionStatus = event.currentTarget;
            output.innerHTML += `
            <div> Changed Status for <b>${permissionStatus.name}</b>: ${permissionStatus.state}</div>
            `
        })
    } else {
        output.innerText = 'Permission API not available on this device.'
    }
}

async function handleAccelerometer() {

    // Early return statement.

    // Validates the sensor API
    if (!('Accelerometer' in window)) {
        output.innerText = 'Accelerometer not available on this device'
        return;
    }

    // We never get to this line if the accelerometer is available
    // If we are here, that means the accellerometer is available

    // Validates the Permission Api
    if (!('permissions' in navigator)) {
        output.innerText = 'Permission API not available on this device'
        return;
    }

    // Validate the accelerometer permission.
    const accelerometerPermission = await navigator.permissions.query({
        name: 'accelerometer'
    });
    if (accelerometerPermission.state !== 'granted') {
        output.innerText = 'You are not autorized to use the accelerometer sensor'
        return
    }
    //    Decleare the sensor variable. Create an instance for the Accelerometer
    let accelerometer;
    try {
        accelerometer = new Accelerometer({
            referenceFrame: 'device' // Either 'device or 'screen'
        });
    } catch (error) {
        output.innerText = 'Accelerometer error:' + error;
        return
    }

    // Listening for errors thrown during its use
    accelerometer.addEventListener('error', (event) => {
        const errorMessage = event.error;
        output.innerText = 'Accelerometer failed:' + errorMessage;
    })
    // The reading event is fired when a new reading is available on a sensor
    accelerometer.addEventListener('reading', () => {

    })
    console.log('acceleromer', accelerometer)

    // Create the helper elements
    const buttonStart = document.createElement('button')
    buttonStart.innerText = 'Start';
    output.appendChild(buttonStart)

    const buttonStop = document.createElement('button')
    buttonStop.innerText = 'Stop';
    buttonStop.disabled = true
    output.appendChild(buttonStop)

    const message = document.createElement('div');
    message.innerText = 'Click on the start button above;'
    output.appendChild(message)


    // Start the sensor

    buttonStart.addEventListener('click', () => {
        accelerometer.start();

    })
}

function handleLinearAccelerationSensor() {
    output.innerText = 'LinearAccelerationSensor.....'
}

function handleGyroscope() {
    output.innerText = 'Gyroscope......'
}

function handleGravity() {
    output.innerText = "Gravity..........."
}