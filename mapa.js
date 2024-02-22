/* Agregar referencias */
const sidebar = document.querySelector('#sidebar');
const alert = document.querySelector('#alert');

/* Se utiliza la librería Leaflet para mostrar el mapa "map", se definen los parametros ([(latitud),(longitud)], zoom) */
let map = L.map('map').setView([-32.252505,-70.932757], 12)

/* Se agrega una capa de OpenStreetMap */
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 3,
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

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
function popup(feature, layer) {
    if (feature.properties) {
        let popupContent = '';
        for (let prop in feature.properties) {
            if (prop !== 'id') { // Skip the 'id' property
                popupContent += `<strong>${prop}:</strong> ${feature.properties[prop]}<br/>`;
            }
        }
        layer.bindPopup(popupContent);
    }
}

// /* Se agrega la leyenda */
// var legend = L.control.Legend({position: 'bottomright', collapsed: false, symbolWidth: 24,opacity:1,column:1,
// legends:[
//     {
//         label: "Áreas",
//         type: "rectangle",
//         color: "#0074f0",
//         fillColor: "#009ff0",
//         weight: 2,
//         layers: areasJS,areas
//     },
//     {
//         label: "Puntos de reciclaje",
//         type: "point",
//         color: "#0000ff",
//         fillColor: "#0000ff",
//         fillOpacity: 0.5,
//         weight: 1,
//         layers: reciclajeJS,reciclaje
//     }
// ]
// }).addTo(map);

/* Se agrega Control para desplegar datos al pasar el mouse */
var info = L.control();

/* Se crea un div con este tipo de control */
info.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

/* Se actualiza el div con los datos, si la capa no tiene nombre, no se muestra info */
info.update = function(props){
    if (props && props.Nombre) {
        this._div.innerHTML = '<h4>Nombre</h4>' + '<b>' + props.Nombre + '</b><br />';
        this._div.style.display = 'block'; // Show the div
    } else {
        this._div.innerHTML = '';
        this._div.style.display = 'none'; // Hide the div
    }
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



/* Se agrega función para resetear el estilo */
function resetHighlight(e) {
    allData.forEach(function(item) {
        window[item.name + 'JS'].resetStyle(e.target);
    });
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
    click: popup(feature, layer)
    });
}


/* Se agregan las capas GeoJSON*/
//L.geoJson(areas).addTo(map);
//L.geoJson(reciclaje).addTo(map);
/* En cada click, se hace lo descrito por la funcion onEachFeature */
/* Se crea una capa para cada conjunto de datos GeoJSON */
allData.forEach(function(item) {
    window[item.name + 'JS'] = L.geoJson(item.data, {
        onEachFeature: onEachFeature
    });
});



/* Se agrega una layer para controlar el basemap */
var baseMaps = {
    "OpenStreetMap": osm,
    "Esri World Imagery": Esri_WorldImagery,
    "OpenTopoMap": OpenTopoMap
};
L.control.layers(baseMaps).addTo(map);

/* Se agrega función para volar a la coordenada del lugar seleccionado */
const volar = (coords) => {
    const zoom = map.getMaxZoom();
    map.flyTo(coords, zoom);
}

/* Se agrega función para llamar una alerta que muestre las coordenadas del lugar */

// const definirAlert = ([lat, lng]) => {
//     alert.classList.remove('hidden');
//     alert.innerText = `Coordenadas:
//     Latitud: ${lat},
//     Longitud: ${lng}`;
// }


/* Limpiar opciones de la barra lateral */
const limpiarItems = () => {
    const listadoLi = document.querySelectorAll('li');
    listadoLi.forEach(li => {
        li.classList.remove('active');
        li.style.border = '2px solid black';});
}

/* Crear lista de lugares y volar a la coordenada del lugar seleccionado */
const crearLista = () => {
    const ul = document.createElement('ul');
    ul.classList.add('list-group');

    sites.forEach(lugar => {
        const li = document.createElement('li');
        li.innerText = lugar.nombre;
        li.classList.add('list-group-item');
        li.style.color = 'black';
        li.style.border = '2px solid black';

        // Agregar estilo CSS para cambiar el color del botón
        li.style.backgroundColor = 'rgba(0, 0, 0,0.1)';

        ul.append(li);

        li.addEventListener('click', () => {
            limpiarItems();
            li.classList.add('active');
            li.style.border = '2px solid blue';
            volar(lugar.coordenadas);
            //definirAlert(lugar.coordenadas);
        })
    })

    return ul;
}

