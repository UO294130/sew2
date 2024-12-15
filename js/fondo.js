class Fondo {
    constructor(pais, capital, circuito) {
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
    }

    obtenerImagenDeFondo() {
        var self = this;  // Guardar la referencia de 'this' en 'self'
        var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        const tags = self.circuito + "," + "F1";

        let imageUrl = localStorage.getItem("fondoImagen");

        if (!imageUrl) {
            $.getJSON(flickrAPI, {
                tags: tags,  
                tagmode: "all", 
                format: "json"
            })
            .done((data) => {
                if (data.items && data.items.length > 0) {
                    imageUrl = data.items[13].media.m.replace("_m", "_b"); 
                    localStorage.setItem("fondoImagen", imageUrl); 
                    self.establecerImagen(imageUrl); 
                }
            })
            .fail(() => {
                console.error("Error al obtener las imágenes de Flickr");
            });
        } else {
            this.establecerImagen(imageUrl);
        }
    }

    establecerImagen(imageUrl) {
        if (imageUrl) {
            $("body").css({
                "background-image": "url(" + imageUrl + ")",
                "background-size": "cover",
                "background-position": "center center",
                "background-repeat": "no-repeat",
                "background-attachment": "fixed",
                "height": "auto",
                "min-height": "100vh",
                "width": "100%",
                "position": "relative",
                "overflow" : "hidden"

            });
        } else {
            console.error("No se pudo obtener una URL de imagen válida.");
        }
    }
}


