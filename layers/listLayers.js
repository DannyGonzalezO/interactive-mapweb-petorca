/* Se crean como variables las capas poligonales */
var comuna_petorcaJS;
var comunas_4_5_regionJS;
var limites_uni_vecinalesJS;
var pobladosJS;
var areasverdesJS;
var climakoppenJS;
var fluviometricasJS;
var meteorologicasJS;
var humedalesJS;
var vegetacionalesJS;
var apr_ssrJS;
var casub_plqJS;
var cuenca_rio_petorcaJS;
var daa_cuenca_rio_petorca_1956JS;
var daa_cuenca_rio_petorca_1969JS;
var daa_cuenca_rio_petorca_1984JS;
var estaciones_calidad_de_aguaJS;
var obras_subt_reg_meeJS;
var obras_subt_reg_mee_cuenca_rioJS;
var plantas_tratamiento_aguas_servidas_esvalJS;
var antenas_servicio_petorcaJS;
var estab_educ_parvulariaJS;
var estab_educacionalesJS;
var jardines_infantiles_junjiJS;
var jardines_integraJS;
var estab_saludJS;
var carabinerosJS;
var compañias_bomberosJS;
var grifosJS;
var municipalidadJS;


/* Se crea un arreglo con todos los datos GeoJSON */
const allData = [
    { name: 'comuna_petorca', data: comuna_petorca },
    { name: 'comunas_4_5_region', data: comunas_4_5_region },
    { name: 'limites_uni_vecinales', data: limites_uni_vecinales },
    { name: 'poblados', data: poblados },
    { name: 'areasverdes', data: areasverdes },
    { name: 'climakoppen', data: climakoppen },
    { name: 'fluviometricas', data: fluviometricas },
    { name: 'meteorologicas', data: meteorologicas },
    { name: 'humedales', data: humedales },
    { name: 'vegetacionales', data: vegetacionales },
    { name: 'apr_ssr', data: apr_ssr },
    { name: 'casub_plq', data: casub_plq },
    { name: 'cuenca_rio_petorca', data: cuenca_rio_petorca },
    { name: 'daa_cuenca_rio_petorca_1956', data: daa_cuenca_rio_petorca_1956 },
    { name: 'daa_cuenca_rio_petorca_1969', data: daa_cuenca_rio_petorca_1969 },
    { name: 'daa_cuenca_rio_petorca_1984', data: daa_cuenca_rio_petorca_1984 },
    { name: 'estaciones_calidad_de_agua', data: estaciones_calidad_de_agua },
    { name: 'obras_subt_reg_mee', data: obras_subt_reg_mee },
    { name: 'obras_subt_reg_mee_cuenca_rio', data: obras_subt_reg_mee_cuenca_rio },
    { name: 'plantas_tratamiento_aguas_servidas_esval', data: plantas_tratamiento_aguas_servidas_esval },
    { name: 'antenas_servicio_petorca', data: antenas_servicio_petorca },
    { name: 'estab_educ_parvularia', data: estab_educ_parvularia },
    { name: 'estab_educacionales', data: estab_educacionales },
    { name: 'jardines_infantiles_junji', data: jardines_infantiles_junji },
    { name: 'jardines_integra', data: jardines_integra },
    { name: 'estab_salud', data: estab_salud },
    { name: 'carabineros', data: carabineros },
    { name: 'compañias_bomberos', data: compañias_bomberos },
    { name: 'grifos', data: grifos },
    { name: 'municipalidad', data: municipalidad }
];


