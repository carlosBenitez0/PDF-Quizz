//configuración de usuario
let userConfig = {"userName": null,"api_key": null};
//configuración de quizz
let structureConfig = requestOptions(0);
let creativityConfig = { index: 0, value: 0.2 };
let modelConfig = { index: 0, value: "gpt-3.5-turbo-0125" };

//verificando que la api haya sido cargada
(()=>{
    userConfig = loadLocalStorage('userConfig', `{
        "userName": null,
        "api_key": null
    }`);
    if(JSON.parse(userConfig).api_key === null){
        alert("Acceda a la configuración en la parte superior derecha e introduzca su usuario y API KEY, para usar PDF Quizz correctamente.")
    }
})();
//cargando los quizz de hor
(()=>{
    isTodayCard = true;
    LoadCardsView(loadCardsStorage('cardsStorage').cards.filter(card => card.creation_date === getCurrentDate()), true);
})();
//permite al usuario seleccionar la estructura de las preguntas
function getStructureQuestion(index) {
    structureConfig = requestOptions(index);
}
//permite al usuario la libertad de creatividad del modelo
function getCreativityValue(index) {
    switch (index) {
        case 0:
            creativityConfig = { index: index, value: 0.2 };
            break;
        case 1:
            creativityConfig = { index: index, value: 0.5 };
            break;
        default:
            creativityConfig = { index: index, value: 0.8 };
            break;
    }
}
//permite al usuario definir el modelo a utilizar
function getModel(index) {
    switch (index) {
        case 0:
            modelConfig = { index: index, value: "gpt-3.5-turbo-0125" };
            break;
        default:
            modelConfig = { index: index, value: "gpt-4o" };
            break;
    }
}
//retorna una estructura definida para las preguntas segun el indice ingresado
function requestOptions(optionsIndex) {
    switch (optionsIndex) {
        case 0:
            return `{
                "questions": [
                    {
                        "question": "Escribe aquí nombre del primer término",
                        "options": ["Definición de término 1", "Definición de término 2", "Definición de término 3", "Definición de término 4"],
                        "answer": "0"
                    },
                    {
                        "question": "Escribe aquí la definición del segundo término",
                        "options": ["Nombre de término 1", "Nombre de término 2", "Nombre de término 3", "Nombre de término 4"],
                        "answer": "1"
                    },
                    {
                        "question": "Escribe aquí la definición del tercer término",
                        "options": ["Nombre de término 1", "Nombre de término 2", "Nombre de término 3", "Nombre de término 4"],
                        "answer": "1"
                    },
                    {
                        "question": "Escribe aquí nombre del cuarto término",
                        "options": ["Definición de término 1", "Definición de término 2", "Definición de término 3", "Definición de término 4"],
                        "answer": "0"
                    }
                ]
            }`+ 
            "Solo utilizar términos clave y su definición. NO se debe usar signos de interrogación en los ítems del cuestionario; solo un concepto y su definición. Si no se encuentra un concepto no generar nada como resultado.";
        case 1:
            return `{
                "questions": [
                    {
                        "question": "¿[Escribe aquí la primera pregunta]?",
                        "options": ["Respuesta 1", "Respuesta 2", "Respuesta 3", "Respuesta 4"],
                        "answer": "0"
                    },
                    {
                        "question": "¿[Escribe aquí la segunda pregunta]?",
                        "options": ["Respuesta 1", "Respuesta 2", "Respuesta 3", "Respuesta 4"],
                        "answer": "1"
                    },
                    {
                        "question": "¿[Escribe aquí la primera pregunta]?",
                        "options": ["Respuesta 1", "Respuesta 2", "Respuesta 3", "Respuesta 4"],
                        "answer": "3"
                    },
                    {
                        "question": "¿[Escribe aquí la segunda pregunta]?",
                        "options": ["Respuesta 1", "Respuesta 2", "Respuesta 3", "Respuesta 4"],
                        "answer": "1"
                    }
                ]
            }`;
        default:
            return `{
                "questions": [
                    {
                        "question": "Escribe aquí nombre del primer concepto",
                        "options": ["Definición de concepto 1", "Definición de concepto 2", "Definición de concepto 3", "Definición de concepto 4"],
                        "answer": "0"
                    },
                                        {
                        "question": "¿[Escribe aquí la segunda pregunta]?",
                        "options": ["Respuesta 1", "Respuesta 2", "Respuesta 3", "Respuesta 4"],
                        "answer": "2"
                    },
                    {
                        "question": "Escribe aquí la definición del tercer concepto",
                        "options": ["Nombre de concepto 1", "Nombre de concepto 2", "Nombre de concepto 3", "Nombre de concepto 4"],
                        "answer": "1"
                    },
                    {
                        "question": "Escribe aquí la definición del cuarto concepto",
                        "options": ["Nombre de concepto 1", "Nombre de concepto 2", "Nombre de concepto 3", "Nombre de concepto 4"],
                        "answer": "4"
                    },
                                        {
                        "question": "¿[Escribe aquí la quinta pregunta]?",
                        "options": ["Respuesta 1", "Respuesta 2", "Respuesta 3", "Respuesta 4"],
                        "answer": "0"
                    },
                    {
                        "question": "Escribe aquí nombre del sexto concepto",
                        "options": ["Definición de concepto 1", "Definición de concepto 2", "Definición de concepto 3", "Definición de concepto 4"],
                        "answer": "0"
                    },
                    {
                        "question": "¿[Escribe aquí la septima pregunta]?",
                        "options": ["Respuesta 1", "Respuesta 2", "Respuesta 3", "Respuesta 4"],
                        "answer": "3"
                    },
                    {
                        "question": "¿[Escribe aquí la octava pregunta]?",
                        "options": ["Respuesta 1", "Respuesta 2", "Respuesta 3", "Respuesta 4"],
                        "answer": "1"
                    }
                ]
            }`;
    }
}

