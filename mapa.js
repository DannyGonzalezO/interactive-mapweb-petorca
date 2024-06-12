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

/* Se agrega la escala de distancia */
new L.control.scale({imperial: false}).addTo(map);

/* Se configuran los popups */
function popup(feature, layer) {
    if (feature.properties) {
        let popupContent = '';
        for (let prop in feature.properties) {
            if (prop !== 'id') { 
                popupContent += `<strong>${prop}:</strong> ${feature.properties[prop]}<br/>`;
            }
        }
        layer.bindPopup(popupContent);
    }
}




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
        this._div.style.display = 'block'; 
    } else {
        this._div.innerHTML = '';
        this._div.style.display = 'none'; 
    }
};

info.addTo(map);


function modificarColor(color, amount) {
    // Remueve el # al inicio del color hexadecimal
    color = color.substring(1);

    // Convierte el color a RGB
    var rgb = parseInt(color, 16);

    // Calcula los componentes rojo, verde y azul
    var r = (rgb >> 16) & 0xff;
    var g = (rgb >> 8) & 0xff;
    var b = rgb & 0xff;

    // Modifica los componentes rojo, verde y azul
    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));

    // Convierte los componentes modificados a hexadecimal
    var modificado = ((r << 16) | (g << 8) | b).toString(16);

    // Asegura que el color modificado tenga 6 dígitos
    while (modificado.length < 6) {
        modificado = '0' + modificado;
    }

    // Devuelve el color modificado con un # al inicio
    return '#' + modificado;
}
/* Se agrega la interacción con el puntero */
function highlightFeature(e) {
    var layer = e.target;
    var currentColor = layer.options.color;  // Obtén el color actual de la capa
    var darkerColor = modificarColor(currentColor, -40);  // Oscurece el color actual

    layer.setStyle({
        weight: 5,
        color: darkerColor,
        dashArray: '',
        fillOpacity: 0.5
    });

    info.update(layer.feature.properties);

}



/* Se agrega función para resetear el estilo */
function resetHighlight(e) {
    var layer = e.target;
    var currentColor = layer.options.color;  // Obtén el color actual de la capa
    var lighterColor = modificarColor(currentColor, 40);  // Oscurece el color actual

    layer.setStyle({
        weight: 3,
        color: lighterColor,
        dashArray: '',
        fillOpacity: 0.2
    });

    info.update(layer.feature.properties);

}

/* Se agrega función para hacer zoom al hacer click */
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

/* Se agrega función para agregar interacción al puntero */
function onEachFeature(feature, layer) {
    if(layer){ 
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: popup(feature, layer)
            })
    }
    else{
        console.log('No se encontró la capa');
    };
}


/* Se agregan las capas GeoJSON*/
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
        })
    })

    return ul;
}

