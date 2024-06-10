    //obtener un referencia a las tres columnas
    const column1 = document.querySelector('#column1');
    const column2 = document.querySelector('#column2');
    const column3 = document.querySelector('#column3');

    //indica si el script esta siendo usado para mostrar los quizzes de dia actual
    let isTodayCard = false;

function selectedCard(selectedCardIndex){
    const localStorage = loadCardsStorage('cardsStorage');
    saveLocalStorage('selectedCard',localStorage.cards[selectedCardIndex])
}

function deleteCard(index){
    const localStorage = loadCardsStorage('cardsStorage');
    localStorage.cards.splice(parseInt(index),1);
    saveLocalStorage('cardsStorage',localStorage);
    if(isTodayCard){
        LoadCardsView(loadCardsStorage('cardsStorage').cards.filter(card => card.creation_date === getCurrentDate()), true);
    }else{
        LoadCardsView(loadCardsStorage('cardsStorage'), false);
    }
    changeValueMegas(((globalThis.localStorage.getItem('cardsStorage').length) / (1024 * 1024)).toFixed(2),5);
}

function updateCardTitle(index, newTitle){
    const localStorage = loadCardsStorage('cardsStorage');
    localStorage.cards[parseInt(index)].name = newTitle;
    saveLocalStorage('cardsStorage',localStorage);
    if(isTodayCard){
        LoadCardsView(loadCardsStorage('cardsStorage').cards.filter(card => card.creation_date === getCurrentDate()), true);
    }else{
        LoadCardsView(loadCardsStorage('cardsStorage'), false);
    }
    changeValueMegas(((globalThis.localStorage.getItem('cardsStorage').length) / (1024 * 1024)).toFixed(2),5);
}

function updateCardDescription(index, newDescription){
    const localStorage = loadCardsStorage('cardsStorage');
    const card = localStorage.cards[parseInt(index)];
    card.description = newDescription;
    localStorage.cards[parseInt(index)] = card;
    saveLocalStorage('cardsStorage',localStorage);
    if(isTodayCard){
        LoadCardsView(loadCardsStorage('cardsStorage').cards.filter(card => card.creation_date === getCurrentDate()), true);
    }else{
        LoadCardsView(loadCardsStorage('cardsStorage'), false);
    }
}

//last cards indica si se están mostrando las mas cards de hoy o no
function LoadCardsView(localStorage, lastCards){
    let cards = [];
    let isTodayCard = false;
    if(lastCards === true) {
        cards = localStorage;
        isTodayCard = true;
    }else{
        cards = localStorage.cards;
        isTodayCard = false;
    }
    //indice que indica en que columna se esta creando el card
    //1,2,3 --> al detectar un 3 vuelve a 1
    let index = 1;
    //limpiar el html
    column1.innerHTML = "";
    column2.innerHTML = "";
    column3.innerHTML = "";

    cards.forEach(card => {
        switch (index) {
            case 1:
                addDeck(column1, card, cards.indexOf(card));
                index ++;
              break;
            case 2:
                addDeck(column2, card, cards.indexOf(card));
                index ++;
              break;
            default:
                addDeck(column3, card, cards.indexOf(card));
                index ++;
              if(index === 4)index = 1;
              break;
          }   
    });

    cards.forEach(card => {
        makeTitleAndDescriptionEditable(cards.indexOf(card));
    });
    
    const storage = loadCardsStorage('cardsStorage');
    changeValueMegas((JSON.stringify(storage).length/ (1024 * 1024)).toFixed(2),5);
}

//LoadCardsView(loadCardsStorage('cardsStorage'), false);

/**
 * 
 * @param {Element} columnX 
 */
function addDeck(columnX, card, cardIndex){
        columnX.innerHTML += `
        <div class="container" id="card_${cardIndex}">
            <div class="card">
                <div class="glass1">
                    <div class="glass glass2">
                        <div class="glass glass3">
                            <div class="top-deck-container">
                                <div class="num-container">
                                    <div class="num-rombo">
                                        <span class="num">${cardIndex + 1}</span>
                                    </div>
                                </div>
                                <div class="tittle-container">
                                    <p class="title-mid">${card.name}</p>
                                </div>
                                <div class="x-container">
                                    <i class="fa-solid fa-x" onclick="deleteCard(${cardIndex})"></i>
                                </div>
                            </div>
                            <div class="mid-deck-container">
                                <div class="logo-mid-container">
                                    <img src="../multimedia/logo2.png" alt="" >
                                    <div class="description-popup">
                                        <p class="description-text">${card.description}</p>
                                        <div class="close-instruction">Retire el cursor del cuadro para cerrarlo</div>
                                    </div>
                                </div>
                            </div>
                            <div class="overlay"></div>
                            <div class="bottom-deck-container">
                                <div class="cuantity">
                                    <span class="preguntas">${card.questions.length}p / </span>
                                    <span class="nota">${card.score}</span>
                                </div>
                                
                                <div class="backdrop-b-container">
                                    <div class="bottom-back-container submit button-deck">
                                        <a onclick="selectedCard(${cardIndex})" href="../html/quiz.html" class="a-quizz">Comenzar</a>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>  
            </div>
        </div>
        `;

        //makeDescriptionEditable(popupElement[0], cardIndex);
        
}

function makeTitleAndDescriptionEditable(cardIndex){
    const lastCardElement = document.querySelector(`#card_${cardIndex}`);
    const lastCardName = lastCardElement.getElementsByClassName('title-mid');

    //haciando que cada vez que se le de click en el nombre del card este permita editar el título
    makeEditable(lastCardName[0], cardIndex);

    //console.log(lastCardName);
    const popupElement = lastCardElement.getElementsByClassName('description-popup');
    makeDescriptionEditable(popupElement[0], cardIndex);

    const overlayElement = lastCardElement.getElementsByClassName('overlay');
    const midDeckContainerElement = lastCardElement.getElementsByClassName('mid-deck-container');

    midDeckContainerElement[0].addEventListener('mouseenter', function () {
        showPopup(popupElement[0], overlayElement[0]);   
    });
    midDeckContainerElement[0].addEventListener('mouseleave', function () {
        hidePopup(popupElement[0], overlayElement[0]);
    });
}

function makeEditable(element, cardIndex) {
    element.addEventListener('click', function () {
        const p = this;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = p.textContent;
        input.className = `title-mid`;
        p.replaceWith(input);
        input.focus();

        input.addEventListener('blur', function () {
            const newP = document.createElement('p');
            newP.textContent = this.value;
            newP.className = `title-mid`;
            makeEditable(newP);
            this.replaceWith(newP);
        });

        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                this.blur();
                updateCardTitle(cardIndex,input.value);
            }
        });
    });
}

function makeDescriptionEditable(popup, cardIndex) {
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
            makeDescriptionEditable(popup);
        });

        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                this.blur();
                updateCardDescription(cardIndex,input.value);
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

const b_megas = document.querySelector(".b-megas");

function changeValueMegas(megas, maxMegas){
    b_megas.textContent = megas + "mb/" + maxMegas + "mb"
}