/* Crea lista de capas y permite controlar su visibilidad */
function crearCapas(capas, color) {
    const div = document.createElement('div');

    // Función para generar un color aleatorio
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let randomColor = '#';
        for (let i = 0; i < 6; i++) {
            randomColor += letters[Math.floor(Math.random() * 16)];
        }
        return randomColor;
    }

    // Create checkboxes for each layer
    capas.forEach(capa => {
        const label = document.createElement('label');
        label.innerText = capa.name;
        label.style.position = 'relative';
        label.style.paddingLeft = '35px';
        label.style.cursor = 'pointer';
        label.style.borderBottom = '2px solid gray';
        label.style.display = 'block';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = false; // The layer is not visible initially
        checkbox.style.display = 'none';

        // Genera un color aleatorio para la capa
        const layerColor = getRandomColor();

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                map.addLayer(capa.layer);
                // Aplica el color a la capa
                capa.layer.eachLayer((layer) => {
                    switch (layer.feature.geometry.type) {
                        case 'Point':
                            console.log('La capa es un marcador');
                            layer.setIcon(L.icon({ iconUrl: 'marker-icon.png', iconColor: layerColor }));
                            break;
                        case 'MultiPolygon':
                            console.log('La capa es un polígono');
                            layer.setStyle({ color: layerColor });
                            break;
                        default:
                            console.log('La capa es de un tipo desconocido:', layer.feature.geometry.type);
                            break;
                    }
                });
            } else {
                map.removeLayer(capa.layer);
            }
        });

        const customCheckbox = document.createElement('span');
        customCheckbox.style.position = 'absolute';
        customCheckbox.style.left = '0';
        customCheckbox.style.top = '0';
        customCheckbox.style.width = '15px';
        customCheckbox.style.height = '15px';
        customCheckbox.style.border = '2px solid #000';
        customCheckbox.style.borderRadius = '50%';
        customCheckbox.style.marginTop = '5px';
        customCheckbox.style.marginLeft = '5px';

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                customCheckbox.style.background = color;
            } else {
                customCheckbox.style.background = 'none';
            }
        });

        // Create a break element
        const spacer = document.createElement('div');
        spacer.style.height = '10px'; // Cambia esto al alto que necesites
        div.appendChild(spacer);

        label.appendChild(checkbox);
        label.appendChild(customCheckbox);
        div.appendChild(label);

        spacer.style.height = '10px'; // Cambia esto al alto que necesites
        div.appendChild(spacer);
    });

    return div;
}

/* Crea un acordeón con el título y el contenido especificados */
function crearAcordeon(titulo, contenido) {
    // Crear el elemento del acordeón
    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item');

    // Crear el encabezado del acordeón
    const accordionHeader = document.createElement('h2');
    accordionHeader.classList.add('accordion-header');
    accordionHeader.id = `${titulo}-header`;
    accordionHeader.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    accordionHeader.style.textAlign = 'center';
    accordionHeader.style.padding = '10px';
    accordionHeader.style.margin = '10px';
    accordionHeader.style.border = '2px solid black';
    

    // Crear el botón del acordeón
    const button = document.createElement('button');
    button.classList.add('accordion-button', 'collapsed');
    button.type = 'button';
    button.dataset.bsToggle = 'collapse';
    button.dataset.bsTarget = `#${titulo}-collapse`;
    button.textContent = titulo;
    button.style.textAlign = 'center';

    // Add the arrow icon
    const arrowIcon = document.createElement('span');
    arrowIcon.classList.add('accordion-button-icon');
    button.appendChild(arrowIcon);

    // Crear el contenido del acordeón
    const accordionCollapse = document.createElement('div');
    accordionCollapse.id = `${titulo}-collapse`;
    accordionCollapse.classList.add('accordion-collapse', 'collapse');
    accordionCollapse.setAttribute('aria-labelledby', `${titulo}-header`);
    accordionCollapse.dataset.bsParent = '#accordionExample';

    const accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body');
    accordionBody.appendChild(contenido); // Agregar el contenido como un elemento del DOM

    // Agregar los elementos al acordeón
    accordionCollapse.appendChild(accordionBody);
    accordionHeader.appendChild(button);
    accordionItem.appendChild(accordionHeader);
    accordionItem.appendChild(accordionCollapse);

    return accordionItem;
}


/* Se agrega el listado de sitios para rellenar la barra lateral, siguiendo las listas de Bootstrap*/
let currentOverlay = null; // Variable to keep track of the currently open overlay