//bloques de texto de < 1024 palabras
let documentText = [];
//primera página que se tomará del documento pdf
let startInterval = 0;
//últimam página que se tomará del documento pdf
let finishInterval = 0;
//cantidad general de preguntas que se deber realizar de todo el pdf
let questionsAmount = 1;
async function extractTextFromPDF() {
    const fileInput = document.getElementById('archivoPDF');
    const options = document.getElementById('question').value;
    //let text = document.getElementById('pdf-text').textContent;
    const questionOptions = options.split(",");
    startInterval = questionOptions[0].split("-")[0];
    finishInterval = questionOptions[0].split("-")[1];
    questionsAmount = questionOptions[1];

    if (fileInput.files.length === 0) {
        alert('Please select a PDF file first.');
        return;
    }
    if (!options) {
        alert('Porfavor, defina el intervalo de páginas a utilizar y la cantidad total de preguntas a generar: [incio intervalo]-[final intervalo],[cantidad maxima preguntas]. NO DEJAR ESPACIOS.');
        return;
    }

    const file = fileInput.files[0];
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

    try {
        const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file));
        const pdf = await loadingTask.promise;
        //let text = '';

        documentText = [];
        let textBlock = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            if (i >= startInterval && i <= finishInterval) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                //text += pageText + '\n';
                const wordsInTextBlock = textBlock.split(" ").length;
                if ((wordsInTextBlock + pageText.split(" ").length) >= (1024 * 1)) {
                    // console.log((wordsInTextBlock + pageText.split(" ").length));
                    documentText.push(textBlock);
                    //console.log("Text Block: ", textBlock, wordsInTextBlock);
                    textBlock = pageText;
                } else {
                    //console.log((wordsInTextBlock + pageText.split(" ").length));
                    textBlock += pageText;
                    if (i == finishInterval) {
                        documentText.push(textBlock);
                        //console.log("Text Block único: ", textBlock, wordsInTextBlock);
                        textBlock = "";
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
    }
}

function cleanJsonResponse(response) {
    return response.replace(/```json|```/g, '').trim();
}

async function askQuestion() {
    if (JSON.parse(userConfig).api_key === null) {
        alert("Acceda a la configuración en la parte superior derecha e introduzca su usuario y API KEY, para usar PDF Quizz correctamente.")
    } else {
        //extrayendo el texto del pdf y creando bloques de texto
        await extractTextFromPDF();
        if (documentText.length > 0) {
            //iniciar animación de generando quizz
            visibleLoader();
            //actualizando el porcentaje de progreso
            updatePercentage(0.00);

            //listado de las preguntas generadas
            const generatedQuestions = await generateQuestions(documentText.length, questionsAmount);
            await invisibleLoader();
            if (generatedQuestions.length > 0) await saveNewCard(generatedQuestions);
        }
    }
}

async function generateQuestions(textBlocksLength, questionsAmount){
    //configuración seleccionada
    const questionStructure = structureConfig;
    const creativity = creativityConfig.value;
    const model = modelConfig.value;
    const apiKey = JSON.parse(userConfig).api_key;

    //configuración del tiempo de petición
    const controller = new AbortController();
    const signal = controller.signal;

    let generatedQuestions = [];
    //solicita generar x cantidad de preguntas por cada bloque de texto (< 1024 palabras)
    for (let i = 0; i < textBlocksLength; i++) {
        //preguntas a generar
        let maxQuestionPerBlock = Math.round(parseInt(questionsAmount) / textBlocksLength);
        //si es el ultimo bloque las preguntas a generar es la diferencia entre la cantidad generada y solicitada
        if (parseInt(questionsAmount) - generatedQuestions.length < maxQuestionPerBlock) {
            maxQuestionPerBlock = parseInt(questionsAmount) - generatedQuestions.length;
        }
        
        //se solicita al chat que genere las preguntas
        const responseResult = await getResponse(signal, controller, apiKey, i, textBlocksLength, documentText[i], maxQuestionPerBlock, model, questionStructure, creativity);

        if (responseResult.execute) {
            //se agregan al listado de preguntas generadas
            responseResult.questions.forEach(question => {
                generatedQuestions.push(question);
            });
        } else {
            return generatedQuestions;
        }
    }

    return generatedQuestions;
}

