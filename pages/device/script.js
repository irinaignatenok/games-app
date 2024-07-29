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
    output.innerText = 'Network Information ...'

}
function handleFullscreenAPI() {
    output.innerText = "Fullscreen API ...."
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