function crearListado(imagen, titulo,color, contenido) {
    // Create a div for the overlay
    const divOverlay = document.createElement('div');
    divOverlay.id = 'overlay-' + imagen; // Unique ID for each overlay
    divOverlay.classList.add('col-2'); // Add Bootstrap column class
    divOverlay.style.height = '100%';
    divOverlay.style.width = '250px';
    divOverlay.style.backgroundColor = 'white';
    divOverlay.style.color = 'black';
    divOverlay.style.fontFamily = 'Arial, sans-serif';
    divOverlay.style.display = 'none'; // Hidden by default
    divOverlay.style.zIndex = '1000'; // To appear above the map
    divOverlay.style.padding = '0';
    if (window.innerWidth <= 400) { // If the screen width is 600px or less
        divOverlay.style.width = '20%'; // Use 100% width
    } else {
        divOverlay.style.width = '250px'; // Use 250px width
    }

    // Create a title element
    const titleElement = document.createElement('h2');
    titleElement.textContent = titulo;
    titleElement.style.color = 'black'; 
    titleElement.style.backgroundColor = color
    titleElement.style.boxSizing = 'border-box';
    titleElement.style.width = '100%';
    titleElement.style.borderBottom = '2px solid black';
    //justify the text
    titleElement.style.textAlign = 'center';


    // Append the title to the overlay
    divOverlay.appendChild(titleElement);

    // Append the overlay to the row div
    const row = document.querySelector('.row');
    row.insertBefore(divOverlay, row.children[1]); // Insert the overlay after the sidebar

    // Move the list of places into the overlay
    divOverlay.appendChild(contenido);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-secondary';
    button.dataset.toggle = 'tooltip';
    button.dataset.placement = 'right';
    button.title = titulo;
    button.style.borderRadius = '0';
    const img = document.createElement('img');
    img.src = imagen;
    img.title = titulo;
    button.appendChild(img);
    button.style.backgroundColor = color;
    
    
    button.addEventListener('click', () => {
        if (divOverlay.style.display === 'none') {
            // If another overlay is open, close it
            if (currentOverlay) {
                currentOverlay.style.display = 'none';
            }

            divOverlay.style.display = 'block'; // Show the overlay
            currentOverlay = divOverlay; // Update the currently open overlay
        } else {
            divOverlay.style.display = 'none'; // Hide the overlay
            currentOverlay = null; // No overlay is open
        }
    });

    // Create a container for the buttons if it doesn't exist
    let buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.id = 'button-container';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.overflow = 'auto';
        const sidebar = document.getElementById('sidebar');
        sidebar.appendChild(buttonContainer);
        
    }

    // Append the button to the button container
    buttonContainer.appendChild(button);

}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })


// Se definen las capas correspondientes a la categoria "Territorios"
// // Me gustaría tenerlo en un archivo separado, pero como dentro de mapa.js, se redefine cada layer, tengo que incluirlo acá para que no se sobreescriban las variables
const capasTerritorios = [
    { name: 'Comuna Petorca', layer: comuna_petorcaJS },
    { name: 'Comunas IV y V Región', layer: comunas_4_5_regionJS },
    { name: 'Límites Unidades Vecinales', layer: limites_uni_vecinalesJS },
    { name: 'Poblados', layer: pobladosJS }
];

const capasSustentabilidad = [
    { name: 'Áreas verdes', layer: areasverdesJS },
    { name: 'Clima Koppen en Petorca', layer: climakoppenJS },
    { name: 'Estadísticas fluviométricas vigentes con datos', layer: fluviometricasJS },
    { name: 'Estadísticas meteorologicas vigentes con datos', layer: meteorologicasJS },
    { name: 'Humedales', layer: humedalesJS },
    { name: 'Formaciones vegetacionales Gajardo', layer: vegetacionalesJS }
];

const capasHidrologia = [
    { name: 'Sistemas de Servicio Sanitario Rural, SSR (ex APR)', layer: apr_ssrJS },
    { name: 'CASUB: Comunidad de Aguas Subterráneas', layer: casub_plqJS },
    { name: 'Cuenca completa río Petorca', layer: cuenca_rio_petorcaJS },
    { name: 'DAA cuenca río Petorca 1956', layer: daa_cuenca_rio_petorca_1956JS },
    { name: 'DAA cuenca río Petorca 1969', layer: daa_cuenca_rio_petorca_1969JS },
    { name: 'DAA cuenca río Petorca 1984', layer: daa_cuenca_rio_petorca_1984JS },
    { name: 'Estaciones calidad de agua', layer: estaciones_calidad_de_aguaJS },
    { name: 'Obras subt registradas MEE comuna de Petorca', layer: obras_subt_reg_meeJS },
    { name: 'Obras subt registradas MEE cuenca del río Petorca', layer: obras_subt_reg_mee_cuenca_rioJS },
    { name: 'Plantas de tratamiento de aguas servidas ESVAL', layer: plantas_tratamiento_aguas_servidas_esvalJS }

];