async function getResponse(signal, controller, apiKey, index, blocks, textBlock, maxQuestionPerBlock, model, questionStructure, creativity) {
    let documentPercent = ((index + 1) / blocks) * 100;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente experto en redacción de cuestionarios para exámenes tomando como base un bloque de texto, tu finalidad es ayudar a los estudiantes a prepararse para los exámenes. " +
                        "Usas información que se extrae de un documento en formato PDF y redactar un cuestionario que englobe todo el contenido de cada bloque de texto." +
                        " el cuestionario generado ayuda al estudiante a prepararse para futuros exámenes." +
                        "Reglas del sistema: " +
                        "1. Genera un JSON válido usando exactamente el siguiente formato de ejemplo y asegúrate de que el JSON esté correctamente formateado y pueda ser parseado sin errores con JSON.parse():" +
                        `${questionStructure}`
                },
                {
                    role: "user", content:
                        `Texto: este es el bloque de texto ${(index + 1)}/${blocks} y su contenido: << ${textBlock}\n >> Reglas del usuario :1. Generar la exacta cantidad de ${maxQuestionPerBlock} elementos del cuestionario.` +
                        `2. Recuerda los mensajes previos para dar mejor contexto a las preguntas generadas.` +
                        `3. Si el porcentaje del documento es menor al 100% recordar los mensajes previos, si no, borrar contenido de la conversación. Porcentaje del documento: ${documentPercent}%.`
                }
            ],
            temperature: creativity
        }),
        signal: signal
    };

    const fetchPromise = fetch('https://api.openai.com/v1/chat/completions', requestOptions);
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Timeout exceeded'));
            controller.abort();
        }, 5 * 60000); // 5 minutos de tiempo de espera
    });

    let responseData = null;

    /*const response = await Promise.race([fetchPromise, timeoutPromise]);
    responseData = await response.json();

    let segment = responseData.choices[0].message.content;
    segment = cleanJsonResponse(segment);
    const questions = JSON.parse(segment).questions;

    console.log(documentPercent.toFixed(2) + "%", (index + 1), "/", documentText.length);
    updatePercentage(documentPercent);
    return (questions,true);*/
    let resultResponse = {questions:[], execute:false};
    await Promise.race([fetchPromise, timeoutPromise]).then(async (result) => {
        responseData = await result.json();
        let segment = responseData.choices[0].message.content;
        segment = cleanJsonResponse(segment);
        const questions = JSON.parse(segment).questions;
        console.log(documentPercent.toFixed(2) + "%", (index + 1), "/", documentText.length);
        updatePercentage(documentPercent);
        resultResponse = {questions:questions, execute:true};
    }).catch(async (e) => {
        if (responseData) {
            try {
                alert(responseData.error.message);
                await invisibleLoader();
                resultResponse = {questions:[], execute:false};
            } catch (e) {
                console.error("Mal formato de respuesta. Iniciando nueva petición.", e);
                await getResponse(signal, controller, apiKey, index, blocks, textBlock, maxQuestionPerBlock, model, questionStructure, creativity);
            }
        } else {
            alert("Error de conexión. Es necesario tener una conexión estable a internet para usar el servicio.");
            await invisibleLoader();
            resultResponse = {questions:[], execute:false};
        }
    });
    return resultResponse;

}

async function saveNewCard(generatedQuestions){
    try {
        const localStorage = loadCardsStorage('cardsStorage');
        const newCard = {
            id: generateUUID(),
            name: "PDF Quizz " + (localStorage.cards.length + 1),
            questions: generatedQuestions,
            total: generatedQuestions.length,
            creation_date: getCurrentDate(),
            description:"Descripción editable",
            score: 0.0,
            folder_id: null
        };

        localStorage.cards.push(newCard);
        localStorage.cardsTotal = localStorage.cards.length;
        saveLocalStorage('cardsStorage', localStorage);

        console.log("localStorage:", loadCardsStorage('cardsStorage'));
        console.log("Proceso terminado");

        LoadCardsView(loadCardsStorage('cardsStorage').cards.filter(card => card.creation_date === getCurrentDate()), true);

    } catch (error) {
        console.error("Mal formato de respuesta. Iniciando nueva petición.", error);
    }
}

function getCurrentDate() {
    const hoy = new Date();

    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0'); // Los meses son indexados desde 0
    const año = hoy.getFullYear();

    return `${dia}/${mes}/${año}`;
}


