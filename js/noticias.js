class Noticia{
    constructor() {
        this.checkApi();
        $(document).ready(() => {
            this.crearBoton();
        });
    }
    readInputFile(files) {
        var archivo = files[0];
        var tipoTexto = /text.*/;

        // Verificar si el archivo es de tipo texto
        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = (evento) => {
                // Obtener el contenido del archivo
                var contenido = evento.target.result;

                // Separar el contenido en líneas
                var lineas = contenido.split("\n");

                // Procesar cada línea
                lineas.forEach((linea) => {
                    if (linea.trim() !== "") {
                        // Separar los datos de cada noticia usando el guion bajo "_"
                        var partes = linea.split("_");
                        if (partes.length === 3) {
                            // Crear la estructura HTML para cada noticia dentro de un <article>
                            var article = $("<article>").append(
                                $("<h3>").text(partes[0].trim()),
                                $("<p>").text(partes[1].trim()),
                                $("<p>").text("Autor: " + partes[2].trim())
                            );

                            $("main").append(article);
                        }
                    }
                });
            };
            lector.readAsText(archivo);
        } else {
            $("main").append("<p>¡Vaya! El archivo no es válido.</p>");
        }
    }
    
    crearBoton(){
        // Crear el botón "Agregar Noticia"
        const botonAddNoticias = document.createElement("button");
        botonAddNoticias.textContent = "Agregar Noticia";
        
        // Función del botón para agregar la noticia
        botonAddNoticias.onclick = () => {
            // Recoger los valores de los inputs
            //var titular = $("main input:first-of-type").val().trim();
            var titular = $("#nuevoTitular").val().trim();
           // var cuerpo = $("main input:nth-of-type(2)").val().trim();
            var cuerpo = $("#nuevoCuerpo").val().trim();
           // var autor = $("main input:nth-of-type(3)").val().trim();
            var autor = $("#nuevoAutor").val().trim();

            if (titular === "" || cuerpo === "" || autor === "") {
               $("main > p").remove();
               $("main").append("<p> Algún campo está vacío, por tanto no se puede añadir la noticia</p>")
                return; 
            }

            // Llamar a la función para agregar la noticia con los valores recogidos
            $("main > p").remove();
            this.agregarNoticia(titular, cuerpo, autor);
        }

        // Añadir el botón al DOM
        $("main").append(botonAddNoticias);
    }

    agregarNoticia(titular, cuerpo, autor) {
        // Crear la estructura HTML para la noticia
        var article = $("<article>").append(
            $("<h3>").text(titular),
            $("<p>").text(cuerpo),
            $("<p>").text("Autor: " + autor)
        );

        // Añadir la noticia al final del conjunto de noticias 
        $("main").append(article);  
    }
    


    checkApi(){
        if (window.File && window.FileReader && window.FileList && window.Blob) {  
                //El navegador soporta el API File
                $("main").append("<p>Este navegador soporta el API File </p>");
            }else{
                $("main").append("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
            }
    }
}

var noticia = new Noticia();