const capasComunicacion = [
    { name: 'Antenas de servicio en Petorca', layer: antenas_servicio_petorcaJS }
];

const capasEducacion = [
    { name: 'Establecimientos de educación parvularia', layer: estab_educ_parvulariaJS },
    { name: 'Establecimientos educacionales', layer: estab_educacionalesJS },
    { name: 'Jardines infantiles JUNJI', layer: jardines_infantiles_junjiJS },
    { name: 'Jardines INTEGRA', layer: jardines_integraJS },
];

const capasSalud = [
    { name: 'Establecimientos de salud', layer: estab_saludJS }
];

const capasSeguridad = [
    { name: 'Carabineros', layer: carabinerosJS },
    { name: 'Compañías de bomberos', layer: compañias_bomberosJS },
    { name: 'Grifos', layer: grifosJS },
    { name: 'Municipalidad', layer: municipalidadJS }
];

const todasLasCapas = [
    ...capasTerritorios,
    ...capasSustentabilidad,
    ...capasHidrologia,
    ...capasComunicacion,
    ...capasEducacion,
    ...capasSalud,
    ...capasSeguridad
];
var searchLayer = L.layerGroup();


// Mapeo de marcadores a capas
var markerToLayer = new Map();


todasLasCapas.forEach(capa => {
    capa.layer.eachLayer(marker => {
        marker.feature.properties.title = capa.name;
        // Agrega el marcador y la capa al mapeo
        markerToLayer.set(marker, capa.layer);
    });
    searchLayer.addLayer(capa.layer);
    map.removeLayer(capa.layer); // Oculta la capa
});

var controlSearch = new L.Control.Search({
    layer: searchLayer,
    initial: false,
    hideMarkerOnCollapse: true,
    propertyName: 'title', // Campo que se utilizará para la búsqueda
    marker:false
});

controlSearch.on('search:locationfound', function(e) {
    // e.layer es el marcador que se encontró con la búsqueda
    // Busca la capa que contiene el marcador
    var layer = markerToLayer.get(e.layer);
    // Agrega la capa al mapa
    if (layer) {
        map.addLayer(layer);
    }
});

map.addControl(controlSearch);
todasLasCapas.forEach(capa => {
    map.removeLayer(capa.layer);
});

/* Se crean los colores para la sidebar */
const colorLugares = '#f39890';
const colorServicios = '#f5b289';
const colorTerritorios = '#ffee93';
const colorSustentabilidad = '#b9e7aa'; 
const colorHidrologia = '#a0ced9';


/* Se crean los acordeones con las capas de las subcategorias de servicios esenciales */
const acordeonComunicacion = crearAcordeon('Comunicación',crearCapas(capasComunicacion,colorServicios));
const acordeonEducacion = crearAcordeon('Educación',crearCapas(capasEducacion,colorServicios));
const acordeonSalud = crearAcordeon('Salud',crearCapas(capasSalud,colorServicios));
const acordeonSeguridad = crearAcordeon('Seguridad',crearCapas(capasSeguridad,colorServicios));

/* Se crea el contenedor de los acordeones */
const contenedorServicios = document.createElement('div');
contenedorServicios.appendChild(acordeonComunicacion);
contenedorServicios.appendChild(acordeonEducacion);
contenedorServicios.appendChild(acordeonSalud);
contenedorServicios.appendChild(acordeonSeguridad);





crearListado("assets/interface/place.png", 'Lugares', colorLugares, crearLista());
crearListado("assets/interface/public-service.png", 'Servicios Esenciales',colorServicios, contenedorServicios);
crearListado("assets/interface/territories.png", 'Territorios',colorTerritorios, crearCapas(capasTerritorios,colorTerritorios));
crearListado("assets/interface/sustainable.png", 'Sustentabilidad',colorSustentabilidad, crearCapas(capasSustentabilidad,colorSustentabilidad));
crearListado("assets/interface/save-water.png", 'Hidrología',colorHidrologia, crearCapas(capasHidrologia,colorHidrologia));

//paleta de colores https://coolors.co/b9e7aa