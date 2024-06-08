


//---------------------------------------LOADER--------------------------------------------
const percentageElement = document.querySelector('.percentage');
function updatePercentage(percentage) {
    const formattedPercentage = percentage.toFixed(2) + '%';
    
    if (percentageElement) {
        percentageElement.textContent = formattedPercentage;
    }
}

function startUpdatingPercentage() {
    let percentage = 0;

    const intervalId = setInterval(() => {
        if (percentage > 100) {
            clearInterval(intervalId);
            return;
        }

        updatePercentage(percentage);
        percentage += 5;
    }, 1000);
}

startUpdatingPercentage();


//---------------------------------------LOADER--------------------------------------------
function clickGenerar() {
        document.getElementById('loader-page').classList.remove("noVisible");
        document.getElementById('loader-page').classList.add("visible");
        startUpdatingPercentage();
    }

document.getElementById('ask-button').addEventListener('click', clickGenerar);

