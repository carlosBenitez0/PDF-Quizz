


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
            invisibleLoader();
            return;
        }

        updatePercentage(percentage);
        percentage += 20;
    }, 1000);
}


//---------------------------------------LOADER--------------------------------------------
//hacerlo visible
function visibleLoader() {
    document.getElementById('loader-page').classList.remove("noVisible");
    document.getElementById('loader-page').classList.add("visible");
    startUpdatingPercentage();
}

//hacerlo invisible
function invisibleLoader() {
    document.getElementById('loader-page').classList.remove("visible");
    document.getElementById('loader-page').classList.add("noVisible");
}

document.getElementById('ask-button').addEventListener('click', visibleLoader);

