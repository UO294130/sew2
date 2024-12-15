
class Pais{
    constructor(nombre,capital, poblacion){
        this.nombre =nombre;
        this.capital = capital;
        this.poblacion = poblacion;
       
        
    }

    setValores(circuito, gobierno, coordenadasMeta, religion) {
        this.circuito = circuito;
        this.gobierno = gobierno;
        this.coordenadasMeta = coordenadasMeta;
        this.religion = religion;

        this.apikey = "b8ac529b6fb702be32b00fae513ec194";
        this.ciudad = "Knittelfeld, AT";
        this.tipo = "&mode=xml";
        this.unidades = "&units=metric";
        this.idioma = "&lang=es";
        this.url = "https://api.openweathermap.org/data/2.5/forecast?q=" + this.ciudad + "&mode=xml" + this.unidades + this.idioma + "&APPID=" + this.apikey;
        this.correcto = "¡Todo correcto! XML recibido de <a href='http://openweathermap.org/'>OpenWeatherMap</a>"
    }

    getNombre() {
        return this.nombre;
    }

    getCapital() {
        return this.capital;
    }

    getPoblacion(){
        return this.poblacion;
    }

    getInformacionSecundaria() {
        return "<ul><li>" + "Nombre circuito: " + this.circuito + "</li>"
            + "<li>" + "Coordenadas meta: " + this.coordenadasMeta  + "</li>" 
            + "<li>" + "Tipo gobierno: " + this.gobierno + "</li>" 
            + "<li>" + "Religion mayoritaria: " + this.religion + "</li>"
            +  "</ul>"; 
    }

    escribirCoordenadas() {
        document.write("<p>" + this.coordenadasMeta + "</p>");
    }

    obtenerTiempo() {
        const self = this; // Guardar referencia al objeto para usar dentro del callback
    
        $.ajax({
            dataType: "xml",
            url: self.url,
            method: 'GET',
            success: function (datos) {
                const diasPrevision = $(datos).find("time"); // Obtener todas las entradas de tiempo
                const diasAgrupados = {}; // Objeto para agrupar datos por fecha
    
                $("article").remove(); // Limpiar artículos existentes en la página
    
                // Agrupar datos por día
                diasPrevision.each(function () {
                    const fechaCompleta = $(this).attr("from").split("T");
                    const fecha = fechaCompleta[0]; // Extraer solo la fecha
    
                    const temperatura = parseFloat($(this).find("temperature").attr("value"));
                    const humedad = parseFloat($(this).find("humidity").attr("value"));
                    const precipitacion = parseFloat($(this).find("precipitation").attr("value") || 0);
                    const icono = $(this).find("symbol").attr("var"); // Código del ícono
                    const descripcion = $(this).find("symbol").attr("name"); // Descripción del clima
    
                    if (!diasAgrupados[fecha]) {
                        diasAgrupados[fecha] = {
                            temperaturas: [],
                            humedades: [],
                            precipitaciones: [],
                            iconos: {},
                            descripciones: {}
                        };
                    }
    
                    diasAgrupados[fecha].temperaturas.push(temperatura);
                    diasAgrupados[fecha].humedades.push(humedad);
                    diasAgrupados[fecha].precipitaciones.push(precipitacion);
    
                    // Contar íconos y descripciones para determinar los más frecuentes
                    if (!diasAgrupados[fecha].iconos[icono]) {
                        diasAgrupados[fecha].iconos[icono] = 0;
                    }
                    diasAgrupados[fecha].iconos[icono]++;
    
                    if (!diasAgrupados[fecha].descripciones[descripcion]) {
                        diasAgrupados[fecha].descripciones[descripcion] = 0;
                    }
                    diasAgrupados[fecha].descripciones[descripcion]++;
                });
    
                // Procesar y mostrar datos agrupados
                for (let fecha in diasAgrupados) {
                    const datosDia = diasAgrupados[fecha];
                    const temperaturas = datosDia.temperaturas;
                    const humedades = datosDia.humedades;
                    const precipitaciones = datosDia.precipitaciones;
    
                    // Calcular valores
                    const temperaturaMin = Math.min(...temperaturas);
                    const temperaturaMax = Math.max(...temperaturas);
                    const humedadPromedio = (humedades.reduce((a, b) => a + b, 0) / humedades.length).toFixed(1);
                    const precipitacionPromedio = (precipitaciones.reduce((a, b) => a + b, 0) / precipitaciones.length).toFixed(1);
    
                    const mensajePrecipitacion = precipitacionPromedio > 0
                        ? `Precipitación: ${precipitacionPromedio} mm`
                        : "Precipitación: No disponible";
    
                    // Determinar ícono y descripción más frecuentes
                    const iconoMasFrecuente = Object.keys(datosDia.iconos).reduce((a, b) =>
                        datosDia.iconos[a] > datosDia.iconos[b] ? a : b
                    );
    
                    const descripcionMasFrecuente = Object.keys(datosDia.descripciones).reduce((a, b) =>
                        datosDia.descripciones[a] > datosDia.descripciones[b] ? a : b
                    );
    
                    // Crear artículo
                    const article = $("<article>")
                        .append(
                            $("<h3>").text(`Fecha: ${fecha}`),
                            $("<p>").text(`Temperatura máxima: ${temperaturaMax}°C`),
                            $("<p>").text(`Temperatura mínima: ${temperaturaMin}°C`),
                            $("<p>").text(`Humedad promedio: ${humedadPromedio}%`),
                            $("<p>").text(mensajePrecipitacion),
                            $("<p>").text(`Clima: ${descripcionMasFrecuente}`),
                            $("<img>")
                                .attr("src", `https://openweathermap.org/img/wn/${iconoMasFrecuente}.png`)
                                .attr("alt", `Clima: ${descripcionMasFrecuente}`)
                        );
    
                    $("main").append(article); // Agregar el artículo al elemento <main>
                }
            },
            error: function () {
                $("main").append("<article><p>Error al obtener los datos de OpenWeatherMap</p></article>");
            }
        });
    }
    