// Control para ver las capas visibles
var VisibleLayersControl = L.Control.extend({
    options: {
        position: 'topleft' 
    },

    onAdd: function (map) {
        var controlContainer = L.DomUtil.create('div');
        controlContainer.style.display = 'flex';

        var button = L.DomUtil.create('button', '', controlContainer);
        button.style.backgroundColor = 'white';
        button.style.backgroundImage = 'url(assets/interface/layers.png)';
        button.style.width = '32px';
        button.style.height = '32px';
        button.style.backgroundSize = 'cover';
        button.style.border = 'solid 1px #999';
        button.style.borderRadius = '3px';
        button.style.padding = '10px';

        var container = L.DomUtil.create('div', '', controlContainer);
        container.id = 'visible-layers';
        container.style.display = 'none';
        container.style.backgroundColor = 'white'; 
        container.style.margin = '10px'; 
        container.style.padding = '10px'; 
        container.style.border = 'solid 1px #999'; 

        L.DomEvent.addListener(button, 'click', function () {
            if (container.style.display === 'none') {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });

        return controlContainer;
    }
});
map.addControl(new VisibleLayersControl());

/* Lista de colores para los marcadores */
const colores = [ 'red', 'darkred', 'orange', 'green', 'darkgreen', 'blue', 'purple', 'cadetblue'];
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
    // Crea checkboxes para cada capa
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
        checkbox.checked = false; // Por defecto, las capas están ocultas
        checkbox.style.display = 'none';

        // Genera un color aleatorio para la capa
        const layerColor = getRandomColor();
        const markerColor = colores[Math.floor(Math.random() * colores.length)];
        checkbox.addEventListener('change', () => {
            var container = document.getElementById('visible-layers');
            if (checkbox.checked) {
                map.addLayer(capa.layer);
                var color;
                // Aplica el color a la capa
                capa.layer.eachLayer((layer) => {
                    switch (layer.feature.geometry.type) {
                        case 'Point':
                            var icon = L.AwesomeMarkers.icon({
                                markerColor: markerColor,
                            });
                            layer.setIcon(icon);
                            color = markerColor;
                            break;
                        case 'MultiPolygon':
                            layer.setStyle({ color: layerColor });
                            color = layerColor;
                            break;
                        case 'LineString':
                            layer.setStyle({ color: layerColor });
                            color = layerColor;
                            break;
                        default:
                            break;
                    }
                });
        
                
                var layerInfo = document.createElement('div');
                layerInfo.textContent = capa.name;
        
                var colorSquare = document.createElement('div');
                colorSquare.style.width = '20px';
                colorSquare.style.height = '20px';
                colorSquare.style.backgroundColor = color;
                colorSquare.style.display = 'inline-block';
                colorSquare.style.marginRight = '5px';
        
                layerInfo.prepend(colorSquare);
                container.appendChild(layerInfo);
            } else {
                map.removeLayer(capa.layer);
        
                // Remueve la capa de la lista de capas visibles
                for (var i = 0; i < container.childNodes.length; i++) {
                    if (container.childNodes[i].textContent === capa.name) {
                        container.removeChild(container.childNodes[i]);
                        break;
                    }
                }
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

        
        const spacer = document.createElement('div');
        spacer.style.height = '10px';
        div.appendChild(spacer);

        label.appendChild(checkbox);
        label.appendChild(customCheckbox);
        div.appendChild(label);

        spacer.style.height = '10px'; 
        div.appendChild(spacer);
    });

    return div;
}

/* Crea un acordeón con el título y el contenido especificados */
function crearAcordeon(titulo, contenido) {
    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item');

    const accordionHeader = document.createElement('h2');
    accordionHeader.classList.add('accordion-header');
    accordionHeader.id = `${titulo}-header`;
    accordionHeader.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    accordionHeader.style.textAlign = 'center';
    accordionHeader.style.padding = '10px';
    accordionHeader.style.margin = '10px';
    accordionHeader.style.borderBottom = '2px solid black';
    accordionHeader.style.display = 'block';
    
    const button = document.createElement('button');
    button.classList.add('accordion-button', 'collapsed');
    button.type = 'button';
    button.dataset.bsToggle = 'collapse';
    button.dataset.bsTarget = `#${titulo}-collapse`;
    button.textContent = titulo;
    button.style.textAlign = 'center';

    const arrowIcon = document.createElement('span');
    arrowIcon.classList.add('accordion-button-icon');
    button.appendChild(arrowIcon);

    const accordionCollapse = document.createElement('div');
    accordionCollapse.id = `${titulo}-collapse`;
    accordionCollapse.classList.add('accordion-collapse', 'collapse');
    accordionCollapse.setAttribute('aria-labelledby', `${titulo}-header`);
    accordionCollapse.dataset.bsParent = '#accordionExample';

    const accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body');
    accordionBody.appendChild(contenido);

    accordionCollapse.appendChild(accordionBody);
    accordionHeader.appendChild(button);
    accordionItem.appendChild(accordionHeader);
    accordionItem.appendChild(accordionCollapse);

    return accordionItem;
}


/* Se agrega el listado de sitios para rellenar la barra lateral, siguiendo las listas de Bootstrap*/
let currentOverlay = null; 

function crearListado(imagen, titulo,color, contenido) {
    const divOverlay = document.createElement('div');
    divOverlay.id = 'overlay-' + imagen; 
    divOverlay.classList.add('col-2');
    divOverlay.style.height = '100%';
    divOverlay.style.width = '250px';
    divOverlay.style.backgroundColor = 'white';
    divOverlay.style.color = 'black';
    divOverlay.style.fontFamily = 'Arial, sans-serif';
    divOverlay.style.display = 'none'; 
    divOverlay.style.zIndex = '1000'; 
    divOverlay.style.padding = '0';
    divOverlay.style.borderRight = '2px solid black';
    if (window.innerWidth <= 400) {
        divOverlay.style.width = '20%'; 
    } else {
        divOverlay.style.width = '250px';
    }

    const titleElement = document.createElement('h2');
    titleElement.textContent = titulo;
    titleElement.style.color = 'black'; 
    titleElement.style.backgroundColor = color
    titleElement.style.boxSizing = 'border-box';
    titleElement.style.width = '100%';
    titleElement.style.borderBottom = '2px solid black';
    titleElement.style.textAlign = 'center';

    divOverlay.appendChild(titleElement);

    const row = document.querySelector('.row');
    row.insertBefore(divOverlay, row.children[1]); 

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
            // Si hay un overlay abierto, se cierra
            if (currentOverlay) {
                currentOverlay.style.display = 'none';
            }

            divOverlay.style.display = 'block'; 
            currentOverlay = divOverlay;
        } else {
            divOverlay.style.display = 'none'; 
            currentOverlay = null; 
        }
    });


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

    
    buttonContainer.appendChild(button);

}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })


