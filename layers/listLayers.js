/* Se crean como variables las capas poligonales */
var Atractivos_turísticos_2020_Petorca_Sernatur_JS;
var Comunas_4ta_y_5ta_region_JS;
var Comuna_Petorca_JS;
var Limites_Unidades_Vecinales_Petorca_JS;
var Poblados_Petorca_JS;
var Puntos_Críticos_Emergencia_JS;
var Quebradas_y_cursos_de_agua_JS;
var Red_Hídrica_Cuenca_Rio_Petorca_JS;
var Red_PRE_2018_Petorca_JS;
var Sendero_de_Chile_Petorca_JS;
var Unidades_vecinales_2017_Petorca_JS;
var Areas_Verdes_2023_JS;
var Campanas_reciclaje_de_vidrio_1_JS;
var Clima_Koppen_Petorca_JS;
var Est_Fluviométricas_vigentes_con_datos_Petorca_JS;
var Est_Meteorologicas_vigente_con_datos_Petorca_JS;
var Formaciones_vegetacionales_Gajardo_JS;
var Humedales_Petorca_JS;
var Pisos_Vegetacionales_Pliscoff_Petorca_JS;
var Puntos_Verdes_y_Limpios_JS;
var Sitios_Prioritarios_Petorca_JS;
var DAA_Cuenca_Rio_Petorca_1956_JS;
var DAA_Cuenca_Rio_Petorca_1969_JS;
var DAA_Cuenca_Rio_Petorca_1984_JS;
var Estaciones_de_calidad_de_agua_Petorca_JS;
var Obras_Subt_Registradas_MEE_Comuna_Petorca_JS;
var Obras_Subt_Registradas_MEE_Cuenca_Río_Petorca_JS;
var Plantas_de_Tratamiento_de_Aguas_Servidas_ESVAL_JS;
var Poligonos_de_protección_derechos_agua_DGA__JS;
var PTAS_Petorca__JS;
var Red_Aducción_JS;
var Antenas_Servicio_petorca_JS;
var Establ_educacionales_Petorca_JS;
var Estab_Educ_parvularia_Petorca_JS;
var Jardines_Infantiles_JUNJI_JS;
var Jardines_Integra_Petorca_JS;
var Establecimientos_de_salud_Petorca_JS;
var Carabineros_Petorca_JS;
var Compañias_de_bomberos_Pet_JS;
var Grifos_Petorca_JS;
var Municipalidad_Petorca_JS;
var APR_SSRJS;
var Cuenca_completa_Rio_PetorcaJS;

/* Se crea un arreglo con todos los datos de capas */
const allData = [
    { name: 'Atractivos_turísticos_2020_Petorca_Sernatur_', data: Atractivos_turísticos_2020_Petorca_Sernatur_ },
    { name: 'Comunas_4ta_y_5ta_region_', data: Comunas_4ta_y_5ta_region_ },
    { name: 'Comuna_Petorca_', data: Comuna_Petorca_ },
    { name: 'Limites_Unidades_Vecinales_Petorca_', data: Limites_Unidades_Vecinales_Petorca_ },
    { name: 'Poblados_Petorca_', data: Poblados_Petorca_ },
    { name: 'Puntos_Críticos_Emergencia_', data: Puntos_Críticos_Emergencia_ },
    { name: 'Quebradas_y_cursos_de_agua_', data: Quebradas_y_cursos_de_agua_ },
    { name: 'Red_Hídrica_Cuenca_Rio_Petorca_', data: Red_Hídrica_Cuenca_Rio_Petorca_ },
    { name: 'Red_PRE_2018_Petorca_', data: Red_PRE_2018_Petorca_ },
    { name: 'Sendero_de_Chile_Petorca_', data: Sendero_de_Chile_Petorca_ },
    { name: 'Unidades_vecinales_2017_Petorca_', data: Unidades_vecinales_2017_Petorca_ },
    { name: 'Areas_Verdes_2023_', data: Areas_Verdes_2023_ },
    { name: 'Campanas_reciclaje_de_vidrio_1_', data: Campanas_reciclaje_de_vidrio_1_ },
    { name: 'Clima_Koppen_Petorca_', data: Clima_Koppen_Petorca_ },
    { name: 'Est_Fluviométricas_vigentes_con_datos_Petorca_', data: Est_Fluviométricas_vigentes_con_datos_Petorca_ },
    { name: 'Est_Meteorologicas_vigente_con_datos_Petorca_', data: Est_Meteorologicas_vigente_con_datos_Petorca_ },
    { name: 'Formaciones_vegetacionales_Gajardo_', data: Formaciones_vegetacionales_Gajardo_ },
    { name: 'Humedales_Petorca_', data: Humedales_Petorca_ },
    { name: 'Pisos_Vegetacionales_Pliscoff_Petorca_', data: Pisos_Vegetacionales_Pliscoff_Petorca_ },
    { name: 'Puntos_Verdes_y_Limpios_', data: Puntos_Verdes_y_Limpios_ },
    { name: 'Sitios_Prioritarios_Petorca_', data: Sitios_Prioritarios_Petorca_ },
    { name: 'APR_SSR', data: APR_SSR },
    { name: 'Cuenca_completa_Rio_Petorca', data: Cuenca_completa_Rio_Petorca },
    { name: 'DAA_Cuenca_Rio_Petorca_1956_', data: DAA_Cuenca_Rio_Petorca_1956_ },
    { name: 'DAA_Cuenca_Rio_Petorca_1969_', data: DAA_Cuenca_Rio_Petorca_1969_ },
    { name: 'DAA_Cuenca_Rio_Petorca_1984_', data: DAA_Cuenca_Rio_Petorca_1984_ },
    { name: 'Estaciones_de_calidad_de_agua_Petorca_', data: Estaciones_de_calidad_de_agua_Petorca_ },
    { name: 'Obras_Subt_Registradas_MEE_Comuna_Petorca_', data: Obras_Subt_Registradas_MEE_Comuna_Petorca_ },
    { name: 'Obras_Subt_Registradas_MEE_Cuenca_Río_Petorca_', data: Obras_Subt_Registradas_MEE_Cuenca_Río_Petorca_ },
    { name: 'Plantas_de_Tratamiento_de_Aguas_Servidas_ESVAL_', data: Plantas_de_Tratamiento_de_Aguas_Servidas_ESVAL_ },
    { name: 'Poligonos_de_protección_derechos_agua_DGA__', data: Poligonos_de_protección_derechos_agua_DGA__ },
    { name: 'PTAS_Petorca__', data: PTAS_Petorca__ },
    { name: 'Red_Aducción_', data: Red_Aducción_ },
    { name: 'Antenas_Servicio_petorca_', data: Antenas_Servicio_petorca_ },
    { name: 'Establ_educacionales_Petorca_', data: Establ_educacionales_Petorca_ },
    { name: 'Estab_Educ_parvularia_Petorca_', data: Estab_Educ_parvularia_Petorca_ },
    { name: 'Jardines_Infantiles_JUNJI_', data: Jardines_Infantiles_JUNJI_ },
    { name: 'Jardines_Integra_Petorca_', data: Jardines_Integra_Petorca_ },
    { name: 'Establecimientos_de_salud_Petorca_', data: Establecimientos_de_salud_Petorca_ },
    { name: 'Carabineros_Petorca_', data: Carabineros_Petorca_ },
    { name: 'Compañias_de_bomberos_Pet_', data: Compañias_de_bomberos_Pet_ },
    { name: 'Grifos_Petorca_', data: Grifos_Petorca_ },
    { name: 'Municipalidad_Petorca_', data: Municipalidad_Petorca_ },
];
