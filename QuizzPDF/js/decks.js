document.addEventListener('DOMContentLoaded', function () {
    function makeEditable(element) {
        element.addEventListener('click', function () {
            const p = this;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = p.textContent;
            input.className = 'title-mid';
            p.replaceWith(input);
            input.focus();

            input.addEventListener('blur', function () {
                const newP = document.createElement('p');
                newP.textContent = this.value;
                newP.className = 'title-mid';
                makeEditable(newP);
                this.replaceWith(newP);
            });

            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    this.blur();
                }
            });
        });
    }

    document.querySelectorAll('.title-mid').forEach(makeEditable);
});


//---------------------------------------DECK--------------------------------------------



//---------------------------------------DESCRIPTION-DECK--------------------------------------------


document.addEventListener('DOMContentLoaded', function () {
    function makeDescriptionEditable(popup) {
        const descriptionText = popup.querySelector('.description-text');

        descriptionText.addEventListener('click', function () {
            const p = this;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = p.textContent;
            input.className = 'description-input';
            p.replaceWith(input);
            input.focus();

            input.addEventListener('blur', function () {
                const newP = document.createElement('p');
                newP.textContent = this.value;
                newP.className = 'description-text';
                this.replaceWith(newP);
                makeDescriptionEditable(newP.closest('.description-popup'));
            });

            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    this.blur();
                }
            });
        });
    }

    function showPopup(popup, overlay) {
        popup.style.display = 'block';
        overlay.style.display = 'block';
        popup.style.zIndex = '1001'; // Establecer un alto valor de z-index
    }

    function hidePopup(popup, overlay) {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }

    const overlays = document.querySelectorAll('.overlay');
    const popups = document.querySelectorAll('.description-popup');
    const glassContainers = document.querySelectorAll('.glass3');
    const midDeckContainers = document.querySelectorAll('.mid-deck-container');

    midDeckContainers.forEach((container, index) => {
        container.addEventListener('mouseenter', function () {
            popups.forEach((popup, idx) => {
                if (idx === index) {
                    showPopup(popup, overlays[idx]);
                } else {
                    hidePopup(popup, overlays[idx]);
                }
            });
        });

        container.addEventListener('mouseleave', function () {
            popups.forEach((popup, idx) => {
                hidePopup(popup, overlays[idx]);
            });
        });

        makeDescriptionEditable(popups[index]);
    });
});



//---------------------------------------DESCRIPTION-DECK--------------------------------------------