// Se definen las capas correspondientes a la categoria "Territorios"
const capasTerritorios = [
    { name: 'Atractivos turisticos 2020 Petorca Sernatur', layer: Atractivos_turísticos_2020_Petorca_Sernatur_JS },
    { name: 'Comunas IV y V region', layer: Comunas_4ta_y_5ta_region_JS },
    { name: 'Comuna Petorca', layer: Comuna_Petorca_JS },
    { name: 'Limites Unidades Vecinales', layer: Limites_Unidades_Vecinales_Petorca_JS },
    { name: 'Poblados', layer: Poblados_Petorca_JS },
    { name: 'Puntos Críticos Emergencia', layer: Puntos_Críticos_Emergencia_JS },
    { name: 'Quebradas y cursos de agua', layer: Quebradas_y_cursos_de_agua_JS },
    { name: 'Red Hídrica Cuenca Rio Petorca', layer: Red_Hídrica_Cuenca_Rio_Petorca_JS },
    { name: 'Red PRE 2018 Petorca', layer: Red_PRE_2018_Petorca_JS },
    { name: 'Sendero de Chile Petorca', layer: Sendero_de_Chile_Petorca_JS },
    { name: 'Unidades vecinales 2017', layer: Unidades_vecinales_2017_Petorca_JS },
];

// Se definen las capas correspondientes a la categoria "Sustentabilidad"
const capasSustentabilidad = [
    { name: 'Áreas verdes', layer: Areas_Verdes_2023_JS },
    { name: 'Campañas reciclaje de vidrio', layer: Campanas_reciclaje_de_vidrio_1_JS },
    { name: 'Clima Koppen en Petorca', layer: Clima_Koppen_Petorca_JS },
    { name: 'Estadísticas fluviométricas vigentes con datos', layer: Est_Fluviométricas_vigentes_con_datos_Petorca_JS },
    { name: 'Estadísticas meteorologicas vigentes con datos', layer: Est_Meteorologicas_vigente_con_datos_Petorca_JS },
    { name: 'Formaciones vegetacionales Gajardo', layer: Formaciones_vegetacionales_Gajardo_JS },
    { name: 'Humedales', layer: Humedales_Petorca_JS },
    { name: 'Pisos Vegetacionales Pliscoff', layer: Pisos_Vegetacionales_Pliscoff_Petorca_JS },
    { name: 'Puntos Verdes y Limpios', layer: Puntos_Verdes_y_Limpios_JS },
    { name: 'Sitios Prioritarios', layer: Sitios_Prioritarios_Petorca_JS },
];

