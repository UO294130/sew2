// Aquí deberás reemplazar "YOUR_API_KEY" con tu clave de la API de Here
document.addEventListener("DOMContentLoaded", function() {
    // Tu código que usa la API de Here Maps
    const platform = new H.service.Platform({
        apikey: 'YOUR_API_KEY' // Reemplaza con tu clave de API de Here
    });

    const maptypes = platform.createDefaultLayers();

    // Código para obtener la ubicación del usuario y crear el mapa...
    // Resto de tu código...
});

// Obtener el servicio de mapas
const maptypes = platform.createDefaultLayers();

// Obtener la ubicación del usuario
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        document.getElementById('userLocation').textContent = `Ubicación: Lat ${lat}, Lon ${lon}`;

        // Crear el mapa centrado en la ubicación del usuario
        const map = new H.Map(
            document.getElementById('map'),
            maptypes.vector.normal.map,
            {
                zoom: 13,
                center: { lat: lat, lng: lon } // Centro del mapa en la ubicación del usuario
            }
        );

        // Agregar controles de navegación
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        const ui = H.ui.UI.createDefault(map, maptypes);

        // Desactivar zoom con rueda y movimiento con el ratón si lo deseas
        map.scrollWheelZoom.disable(); // Deshabilitar zoom con la rueda del ratón
        map.dragging.disable(); // Deshabilitar el movimiento con el ratón
    });
}

// Canvas para la animación del coche
let canvas = document.getElementById('raceCanvas');
let ctx = canvas.getContext('2d');
let carX = 0;
let carY = 50;
let speed = 5;

// Ajusta el tamaño del canvas
canvas.width = 600;
canvas.height = 200;

// Dibuja el coche de Fórmula 1
function drawCar(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas antes de redibujar
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, 50, 30); // Dibujar el coche en una posición
}

// Función para actualizar la animación
function updateRace() {
    carX += speed;
    if (carX > canvas.width) { // Si el coche sale de la pantalla, reiniciamos la posición
        carX = -50; // Comienza de nuevo desde la izquierda
    }
    drawCar(carX, carY);
}

// Manejo de las teclas para mover el coche
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        carY -= 5; // Mover hacia arriba
    } else if (event.key === 'ArrowDown') {
        carY += 5; // Mover hacia abajo
    } else if (event.key === 'ArrowRight') {
        speed = 5; // Aumentar velocidad
    } else if (event.key === 'ArrowLeft') {
        speed = 2; // Disminuir velocidad
    }
});

// Actualizar la animación cada 50ms
setInterval(updateRace, 50);
