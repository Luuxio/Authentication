// Initialiser la carte
function initMap() {
    var map = L.map('map').setView([51.505, -0.09], 13);  // Initialiser à Londres

    // Ajouter un fond de carte
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Ajouter un marker à la position par défaut
    var marker = L.marker([51.505, -0.09]).addTo(map);

    // Ajouter un popup au marker
    marker.bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup();
}

// Initialiser la carte
initMap();
