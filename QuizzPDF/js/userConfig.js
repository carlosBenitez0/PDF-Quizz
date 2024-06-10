document.getElementById('btn_save_user_api_key').addEventListener('click', saveUserNameAndAPIKEY);

//input del nombre de usuario y de la API key
const userNameInput = document.querySelector('#username');
const userAPIKeyInput = document.querySelector('#apiKey');

function saveUserNameAndAPIKEY() {
    try {
        //se valida que los dos campos no esten nulos o solo con espacios en blanco
        if(validateUserAndAPIKEY(userNameInput.value, userAPIKeyInput.value)){
            // se guarda la info en una variable userConfig en el almacenamiento local del navegador
            saveLocalStorage('userConfig', JSON.stringify({
                "userName": userNameInput.value,
                "api_key": userAPIKeyInput.value.replace(/\s+/g, '')
            }));
            //luego de guardar los datos se muestran en los campos desde el almacenamiento
            const userConfig = loadLocalStorage('userConfig',`{
                "userName": null,
                "api_key": null
            }`);
            //colocando los datos guardados en la vista
            userNameInput.value = JSON.parse(userConfig).userName;
            userAPIKeyInput.value = JSON.parse(userConfig).api_key;

            alert("Usuario y API KEY guardados exitosamente");
        }
    } catch (e) {
        alert("Error al guardar el usuario y la API KEY");
        console.error(e);
    }
}

function validateUserAndAPIKEY(user, apiKey) {
    //se valida que no estén nulos
    if (user && apiKey) {
        //se valida que no tengan solo espacios en blanco
        if (user.replace(/\s+/g, '').length > 0
            && apiKey.replace(/\s+/g, '').length > 0) {
            return true;
        } else {
            alert("Datos no válidos en el campo de usuario o API_KEY");
            return false;
        }
    } else {
        alert("Datos nulos en el campo de usuario o API_KEY");
        return false;
    }
}

//cargando los datos del usuario y la api key
(() => {
    //se carga el usuario y la api key desde el almacenamiento al cargar el script
    const userConfig = loadLocalStorage('userConfig', `{
        "userName": null,
        "api_key": null
    }`);
    //colocando los datos guardados en la vista
    userNameInput.value = JSON.parse(userConfig).userName;
    userAPIKeyInput.value = JSON.parse(userConfig).api_key;
})();