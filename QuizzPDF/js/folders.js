//---------------------------------ADD-DELETE-FOLDER--------------------------------------------//
let folderCounter = 0; // Contador para generar identificadores únicos

// Función para agregar una nueva carpeta
function addFolder() {
    // Incrementar el contador para generar un nuevo identificador único
    folderCounter++;

    // Crear un nuevo div con la clase 'folder-container'
    const newFolder = document.createElement('div');
    newFolder.classList.add('folder-container');

    // Generar un ID único para la carpeta
    const folderId = 'folder-' + folderCounter;

    // Crear la estructura interna de la carpeta
    newFolder.innerHTML = `
        <div class="top-folder-container">
            <div>
                <i class="fa-solid fa-x" data-folder-id="${folderId}"></i>
            </div>
        </div>
        <div class="bottom-folder-container">
            <p data-folder-p-id="${folderId}">Carpeta</p>
        </div>
    `;

    // Encontrar la columna menos llena
    const columns = document.querySelectorAll('.column');
    let targetColumn = columns[0];

    columns.forEach(column => {
        if (column.children.length < targetColumn.children.length) {
            targetColumn = column;
        }
    });

    // Añadir la nueva carpeta a la columna menos llena
    targetColumn.appendChild(newFolder);
}

// Event listener para agregar carpeta al hacer clic en el botón
document.getElementById('add-folder-btn').addEventListener('click', addFolder);

// Función para encontrar la columna menos llena
function findTargetColumn() {
    const columns = document.querySelectorAll('.column');
    let targetColumn = columns[0];

    columns.forEach(column => {
        if (column.children.length < targetColumn.children.length) {
            targetColumn = column;
        }
    });

    return targetColumn;
}


// Función para eliminar una carpeta
function removeFolder(event) {
    const folderToRemove = event.target.closest('.folder-container'); // Obtenemos el contenedor de la carpeta
    if (folderToRemove) {
        folderToRemove.remove(); // Removemos la carpeta del DOM
    }
}

// Event listener para eliminar carpeta al hacer clic en el ícono de eliminar
document.addEventListener('click', function(event) {
    // Verificamos si el clic se realizó en un ícono de eliminar dentro de .folder-container
    if (event.target.classList.contains('fa-x')) {
        removeFolder(event);
    }
});

//---------------------------------ADD-DELETE-FOLDER--------------------------------------------//


document.addEventListener('click', function(event) {
    const paragraph = event.target.closest('.folder-container .bottom-folder-container p[data-folder-p-id]');
    if (paragraph) {
        const input = document.createElement('input');
        input.classList.add('input-deco');
        input.type = 'text';
        input.value = paragraph.textContent.trim() || 'Carpeta'; // Establecer el valor predeterminado como "Carpeta" si el texto está vacío
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                paragraph.textContent = input.value || 'Carpeta'; // Establecer el texto como "Carpeta" si el valor del input está vacío
                paragraph.removeChild(input);
            }
        });
        paragraph.textContent = '';
        paragraph.appendChild(input);
        input.focus();
    }
});


