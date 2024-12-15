class Memoria {
    constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }

    elements = [
        { "element": "RedBull", "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
        { "element": "RedBull", "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
        { "element": "McLaren", "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
        { "element": "McLaren", "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
        { "element": "Alpine", "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
        { "element": "Alpine", "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
        { "element": "AstonMartin", "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
        { "element": "AstonMartin", "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
        { "element": "Ferrari", "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
        { "element": "Ferrari", "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
        { "element": "Mercedes", "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" },
        { "element": "Mercedes", "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" }
    ];

    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.classList.remove('flip');
            this.secondCard.classList.remove('flip');
            this.resetBoard();
        }, 1000);
    }

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    checkForMatch() {
        if (this.firstCard.dataset.element === this.secondCard.dataset.element) {
            this.disableCards();
        } else {
            this.unflipCards();
        }
    }

    disableCards() {
        this.firstCard.dataset.state = 'revealed';
        this.secondCard.dataset.state = 'revealed';
        this.resetBoard();
    }

    createElements() {
        const container = document.querySelector("main > section");

        for (let element of this.elements) {
            const article = document.createElement("article");
            article.setAttribute("data-element", element.element);

            const text = document.createElement("h3");
            text.textContent = "Tarjeta de memoria";

            const img = document.createElement("img");
            img.src = element.source;
            img.alt = element.element;

            article.appendChild(text);
            article.appendChild(img);
            container.appendChild(article);
        }
    }

    addEventListeners() {
        const cards = document.querySelectorAll('main > section > article');

        cards.forEach(card => {
            card.addEventListener('click', this.flipCard.bind(card,this)); // Pasa solo `this` (el juego) a flipCard
        });
    }

    flipCard(game) {
        const card = this; 
    
        // Si no se puede girar la carta, retornar
        if (game.lockBoard || card === game.firstCard || card.dataset.state === 'revealed'){
            return;
        } 
    
       card.classList.add('flip');
    
        if (!game.hasFlippedCard) {
            game.hasFlippedCard = true;
            game.firstCard = card;
        } else {
            game.secondCard = card;
            game.checkForMatch();
        }
    }
    
}