// Se definen las capas correspondientes a la categoria "Hidrología"
const capasHidrologia = [
    { name: 'Sistemas de Servicio Sanitario Rural, SSR (ex APR)', layer: APR_SSRJS },
    { name: 'Cuenca completa río Petorca', layer: Cuenca_completa_Rio_PetorcaJS },
    { name: 'DAA cuenca río Petorca 1956', layer: DAA_Cuenca_Rio_Petorca_1956_JS },
    { name: 'DAA cuenca río Petorca 1969', layer: DAA_Cuenca_Rio_Petorca_1969_JS },
    { name: 'DAA cuenca río Petorca 1984', layer: DAA_Cuenca_Rio_Petorca_1984_JS },
    { name: 'Estaciones de calidad de agua', layer: Estaciones_de_calidad_de_agua_Petorca_JS },
    { name: 'Obras subt registradas MEE comuna de Petorca', layer: Obras_Subt_Registradas_MEE_Comuna_Petorca_JS },
    { name: 'Obras subt registradas MEE cuenca del río Petorca', layer: Obras_Subt_Registradas_MEE_Cuenca_Río_Petorca_JS },
    { name: 'Plantas de tratamiento de aguas servidas ESVAL', layer: Plantas_de_Tratamiento_de_Aguas_Servidas_ESVAL_JS },
    { name: 'Poligonos de protección derechos del agua DGA', layer: Poligonos_de_protección_derechos_agua_DGA__JS },
    { name: 'PTAS Petorca', layer: PTAS_Petorca__JS },
    { name: 'Red Aducción', layer: Red_Aducción_JS },

];

// Se definen las capas correspondientes a la categoria "Comunicación"
const capasComunicacion = [
    { name: 'Antenas de servicio', layer: Antenas_Servicio_petorca_JS },
];

// Se definen las capas correspondientes a la categoria "Educación"
const capasEducacion = [
    { name: 'Establecimientos educacionales', layer: Establ_educacionales_Petorca_JS },
    { name: 'Establecimientos de educación parvularia', layer: Estab_Educ_parvularia_Petorca_JS },
    { name: 'Jardines Infantiles JUNJI', layer: Jardines_Infantiles_JUNJI_JS },
    { name: 'Jardines Integra', layer: Jardines_Integra_Petorca_JS },
];

// Se definen las capas correspondientes a la categoria "Salud"
const capasSalud = [
    { name: 'Establecimientos de salud', layer: Establecimientos_de_salud_Petorca_JS },
];

// Se definen las capas correspondientes a la categoria "Seguridad"
const capasSeguridad = [
    { name: 'Carabineros', layer: Carabineros_Petorca_JS },
    { name: 'Compañias de bomberos Pet', layer: Compañias_de_bomberos_Pet_JS },
    { name: 'Grifos', layer: Grifos_Petorca_JS },
    { name: 'Municipalidad de Petorca', layer: Municipalidad_Petorca_JS },
];

// Se definen todas las capas
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
    if (capa.layer && typeof capa.layer.eachLayer === 'function') {
        capa.layer.eachLayer(marker => {
            marker.feature.properties.title = capa.name;
            // Agrega el marcador y la capa al mapeo
            markerToLayer.set(marker, capa.layer);
        });
        searchLayer.addLayer(capa.layer);
        map.removeLayer(capa.layer); // Oculta la capa
    } else {
        console.error(`La capa ${capa.name} no es una capa de Leaflet válida.`);
    }
});

