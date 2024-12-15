class Semaforo{
    constructor(){
        this.levels = [0.2,0.5,0.8];
        this.lights = 4;
        this.unload_moment = 0;
        this.clic_moment = null;
        this.difficulty = this.levels[Math.floor(Math.random() * 3)];
        this.createStructure();
    }

    createStructure(){
        const container = document.querySelector("main");
        const title = document.createElement("h2");
        title.textContent ="Semaforo"
        container.appendChild(title);

        for(let i = 0; i<this.lights; i++){
            const bloqueLight = document.createElement("div");
            container.appendChild(bloqueLight);
        }
        const botonStart = document.createElement("button");
        botonStart.textContent = "Start";
        botonStart.onclick = () => {
            this.initSequence();
        }
        container.appendChild(botonStart);;
        
        const botonReaccion = document.createElement("button");
        botonReaccion.textContent = "Reaccion";
        botonReaccion.disabled = true;
        botonReaccion.onclick = () => {
            this.stopReaction();
        }
        container.append(botonReaccion);

        this.reactionTime = document.createElement('p');
        container.appendChild(this.reactionTime);
    }

    initSequence(){
        const botonStart = document.querySelector("main button");

        botonStart.disabled = true; 
        var main = document.getElementsByTagName('main')[0];
        main.classList.add('load');
        
        const delay = 2000 + this.difficulty * 100;
        setTimeout(() => {
            this.unload_moment =  Date.now(); 
            this.endSequence();
        }, delay);
    }

    endSequence(){
        var main = document.getElementsByTagName('main')[0];
        main.classList.add('unload');
        const botonReaccion = document.querySelector("main button:nth-of-type(2)");
        botonReaccion.disabled = false;
    }

    stopReaction(){
        this.clic_moment = Date.now();

        const tiempoReaccion = (this.clic_moment - this.unload_moment) / 1000;
        const tiempoFinal= tiempoReaccion.toFixed(3);

        this.reactionTime.textContent = "Tiempo de reaccion: " +  tiempoFinal + " segundos";
        document.querySelector("main").classList.remove('load', 'unload');

        const botonReaccion = document.querySelector("main button:nth-of-type(2)");
        botonReaccion.disabled = true;

        const botonStart = document.querySelector("main button");
        botonStart.disabled = false;
    }
}