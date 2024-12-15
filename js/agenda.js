class Agenda{
    constructor(){
        this.url = "https://ergast.com/api/f1/current.json"; 
        this.crearBoton();
    }

    cargarCarreras() {
        // Realiza la consulta a la API Ergast y maneja todo el proceso
        $.ajax({
            url: this.url,
            method: "GET",
            dataType: "json",
            success: (data) => {
                // Obtener las carreras de la respuesta
                const carreras = data.MRData.RaceTable.Races;
      
                const contenedor = $("main");
                contenedor.empty(); // Limpia el contenido previo, si lo hay

                // Recorrer las carreras y crear los elementos HTML
                carreras.forEach((carrera) => {
                    const nombreCarrera = carrera.raceName;
                    const nombreCircuito = carrera.Circuit.circuitName;
                    const coordenadas = `${carrera.Circuit.Location.lat}, ${carrera.Circuit.Location.long}`;
                    const fechaHora = `${carrera.date} ${carrera.time || ''}`;

                    // Crear un elemento para cada carrera
                    const carreraHTML = `
                        <article>
                            <h3>${nombreCarrera}</h3>
                            <p>Circuito: ${nombreCircuito}</p>
                            <p>Coordenadas: ${coordenadas}</p>
                            <p>Fecha y hora:  ${fechaHora}</p>
                        </article>
                    `;
                    contenedor.append(carreraHTML);
                });
            }
        });
        
    }

    crearBoton(){
        const botonTemporada = document.createElement("button");
        botonTemporada.textContent = "Pulse para ver todas las carreras de la Temporada";
        botonTemporada.onclick = () => {
           this.cargarCarreras();
        }
        const container = document.querySelector("main");
        container.append(botonTemporada);
    }
}