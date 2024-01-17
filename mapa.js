/* Agregar referencias */
const sidebar = document.querySelector('#sidebar');
const alert = document.querySelector('#alert');

/* Se utiliza la librería Leaflet para mostrar el mapa "map", se definen los parametros ([(latitud),(longitud)], zoom) */
let map = L.map('map').setView([-32.252505,-70.932757], 12)

/* Se agrega una capa de OpenStreetMap */
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 3,
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// /* Función para leer en coordenadas la selección de locaciones. */
// document.getElementById('select').addEventListener('change', function (e) {
//     let coords = e.target.value.split(",");
//     map.flyTo(coords, 13);
// }
// );

// /* Mapa base para el minimapa */
// var carto_light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {attribution: '©OpenStreetMap, ©CartoDB', subdomains: 'abcd', maxZoom: 24});

// /* Se agrega el minimapa */
// var minimap = new L.Control.MiniMap(carto_light, { toggleDisplay: true, minimized: false, position: 'bottomleft' }).addTo(map);

/* Se agrega la escala de distancia */
new L.control.scale({imperial: false}).addTo(map);

/* Se configuran los popups */
// ojo que solo funciona para este caso en especifico
// + "<br/>" + "<strong>Sector: </strong>" + feature.properties.Sector
function popup(feature,layer){
    if(feature.properties && feature.properties.Nombre){
        layer.bindPopup("<strong>Nombre </strong>" + feature.properties.Nombre );
    }
}


/* Se agrega la leyenda */
var legend = L.control.Legend({position: 'bottomright', collapsed: false, symbolWidth: 24,opacity:1,column:1,
legends:[
    {
        label: "Áreas",
        type: "rectangle",
        color: "#0074f0",
        fillColor: "#009ff0",
        weight: 2,
        layers: areasJS,areas
    },
    {
        label: "Puntos de reciclaje",
        type: "point",
        color: "#0000ff",
        fillColor: "#0000ff",
        fillOpacity: 0.5,
        weight: 1,
        layers: reciclajeJS,reciclaje
    }
]
}).addTo(map);

/* Se agrega Control para desplegar datos al pasar el mouse */
var info = L.control();

/* Se crea un div con este tipo de control */
info.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

/* Se actualiza el div con los datos */
info.update = function(props){
    this._div.innerHTML = '<h4>Información</h4>' +  (props ?
        '<b>' + props.Nombre + '</b><br />'
        : 'Prueba');
};

info.addTo(map);

/* Se agrega la interacción con el puntero */
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    info.update(layer.feature.properties);

}

/* Se crean como variables las capas poligonales */
var areasJS;

/* Se agrega función para resetear el estilo */
function resetHighlight(e) {
    areasJS.resetStyle(e.target);
    info.update();
}

/* Se agrega función para hacer zoom al hacer click */
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

/* Se agrega función para agregar interacción al puntero */
function onEachFeature(feature, layer) {
    layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
    });
}


/* Se agregan las capas GeoJSON*/
L.geoJson(areas).addTo(map);
L.geoJson(reciclaje).addTo(map);
/* En cada click, se hace lo descrito por la funcion onEachFeature */
areasJS = L.geoJson(areas, {
    onEachFeature: onEachFeature
}).addTo(map);
/* En cada click, se hace un popup */
var reciclajeJS = L.geoJson(reciclaje, {
    onEachFeature: popup
}).addTo(map);

/* Se agrega función para volar a la coordenada del lugar seleccionado */
const volar = (coords) => {
    const zoom = map.getMaxZoom();
    map.flyTo(coords, zoom);
}

/* Se agrega función para llamar una alerta que muestre las coordenadas del lugar */

const definirAlert = ([lat, lng]) => {
    alert.classList.remove('hidden');
    alert.innerText = `Coordenadas:
    Latitud: ${lat},
    Longitud: ${lng}`;
}


/* Limpiar opciones de la barra lateral */
const limpiarItems = () => {
    const listadoLi = document.querySelectorAll('li');
    listadoLi.forEach(li => {
        li.classList.remove('active');})
}

/* Crear lista de lugares y volar a la coordenada del lugar seleccionado */
const crearLista = () => {
    const ul = document.createElement('ul');
    ul.classList.add('list-group');

    sites.forEach(lugar => {
        const li = document.createElement('li');
        li.innerText = lugar.nombre;
        li.classList.add('list-group-item');
        ul.append(li);

        li.addEventListener('click', () => {
            limpiarItems();
            li.classList.add('active');
            volar(lugar.coordenadas);
            definirAlert(lugar.coordenadas);
        })
    })

    return ul;
}


/* Se agrega el listado de sitios para rellenar la barra lateral, siguiendo las listas de Bootstrap*/
function crearListado(titulo,contenido){
    // Crea un div para el overlay
    const divOverlay = document.createElement('div');
    divOverlay.id = 'overlay';
    divOverlay.classList.add('col-2'); // Add Bootstrap column class
    divOverlay.style.height = '100%';
    divOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; 
    divOverlay.style.color = 'white';
    divOverlay.style.display = 'none'; // Oculto por default
    divOverlay.style.zIndex = '1000'; // Para que aparezca sobre el mapa

    // Append the overlay to the row div
    const row = document.querySelector('.row');
    row.insertBefore(divOverlay, row.children[1]); // Insert the overlay after the sidebar

    // Move the list of places into the overlay
    divOverlay.appendChild(contenido);

    const button = document.createElement('button');
    button.innerText = titulo;
    button.addEventListener('click', () => {
        if (divOverlay.style.display === 'none') {
            divOverlay.style.display = 'block'; // Show the overlay
        } else {
            divOverlay.style.display = 'none'; // Hide the overlay
        }
    });

    // Append the button to the sidebar
    const sidebar = document.getElementById('sidebar');
    sidebar.prepend(button);
}

crearListado("Lugares", crearLista());