    // obtenerTiempo() {
    //     const self = this; // Guardar referencia al objeto para usar dentro del callback
    
    //     $.ajax({
    //         dataType: "xml",
    //         url: self.url,
    //         method: 'GET',
    //         success: function (datos) {
    //             const diasPrevision = $(datos).find("time"); // Obtener todas las entradas de tiempo
    //             const diasAgrupados = {}; // Objeto para agrupar datos por fecha a las 12:00h
    
    //             $("article").remove(); // Limpiar artículos existentes en la página
    
    //             // Filtrar y agrupar datos por día para las 12:00h
    //             diasPrevision.each(function () {
    //                 const fechaCompleta = $(this).attr("from"); // Ejemplo: "2024-11-26T12:00:00"
    //                 const [fecha, hora] = fechaCompleta.split("T"); // Separar la fecha y la hora
    
    //                 if (hora.startsWith("12:00")) { // Solo considerar las entradas a las 12:00h
    //                     const temperatura = parseFloat($(this).find("temperature").attr("value"));
    //                     const humedad = parseFloat($(this).find("humidity").attr("value"));
    //                     const precipitacion = parseFloat($(this).find("precipitation").attr("value") || 0);
    //                     const icono = $(this).find("symbol").attr("var"); // Código del ícono
    //                     const descripcion = $(this).find("symbol").attr("name"); // Descripción del clima
    
    //                     // Guardar los datos agrupados por fecha
    //                     diasAgrupados[fecha] = {
    //                         temperatura,
    //                         humedad,
    //                         precipitacion,
    //                         icono,
    //                         descripcion
    //                     };
    //                 }
    //             });
    
    //             // Mostrar datos por día
    //             for (let fecha in diasAgrupados) {
    //                 const datosDia = diasAgrupados[fecha];
    
    //                 // Crear artículo
    //                 const article = $("<article>")
    //                     .append(
    //                         $("<h4>").text(`Fecha: ${fecha}`),
    //                         $("<p>").text(`Temperatura: ${datosDia.temperatura}°C`),
    //                         $("<p>").text(`Humedad: ${datosDia.humedad}%`),
    //                         $("<p>").text(`Precipitación: ${datosDia.precipitacion > 0 ? `${datosDia.precipitacion} mm` : "No disponible"}`),
    //                         $("<p>").text(`Clima: ${datosDia.descripcion}`),
    //                         $("<img>")
    //                             .attr("src", `https://openweathermap.org/img/wn/${datosDia.icono}.png`)
    //                             .attr("alt", `Clima: ${datosDia.descripcion}`)
    //                     );
    
    //                 $("main").append(article); // Agregar el artículo al elemento <main>
    //             }
    //         },
    //         error: function () {
    //             $("main").append("<article><p>Error al obtener los datos de OpenWeatherMap</p></article>");
    //         }
    //     });
    // }
    
    
    

    

}