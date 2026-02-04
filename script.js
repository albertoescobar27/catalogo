import { properties } from './properties.js';

const catalogContainer = document.getElementById('catalog');
const paginationContainer = document.getElementById('pagination');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const currentIndexSpan = document.getElementById('current-index');
const totalImagesSpan = document.getElementById('total-images');

let currentProperty = null;
let currentImageIndex = 0;
let currentPage = 1;
const itemsPerPage = 6;

// Initialize
function initCatalog() {
    renderPage(currentPage);
}

// Render Page
function renderPage(page) {
    currentPage = page;
    catalogContainer.innerHTML = '';

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = properties.slice(start, end);

    paginatedItems.forEach(property => {
        const card = createCard(property);
        catalogContainer.appendChild(card);
    });

    renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render Pagination Controls
function renderPagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(properties.length / itemsPerPage);

    if (totalPages <= 1) return;

    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => renderPage(currentPage - 1);
    paginationContainer.appendChild(prevBtn);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => renderPage(i);
        paginationContainer.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => renderPage(currentPage + 1);
    paginationContainer.appendChild(nextBtn);
}

// Create New Card Structure
function createCard(property) {
    const card = document.createElement('div');
    card.className = 'card';

    // Cover Image
    const coverImage = property.images[0];

    // SVGs for Icons
    const bedIcon = `<svg viewBox="0 0 24 24" class="feature-icon"><path d="M19 7h-8v-3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3h-4a2 2 0 0 0-2 2v9h2v-2h14v2h2v-9a2 2 0 0 0-2-2zm-12 7h-2v-3h2v3zm12 0h-2v-3h2v3zm-4-4h-2v-3h2v3z"/></svg>`;
    const bathIcon = `<svg viewBox="0 0 24 24" class="feature-icon"><path d="M21 10h-2V4h-2v6h-2V4h-2v6H9V4H7v6H5a3 3 0 0 0-3 3v7h22v-7a3 3 0 0 0-3-3z"/></svg>`;
    const garageIcon = `<svg viewBox="0 0 24 24" class="feature-icon"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`;
    const statusIcon = `<svg viewBox="0 0 24 24" class="feature-icon"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

    // Map Icon
    const mapIcon = `<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

    card.innerHTML = `
        <div class="card-image-wrapper">
            <img src="assets/imagenes/${property.id}/${coverImage}" alt="${property.title}" loading="lazy">
        </div>
        
        <div class="card-content">
            <div class="price-tag">
                ${property.price} <span class="price-period"></span>
            </div>
            
            <h3 class="card-title">${property.title}</h3>
            
            <a href="${property.mapUrl}" target="_blank" class="location-link" title="Ver en Google Maps" onclick="event.stopPropagation()">
                ${mapIcon}
                ${property.locationText || 'Ver Ubicación'}
            </a>
            
            <div class="features-grid">
                <div class="feature-item">${bedIcon} ${property.features.beds} Recámaras</div>
                <div class="feature-item">${bathIcon} ${property.features.baths} Baños</div>
                <div class="feature-item">${garageIcon} ${property.features.garage} ${property.features.garage === 1 ? 'Vehículo' : 'Vehículos'}</div>
                <div class="feature-item">${statusIcon} ${property.features.status}</div>
            </div>
            
            <div class="card-footer">
                <button class="btn-primary" id="details-btn-${property.id}">Ver</button>
            </div>
        </div>
    `;

    // Attach event to the "See More Details" button
    const detailsBtn = card.querySelector(`#details-btn-${property.id}`);
    detailsBtn.onclick = (e) => {
        e.stopPropagation();
        openModal(property);
    };

    return card;
}

// Open Modal
function openModal(property) {
    currentProperty = property;
    currentImageIndex = 0;
    updateModalImage();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Update Modal Image
function updateModalImage() {
    if (!currentProperty) return;

    const imageName = currentProperty.images[currentImageIndex];
    modalImg.src = `assets/imagenes/${currentProperty.id}/${imageName}`;

    currentIndexSpan.textContent = currentImageIndex + 1;
    totalImagesSpan.textContent = currentProperty.images.length;
}

// Next Image
function nextImage(e) {
    if (e) e.stopPropagation();
    if (!currentProperty) return;
    currentImageIndex = (currentImageIndex + 1) % currentProperty.images.length;
    updateModalImage();
}

// Prev Image
function prevImage(e) {
    if (e) e.stopPropagation();
    if (!currentProperty) return;
    currentImageIndex = (currentImageIndex - 1 + currentProperty.images.length) % currentProperty.images.length;
    updateModalImage();
}

// Event Listeners
closeBtn.onclick = closeModal;
nextBtn.onclick = nextImage;
prevBtn.onclick = prevImage;

modal.onclick = (e) => {
    if (e.target === modal) {
        closeModal();
    }
};

document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});

// Start
initCatalog();
