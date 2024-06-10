
const preguntasNumero = document.querySelector(".pregunta-numero");
const preguntasTexto = document.querySelector(".pregunta-texto");
const contenedorOpcion = document.querySelector(".contenedor-opcion");
const contenedorIndicadorRespuestas = document.querySelector(".indicador-respuestas");
const HOMECAJA = document.querySelector(".home-caja");
const quizCaja = document.querySelector(".caja-Quiz");
const cajaResultado = document.querySelector(".caja-Resultado");
const puntajeScore = document.querySelector(".contador-puntaje");
const puntScore = document.querySelector(".contador-puntaje");


let preguntaContador = 0;
let preguntaActual;
let preguntasDisponibles = [];
let opcionesDispo = [];
let respuestasCorrectas = 0;
let intento = 0;
let score = 0;
let subirPuntaje = 100;




//enviando las preguntas al array preguntasDisponibles
function setPreguntasDisponibles(){
    const totalPreguntas = quiz.questions.length;
    for(let i = 0; i<totalPreguntas; i++){
        preguntasDisponibles.push(quiz.questions[i])
    }
}

//colocar el numero las pregunttas y las opciones
function obtenerNuevaPregunta(){
    //colocar numero de pregunta
    preguntasNumero.innerHTML = "Pregunta " + (preguntaContador + 1) + " de " + quiz.questions.length;
    //colocar pregunta
    //obtener pregunta aleatoria
    const preguntaIndex = preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)]
    preguntaActual = preguntaIndex;
    preguntasTexto.innerHTML = preguntaActual.question;
    //obtener la posicion de preguntaindex de la matriz preguntasDisponibles
    const index1 = preguntasDisponibles.indexOf(preguntaIndex);
    //remover la posicion de preguntaindex de la matriz preguntasDisponibles, asi que la pregunta no se repite
    preguntasDisponibles.splice(index1,1);

    //colocar opciones
    //obteniendo longitud de opciones
    //console.log(preguntaActual);
    const opcionLongitud = preguntaActual.options.length
    //lanzar las opciones a la matriz opcionesDispo
    for(let i=0; i<opcionLongitud; i++){
        opcionesDispo.push(i)
      
    }

    contenedorOpcion.innerHTML = '';
    let animationDelay = 0.15;

    //crear opciones en HTML
    for(let i = 0; i<opcionLongitud; i++){
        //opcion aleatoria
        const opcionIndex = opcionesDispo[Math.floor(Math.random() * opcionesDispo.length)];
        //obtener la posicion de opcionIndex desde la matriz opcionesDispo
        const index2 = opcionesDispo.indexOf(opcionIndex);
        //remueve opcionindex de la matriz opcionesDispo, la opcion no se repite
        opcionesDispo.splice(index2,1);
        const opcion = document.createElement("div");
        opcion.innerHTML = preguntaActual.options[opcionIndex];
        opcion.id = opcionIndex;
        opcion.style.animationDelay = animationDelay + 's';
        animationDelay = animationDelay + 0.15;
        opcion.className = "opcion";
        contenedorOpcion.appendChild(opcion)
        opcion.setAttribute("onclick","getResult(this)");
        //opcion.setAttribute("onclick","getResult(this)");
    }

    preguntaContador ++
}

//obteniendo el resultado del intento  de la pregunta actual
function getResult(element){
    const id = parseInt(element.id);
    //obteniendo la respuesta por comparacion del id del la opcion clikeada
    if(id === parseInt(preguntaActual.answer)){
        //colocando el color verde a la opcion correcta
        element.classList.add("correcto")
        //agregar el indicador de marka correcta
        actualizarIndicadorRespuesta("correcto");
        respuestasCorrectas++;
        //console.log("correctas:" + respuestasCorrectas)
        colocarPuntaje()
    }
    else{
        //colocando el rojo verde a la opcion incorrecta
        element.classList.add("incorrecto")
        //agregar el indicador de marka incorrecta
        actualizarIndicadorRespuesta("incorrecto");

        //si se selecciona la respuesta incorrecta se coloreará de verde la respuesta correcta
        const opcionLongitud = contenedorOpcion.children.length;
        for(let i=0; i<opcionLongitud; i++){
            if(parseInt(contenedorOpcion.children[i].id) === parseInt(preguntaActual.answer)){
                contenedorOpcion.children[i].classList.add("correcto"); 
            }
        }
    }
    intento++;

    imposibleHacerClickOpciones();

}


