const defaultValues = {
    "cards": [],
    "cardsTotal":0
}

function loadCardsStorage(nameStorage) {
    const savedValues = localStorage.getItem(nameStorage);
    if (savedValues) {
        return JSON.parse(savedValues);
    } else {
        return defaultValues;
    }
}

function modifyCardValue(id, newValue, myObjectArray) {
    const obj = myObjectArray.find(item => item.id === id);
    if (obj) {
        obj.value = newValue;
        saveLocalStorage(nameStorage, value);
    }
}

function saveLocalStorage(nameStorage, valueText) {
    try{
        localStorage.setItem(nameStorage, JSON.stringify(valueText));
    }catch(e){
        alert("Error al guardar. Si ha superado los 5MB de espacio utilizado. Elimine quizzes para liberar espacio");
        console.error(e);
    }
}

function loadLocalStorage(nameStorage, defaultValues){
    const savedValues = localStorage.getItem(nameStorage);
    if (savedValues) {
        return JSON.parse(savedValues);
    } else {
        return defaultValues;
    }
}

function generateUUID() { // Public Domain/MIT
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}