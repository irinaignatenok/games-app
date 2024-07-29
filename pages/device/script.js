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
    output.innerText = "Screen Orientation API ....."
}

function handleVibrationAPI() {
    output.innerText = 'Vibration API ...'
}

function handlePageVisibility() {
    output.innerText = "Page Visibility"
}

function handleIdleDetectionAPI() {
    output.innerText = 'Idle Detection API ...'
}

function handleScreenWakeLockAPI() {
    output.innerText = 'Screen Wake Lock API ....'
}

function handleGeolocationAPI() {
    output.innerText = 'Geolocation API....'
}

function handlePermissionAPI() {
    output.innerText = 'Permissions....'
}

function handleAccelerometer() {
    output.innerText = 'Accelerometer...'
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