    //obtener un referencia a las tres columnas
    const column1 = document.querySelector('#column1');
    const column2 = document.querySelector('#column2');
    const column3 = document.querySelector('#column3');

function selectedCard(selectedCardIndex){
    const localStorage = loadCardsStorage('cardsStorage');
    saveLocalStorage('selectedCard',localStorage.cards[selectedCardIndex])
}

function deleteCard(index){
    const localStorage = loadCardsStorage('cardsStorage');
    localStorage.cards.splice(parseInt(index),1);
    saveLocalStorage('cardsStorage',localStorage) 
    LoadCardsView(loadCardsStorage('cardsStorage'), false);
}

function LoadCardsView(localStorage, lastCards){
    let cards = []
    if(lastCards === true) {
        cards = localStorage;
    }else{
        cards = localStorage.cards;
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
}
LoadCardsView(loadCardsStorage('cardsStorage'), false);

/**
 * 
 * @param {Element} columnX 
 */
function addDeck(columnX, card, cardIndex){
        columnX.innerHTML += `
        <div class="container">
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
                                        <p class="description-text">Descripción editable</p>
                                        <div class="close-instruction">Retire el cursor del cuadro para cerrarlo</div>
                                    </div>
                                </div>
                            </div>
                            <div class="overlay"></div>
                            <div class="bottom-deck-container">
                                <div class="cuantity">
                                    <span class="preguntas">${card.questions.length}p / </span>
                                    <span class="nota">8.9</span>
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
}