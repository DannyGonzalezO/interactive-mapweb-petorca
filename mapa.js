/* Se utiliza la librería Leaflet para mostrar el mapa "map", se definen los parametros ([(latitud),(longitud)], zoom) */
let map = L.map('map').setView([-32.252505,-70.932757], 12)

/* Se agrega una capa de OpenStreetMap */
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/* Función para leer en coordenadas la selección de locaciones. */
document.getElementById('select').addEventListener('change', function (e) {
    let coords = e.target.value.split(",");
    map.flyTo(coords, 13);
}
);

/* Mapa base para el minimapa */
var carto_light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {attribution: '©OpenStreetMap, ©CartoDB', subdomains: 'abcd', maxZoom: 24});

/* Se agrega el minimapa */
var minimap = new L.Control.MiniMap(carto_light, { toggleDisplay: true, minimized: false, position: 'bottomleft' }).addTo(map);

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


/* Se agregan las capas GeoJSON*/
L.geoJson(areas).addTo(map);
L.geoJson(reciclaje).addTo(map);
/* En cada click, se hace un popup */
var areasJS = L.geoJson(areas, {
    onEachFeature: popup
}).addTo(map);
var reciclajeJS = L.geoJson(reciclaje, {
    onEachFeature: popup
}).addTo(map);

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