var controlSearch = new L.Control.Search({
    layer: searchLayer,
    initial: false,
    hideMarkerOnCollapse: true,
    propertyName: 'title', // Campo que se utilizará para la búsqueda, en este caso, su titulo
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
const colorInformación = 'white';


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

/* Se crea la información sobre la página */
function crearInformacion() {
    var div = document.createElement('div');
    div.style.padding = '10px';
    var text = document.createElement('p');
    var infoText1 = 'Este es el Visor interactivo de la Municipalidad de Petorca.<br><br> Puede presionar uno de los iconos de la barra lateral para agregar las capas al mapa.<br><br> Presionando el botón ';
    var imgLayers = 'assets/interface/layers.png';
    var infoText2 = ' podrás ver las capas activas y sus colores.<br><br> Presionando el botón ';
    var imgSearch = 'assets/interface/search.png';
    var infoText3 = ' podrás buscar las capas por su nombre y activarlas ahí.<br><br> Presionando el botón ';
    var imgWorld = 'assets/interface/worldwide.png';
    var infoText4 = ' podrás cambiar la imágen del mapa de fondo.';
    
    text.innerHTML = infoText1 + '<img src="' + imgLayers + '" alt="Icono de capas" style="width: 20px; height: 20px;">' + infoText2 + '<img src="' + imgSearch + '" alt="Icono de búsqueda" style="width: 20px; height: 20px;">' + infoText3 + '<img src="' + imgWorld + '" alt="Icono de mundo" style="width: 20px; height: 20px;">' + infoText4;
    div.appendChild(text);

    var button = document.createElement('button');
    button.textContent = 'Referencias';
    div.appendChild(button);

    var references = document.createElement('div');
    references.style.display = 'none';
    references.style.padding = '10px';
    references.style.overflow = 'auto';
    references.style.maxHeight = '200px';
    references.innerHTML = `
        Logo Basemaps: <a href="https://www.flaticon.com/free-icons/world" title="world icons">World icons created by turkkub - Flaticon</a><br>
        Icon Layers: <a href="https://www.flaticon.com/free-icons/layers" title="layers icons">Layers icons created by Those Icons - Flaticon</a><br>
        Icon Places: <a href="https://www.flaticon.com/free-icons/place" title="place icons">Place icons created by Freepik - Flaticon</a><br>
        Icon Sustainability <a href="https://www.flaticon.com/free-icons/sustainable" title="sustainable icons">Sustainable icons created by Eucalyp - Flaticon</a><br>
        Icon Public Service <a href="https://www.flaticon.com/free-icons/customer-service" title="customer service icons">Customer service icons created by Awicon - Flaticon</a><br>
        Icon Water <a href="https://www.flaticon.com/free-icons/water" title="water icons">Water icons created by Freepik - Flaticon</a><br>
        Icon Info <a href="https://www.flaticon.com/free-icons/info" title="info icons">Info icons created by Freepik - Flaticon</a><br>
        Icon Territory <a href="https://www.flaticon.com/free-icons/territory" title="territory icons">Territory icons created by HAJICON - Flaticon</a><br>
        Icon Search <a href="https://www.flaticon.com/free-icons/search" title="search icons">Search icons created by Freepik - Flaticon</a><br>
        Marker <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps and location icons">Maps and location icons created by Noplubery - Flaticon</a>
    `;
    div.appendChild(references);

    button.addEventListener('click', function() {
        if (references.style.display === 'none') {
            references.style.display = 'block';
        } else {
            references.style.display = 'none';
        }
    });

    return div;
}







crearListado("assets/interface/place.png", 'Lugares', colorLugares, crearLista());
crearListado("assets/interface/public-service.png", 'Servicios Esenciales',colorServicios, contenedorServicios);
crearListado("assets/interface/territories.png", 'Territorios',colorTerritorios, crearCapas(capasTerritorios,colorTerritorios));
crearListado("assets/interface/sustainable.png", 'Sustentabilidad',colorSustentabilidad, crearCapas(capasSustentabilidad,colorSustentabilidad));
crearListado("assets/interface/save-water.png", 'Hidrología',colorHidrologia, crearCapas(capasHidrologia,colorHidrologia));
crearListado("assets/interface/info.png", 'Información', colorInformación, crearInformacion());

//paleta de colores https://coolors.co/b9e7aa