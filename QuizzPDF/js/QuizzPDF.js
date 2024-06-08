//---------------------------------------BACKGROUND--------------------------------------------
/* const bgAnimation = document.getElementById('bgAnimation');

const numberOfColorBoxes = 400;

for (let i = 0; i < numberOfColorBoxes; i++) {
    const colorBox = document.createElement('div');
    colorBox.classList.add('colorBox');
    bgAnimation.append(colorBox)
} */

//---------------------------------------BACKGROUND--------------------------------------------


//---------------------------------------MODAL--------------------------------------------
// Abrir la ventana modal
document.querySelector('.config').addEventListener('click', () => {
    document.getElementById('configModal').classList.add('show');
    document.getElementById('configModal').setAttribute('aria-hidden', 'false');
});

// Cerrar la ventana modal
document.querySelector('.btn-close').addEventListener('click', () => {
    document.getElementById('configModal').classList.remove('show');
    document.getElementById('configModal').setAttribute('aria-hidden', 'true');
});

// Cerrar la ventana modal al hacer clic fuera de ella
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        document.getElementById('configModal').classList.remove('show');
        document.getElementById('configModal').setAttribute('aria-hidden', 'true');
    }
});

//---------------------------------------MODAL--------------------------------------------



//---------------------------------------MANUAL--------------------------------------------

const question = document.querySelector(".fa-question");
const pantalla = document.querySelector(".pantalla");
const x_icon = document.querySelector(".x-icon");

question.addEventListener('click', () => {
    if(pantalla.classList.contains("noVisible")){
        pantalla.classList.remove("noVisible");
        pantalla.classList.add("visible");
    }
});

x_icon.addEventListener('click', () => {
    if(pantalla.classList.contains("visible")){
        pantalla.classList.remove("visible");
        pantalla.classList.add("noVisible");
    }
});

//---------------------------------------MANUAL--------------------------------------------


//---------------------------------------DROPDOWN--------------------------------------------

const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select')
    const caret = dropdown.querySelector('.caret')
    const menu = dropdown.querySelector('.menu')
    const options = dropdown.querySelectorAll('.menu li')
    const selected = dropdown.querySelector('.selected')

    select.addEventListener('click', ()=>{
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open')
        
    });

    options.forEach(option =>{
        option.addEventListener('click', ()=>{
            selected.innerText = option.innerText;
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');
            
            options.forEach(option =>{
                option.classList.remove('active');
            })
            option.classList.add('active');
        });
        
    });
});

//---------------------------------------DROPDOWN--------------------------------------------



//---------------------------------------PDF--------------------------------------------

document.getElementById('archivoPDF').addEventListener('change', function(event) {
    const archivoPDF = event.target.files[0];
    if (archivoPDF) {
        const nombreArchivo = document.getElementById('nombreArchivo');
        nombreArchivo.textContent = `Archivo cargado: ${archivoPDF.name}`;

        const btnQuitarPDF = document.getElementById('btnQuitarPDF');

        btnQuitarPDF.addEventListener('click', function() {
            document.getElementById('archivoPDF').value = '';
            nombreArchivo.textContent = 'No se ha cargado un archivo PDF';
        });
    }
});
//---------------------------------------PDF--------------------------------------------



//---------------------------------------DECK--------------------------------------------
function addEventEditionTittle(){
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
}



//---------------------------------------DECK--------------------------------------------



//---------------------------------------DESCRIPTION-DECK--------------------------------------------

function addEventEditionDescription(){
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
    
}



//---------------------------------------DESCRIPTION-DECK--------------------------------------------


