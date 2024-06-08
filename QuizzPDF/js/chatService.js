
  //document.getElementById('extract-button').addEventListener('click', extractTextFromPDF);
  document.getElementById('ask-button').addEventListener('click', askQuestion);
  
  async function extractTextFromPDF() {
      const fileInput = document.getElementById('archivoPDF');
      if (fileInput.files.length === 0) {
          alert('Please select a PDF file first.');
          return;
      }
  
      const file = fileInput.files[0];
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';
  
      try {
          const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file));
          const pdf = await loadingTask.promise;
          let text = '';
  
          for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map(item => item.str).join(' ');
              text += pageText + '\n';
          }
  
          document.getElementById('pdf-text').textContent = text;
      } catch (error) {
          console.error('Error extracting text from PDF:', error);
      }
  }
  
  function cleanJsonResponse(response) {
      return response.replace(/```json|```/g, '').trim();
  }
  
  async function askQuestion() {
     extractTextFromPDF();

      const amount = document.getElementById('question').value;
      let text = document.getElementById('pdf-text').textContent;
  
      if (!amount) {
          alert('Please enter a question.');
          return;
      }
  
      const questionsAmount = parseInt(amount, 10);
      const questionStructure = "Términos y definiciones";
      const dificulty = "Baja";
  
      let generatedText = '';
      let totalTokensGenerated = 0;
      const MAX_TOKEN_PER_SEGMENT = 2048;
      const MAX_TOTAL_TOKENS = 16000;
  
      const controller = new AbortController();
      const signal = controller.signal;
  
      while (totalTokensGenerated < MAX_TOTAL_TOKENS) {
          const requestOptions = {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer`
                  
              },
              body: JSON.stringify({
                  model: "gpt-3.5-turbo-0125",
                  messages: [
                      {
                          role: "system",
                          content: "Eres un asistente experto en redacción de preguntas para exámenes, que ayuda a los estudiantes a prepararse para los exámenes. " +
                              "Usas información que se extrae de un documento en formato PDF y redactar preguntas que engloben todo el contenido." +
                              " Las preguntas y sus respuestas generadas ayudan al estudiante a prepararse para futuros exámenes." +
                              "Genera un JSON válido usando exactamente el siguiente formato de ejemplo y asegúrate de que el JSON esté correctamente formateado y pueda ser parseado sin errores con JSON.parse():" +
                              `{
                                  "questions": [
                                      {
                                          "question": "Escribe aquí la primera pregunta",
                                          "options": ["Respuesta 1", "Respuesta 2", "Respuesta 3", "Respuesta 4"],
                                          "answer": "0"
                                      },
                                      {
                                          "question": "Escribe aquí la segunda pregunta",
                                          "options": ["Respuesta 1", "Respuesta 2", "Respuesta 3", "Respuesta 4"],
                                          "answer": "1"
                                      }
                                  ],
                                  "total_questions": "Número total de preguntas"
                              }` +
                              " VERIFICA que en el JSON generado, NO DEBE tener una coma después del último elemento de un arreglo o de un objeto." +
                              " No aceptas preguntas que no estén relacionadas con el contenido del documento." +
                              " Una vez generadas la cantidad exacta de preguntas solicitadas por el usuario no generar más."
                      },
                      { role: "user", content: 
                          `Texto: ${text}\n\nPregunta: Generar la exacta cantidad de ${questionsAmount} preguntas. ` +
                          `La estructura de las preguntas debe ser estrictamente de: ${questionStructure}, ` + 
                          `y la dificultad para responder solo usando la lógica es: ${dificulty}. ` +
                          `A más alta la dificultad las posibles respuestas son más confusas y requieren de conocimiento específico que está dentro del documento.` +
                          "El ORDEN de las OPCIONES DE RESPUESTA debe estar en orden ALEATORIO."
                      }
                  ],
                  max_tokens: MAX_TOKEN_PER_SEGMENT,
                  temperature: 0.2
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
  
          try {
              const response = await Promise.race([fetchPromise, timeoutPromise]);
              const responseData = await response.json();
  
              let segment = responseData.choices[0].message.content;
              segment = cleanJsonResponse(segment);
              generatedText += segment;
              text += segment;
  
              const segmentTokens = segment.split(' ').length;
              totalTokensGenerated += segmentTokens;
  
              const parsedSegment = JSON.parse(segment);
              if (parsedSegment.questions.length === questionsAmount) {
                  break;
              }
  
              if (segmentTokens < MAX_TOKEN_PER_SEGMENT) {
                  break;
              }
          } catch (error) {
              console.error(error);
              break;
          }
      }
  
      try {
          let questionNumber = 1;
          const parsedGeneratedText = JSON.parse(generatedText);
  
          const localStorage = loadCardsStorage('cardsStorage');
          const newCard = {
              id: generateUUID(),
              name: "Quizz " + (localStorage.cards.length + 1),
              questions: parsedGeneratedText.questions,
              total: parsedGeneratedText.total_questions,
              creation_date: getCurrentDate(),
              folder_id: null
          };
          localStorage.cards.push(newCard);
          localStorage.cardsTotal = localStorage.cards.length;
          saveLocalStorage('cardsStorage', localStorage);
  
          console.log("localStorage:", loadCardsStorage('cardsStorage'));
          console.log("TOKENS: OUTPUT =", totalTokensGenerated, ", INPUT =", text.split(' ').length);
          console.log("Proceso terminado");
          
          LoadCardsView(loadCardsStorage('cardsStorage').cards.filter(card => card.creation_date === getCurrentDate()), true);

      } catch (error) {
          console.error("Mal formato de respuesta. Iniciando nueva petición.", error);
          await askQuestion();
      }
  }
  
  /*function getAnswersView(answersArray, correctIndex) {
      let answers = "<ul>";
      const correctAnswer = answersArray[parseInt(correctIndex)];
      const randomArray = shuffleArray(answersArray);
      randomArray.forEach(element => {
          if (correctAnswer === element) {
              answers += `<li>${element} - Correcta</li>`;
          } else {
              answers += `<li>${element}</li>`;
          }
      });
      answers += "</ul>";
      return answers;
  }*/
  
  /*function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }*/
  function getCurrentDate() {
    const hoy = new Date();
    
    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0'); // Los meses son indexados desde 0
    const año = hoy.getFullYear();
    
    return `${dia}/${mes}/${año}`;
}