function colocarPuntaje(){
    puntajeScore.innerHTML = (score + subirPuntaje);   
    //puntajeScore.querySelector(".contador-puntaje").innerHTML = toString(score + subirPuntaje);
    //console.log("puntaje" + (score + subirPuntaje))
    score = (score + 100);
    //console.log(typeof parseInt(puntajeScore))
   // console.log(typeof subirPuntaje)
    //console.log(typeof score)
}
//haciendo todas las opciones imposibles de seleccionar una vez el usuario seleccione una
function imposibleHacerClickOpciones(){
    const opcionLongitud = contenedorOpcion.children.length;
    for(let i=0; i< opcionLongitud; i++){
        contenedorOpcion.children[i].classList.add("ya-contestada");
    }
}

function respuestasIndicador(){
    contenedorIndicadorRespuestas.innerHTML = '';
    const totalPregunta = quiz.questions.length;
    for(let i=0; i<totalPregunta; i++){
        const indicador = document.createElement("div");
        contenedorIndicadorRespuestas.appendChild(indicador);

    }
}

function actualizarIndicadorRespuesta(markType){
    contenedorIndicadorRespuestas.children[preguntaContador-1].classList.add(markType)

}

function siguiente(){
    if(preguntaContador === quiz.questions.length){
        console.log("Quiz Terminado")
        quizTerminado();
    }else{
        obtenerNuevaPregunta();
    }
}

function quizTerminado(){
    //ocultar quiz-caja
    quizCaja.classList.add("hide");
    //mostrar  caja resultado
    cajaResultado.classList.remove("hide");
    quizResultado();

}


//obtener el resultado de quiz
function quizResultado(){
    cajaResultado.querySelector(".user").innerHTML = JSON.parse(obtenerUsuario()).userName;
    cajaResultado.querySelector(".total-preguntas").innerHTML = quiz.questions.length;
    cajaResultado.querySelector(".total-intento").innerHTML = intento;
    cajaResultado.querySelector(".total-correctas").innerHTML = respuestasCorrectas;
    cajaResultado.querySelector(".total-equivocadas").innerHTML = intento - respuestasCorrectas;
    const porcentaje = (respuestasCorrectas/quiz.questions.length) * 100;
    cajaResultado.querySelector(".porcentage").innerHTML = porcentaje.toFixed(2) + "%";
    cajaResultado.querySelector(".total-puntaje").innerHTML = score;
    //.innerHTML = (score + subirPuntaje);

    GuardarPuntaje((respuestasCorrectas/quiz.questions.length)*10);

}

function resetearQuiz(){
    preguntaContador = 0;
    respuestasCorrectas = 0;
    intento = 0;
    score = (score - score);
    puntajeScore.innerHTML = ''; 

}


function intentarOtraVezQuiz(){
    //ocultar la caja de resultados
    cajaResultado.classList.add("hide");
    //mostrar las quizCaja
    quizCaja.classList.remove("hide");
    resetearQuiz();
    comenzarQuiz();

}

/*function irInicio(){
    //ocultar caja resultado
    cajaResultado.classList.add("hide");
    //mostrar homeCaja
    homeCaja.classList.remove("hide");
    resetearQuiz();
}*/

//punto de partida

function comenzarQuiz(){
    //mostrando quiz caja
    quizCaja.classList.remove("hide");
    //primero se pondrán todas las preguntas en  el array preguntasDisponibles
    setPreguntasDisponibles();
    //segundo llamaremos a la funcion getnuevaPregunta()
    obtenerNuevaPregunta();
    //crear indicador de respuestas
    respuestasIndicador();
}
comenzarQuiz();

function GuardarPuntaje(score) {
    //listado de cards
    const localStorage = loadCardsStorage('cardsStorage');
    //encontrando el quizz realzado usando su UUID
    const cardSelected = localStorage.cards.filter(card => card.id === quiz.id);
    //se verifica que se ha encontrado un quizz
    if(cardSelected){
        localStorage.cards.filter(card => card.id === quiz.id)[0].score = score.toFixed(2);
    }
    saveLocalStorage('cardsStorage',localStorage);
    
}

function obtenerUsuario(){
    //acceder a los datos del usuario para econtrar su nombre
    return loadLocalStorage('userConfig',`{
        "userName": null,
        "api_key": null
    }`);
}


/*window.onload = function(){
    homeCaja.querySelector(".total-preguntas").innerHTML = quiz.questions.length;
}*/
