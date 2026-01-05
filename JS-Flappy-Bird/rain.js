const RAIN_CONTAINER = document.getElementById('rain-container');
const AUGURI_TEXT = document.getElementById('auguri-text');
const CANVAS = document.getElementById('canvas'); // NUOVO: Riferimento al canvas

// I percorsi dei tuoi 3 PNG per la pioggia.
const RAIN_ASSETS = [
    'img/siga.png', 
    'img/maria.png', 
    'img/hellokitty.png', 
];

let rainInterval;
let assetIndex = 0;

// NUOVO: Funzione per calcolare la posizione Y di arresto
function getYStop() {
    if (!CANVAS) return document.body.scrollHeight; // Fallback
    
    // 1. Ottieni la posizione del canvas rispetto alla finestra
    const rect = CANVAS.getBoundingClientRect();
    
    // 2. Calcola dove le immagini devono atterrare: la base del canvas + un margine (es. 20px)
    // Usiamo rect.top + rect.height per ottenere la base del canvas
    return rect.top + rect.height + 20; 
}


function createRaindrop() {
    // Cicla tra i 3 asset (siga, maria, hellokitty) in sequenza
    const assetPath = RAIN_ASSETS[assetIndex % RAIN_ASSETS.length];
    assetIndex++;

    const raindrop = document.createElement('img');
    raindrop.src = assetPath;
    
    // Dimensione e posizioni iniziali
    const size = Math.floor(Math.random() * 20) + 30; // Dimensione tra 30px e 50px
    const initialX = Math.random() * window.innerWidth;
    
    raindrop.style.cssText = `
        position: fixed; 
        width: ${size}px;
        height: ${size}px;
        left: ${initialX}px;
        top: -${size}px; /* INIZIA IN ALTO */
        opacity: 0.8; 
        pointer-events: none;
        z-index: -10; 
    `;
    
    RAIN_CONTAINER.appendChild(raindrop);

    // Avvia l'animazione di caduta
    animateRaindrop(raindrop, size);
}

function animateRaindrop(element, size) {
    const duration = Math.random() * 3 + 4; // Durata caduta tra 4 e 7 secondi
    const yStopPosition = getYStop(); // Calcola la posizione Y del "muro"
    
    // La trasformazione deve spostare l'elemento da top: -size a yStopPosition.
    // Il valore di translateY deve essere: (yStopPosition + size)
    const translateY_value = yStopPosition + size; 
    
    const rotationEnd = (Math.random() > 0.5 ? 360 : -360) * (Math.random() * 2 + 1); 

    // Applicazione della transizione per l'animazione di caduta
    element.style.transition = `transform ${duration}s linear`;
    
    // Y POSITIVO SIGNIFICA CADERE VERSO IL BASSO
    element.style.transform = `translateY(${translateY_value}px) rotate(${rotationEnd}deg)`;

    // Logica per ricreare la goccia una volta caduta
    element.addEventListener('transitionend', function handler() {
        element.removeEventListener('transitionend', handler);
        element.remove();
        
        // Ricrea immediatamente per mantenere il ciclo
        if (UI.rainActive) {
            createRaindrop(); 
        }
    });

    // Fallback per la rimozione
    setTimeout(() => {
        if (element.parentNode) {
            element.remove();
        }
    }, duration * 1000 + 500);
}


// Funzione chiamata da game.js per iniziare la pioggia (punteggio >= 10)
function startRainEffect() {
    // Mostra la scritta AUGURI
    AUGURI_TEXT.style.display = 'block'; 
    
    if (!rainInterval) {
        // Tasso di spawn: 6 al secondo (1 ogni 166ms)
        const SPAWN_RATE = 1000 / 6; 
        
        // Avviamo la pioggia
        rainInterval = setInterval(createRaindrop, SPAWN_RATE); 
    }
}

// Funzione chiamata da game.js per fermare l'effetto (Game Over)
function stopRainEffect() {
    // Nascondi la scritta AUGURI
    AUGURI_TEXT.style.display = 'none'; 
    
    if (rainInterval) {
        clearInterval(rainInterval);
        rainInterval = null;
        // Rimuovi tutti gli elementi animati rimanenti
        RAIN_CONTAINER.innerHTML = ''; 
    }
}