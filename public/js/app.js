const header = document.querySelector('#header')
const searchForm = document.querySelector('#search-form');
const searchFormInput =  document.querySelector('#search-form__input');
const imagesList = document.querySelector('#images-list');
const paginator = document.querySelector('#paginator')
const categoriesListItems = document.querySelectorAll('.categories-list__item')

const hitsPerPage = 30;
let totalPages;
let pageNumber = 1;
let searchTerm

window.onload = () => {
    searchForm.addEventListener('submit', formValidate);
    searchByCategories()
}

// Iniciar la búsqueda haciendo clic en las categorías predeterminadas
function searchByCategories() {
    categoriesListItems.forEach(categorie => {
        categorie.addEventListener('click', () => {
            searchFormInput.value = categorie.dataset.categorie;
            searchTerm = categorie.dataset.categorie;
            pageNumber = 1;
            searchImages()
        })
    })
}

// Iniciar la búsqueda haciendo con el input
function formValidate(e) {
    e.preventDefault();
    searchTerm = searchFormInput.value;
    if(searchTerm === '') {
        showAlert('Please, enter a Search Term');
        return;
    }
    pageNumber = 1;
    searchImages()
}

// Mostrar alertas en caso de error en la búsqueda
function showAlert(message) {
    const existAlert = document.querySelector('.alert');

    if(!existAlert) {
        const alert = document.createElement('p');
        alert.classList.add('alert');
        alert.textContent = message;
        header.insertBefore(alert, document.querySelector('#categories-list'))
        setTimeout(() => {
            alert.remove()
        }, 2500);
    }
}

// Conexión con la API
async function searchImages() {
    const key = '28465326-409170e0c740480ca8b7024be';
    const url = `https://pixabay.com/api/?key=${key}&q=${searchTerm}&image_type=photo&pretty=true&per_page=${hitsPerPage}&page=${pageNumber}`;

    try {
        const reply = await fetch(url);
        const result = await reply.json();
        totalPages = calculatePages(result.totalHits);
        showImages(result.hits);
    } catch (error) {
        console.log(error);
    }
}

// Mostrar las imágenes obtenidas con la búsqueda
function showImages(images) {
    cleanHTML()
    
    if(images.length === 0) {
        showAlert('No results. Try again')
    }

    images.forEach(image => {
        const { previewURL, likes, views, largeImageURL } = image
        
        // Contenedor para cada imagen e información
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image__container');

        // Imagen
        const imagePicture = document.createElement('img');
        imagePicture.classList.add('image__picture');
        imagePicture.src = `${previewURL}`;
        imageContainer.appendChild(imagePicture);

        // Contenedor para la información
        const imageInfoContainer = document.createElement('div');
        imageInfoContainer.classList.add('image__info-container');
        imageContainer.appendChild(imageInfoContainer);

        // Contenedor para likes y views
        const imageViewsLikesContainer = document.createElement('div');
        imageViewsLikesContainer.classList.add('image__views-likes-container');
        imageInfoContainer.appendChild(imageViewsLikesContainer);

        // Views
        const imageViews = document.createElement('i');
        imageViews.classList.add('fa-solid', 'fa-eye', 'text-cyan-800');
        const imageViewsSpan = document.createElement('span');
        imageViewsSpan.classList.add('pl-2');
        imageViewsSpan.textContent = views;
        imageViews.appendChild(imageViewsSpan);
        
        imageViewsLikesContainer.appendChild(imageViews);

        // Likes
        const imageLikes = document.createElement('i');
        imageLikes.classList.add('fa-solid', 'fa-heart', 'text-red')
        const imageLikesSpan = document.createElement('span');
        imageLikesSpan.classList.add('pl-2');
        imageLikesSpan.textContent = likes;
        imageLikes.appendChild(imageLikesSpan);

        imageViewsLikesContainer.appendChild(imageLikes);

        // Btn Full View
        const imageBtnFullView = document.createElement('a');
        imageBtnFullView.classList.add('image__btn-full-view');
        imageBtnFullView.textContent = 'Full Image'
        imageBtnFullView.href = largeImageURL;
        imageBtnFullView.target = '_blank';
        imageInfoContainer.appendChild(imageBtnFullView);

        // Agregar al DOM
        imagesList.appendChild(imageContainer);
    });

    highlightCategorieSelected();
    createPaginator();
}

// Resaltar la categoría seleccionada
function highlightCategorieSelected() {
    categoriesListItems.forEach(categorie => {
        if(categorie.dataset.categorie === searchTerm) {
            categorie.classList.add('categories-list__item--active');
            categorie.classList.remove('categories-list__item');
        } else {
            categorie.classList.remove('categories-list__item--active');
            categorie.classList.add('categories-list__item');
        };
    });
}

// Limpiar el contenedor de imágenes
function cleanHTML() {
    while (imagesList.firstChild) {
        imagesList.removeChild(imagesList.firstChild)
    }
}

// Calcular el número de páginas segun el total de imágenes obtenidas y la cantidad de imágenes que se muestran por página
function calculatePages(totalHits) {
    return parseInt(Math.ceil( totalHits / hitsPerPage));
}

// Crear el paginador
function createPaginator() {
    while(paginator.firstChild) {
        paginator.removeChild(paginator.firstChild);
    }
    
    for (let i = 1; i <= totalPages; i++) {
        const paginatorItem = document.createElement('button');
        paginatorItemNumber = i
        paginatorItem.textContent = i;
        paginatorItem.href = '#';

        if(paginatorItemNumber === pageNumber) {
            paginatorItem.classList.add('paginator__item--active');
        } else {
            paginatorItem.classList.add('paginator__item');
        }

        paginatorItem.onclick = () => {
            pageNumber = i;
            searchImages();
        }
        
        paginator.appendChild(paginatorItem)
    } 
}