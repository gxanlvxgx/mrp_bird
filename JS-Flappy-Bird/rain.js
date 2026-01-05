const RAIN_CONTAINER = document.getElementById('rain-container');
const AUGURI_TEXT = document.getElementById('auguri-text');
const CANVAS = document.getElementById('canvas'); 

// I percorsi dei tuoi 3 PNG per la pioggia.
const RAIN_ASSETS = [
    'img/siga.png', 
    'img/maria.png', 
    'img/hellokitty.png', // L'asset che vogliamo ingrandire
];

let rainInterval;
let assetIndex = 0;

function getYStop() {
    if (!CANVAS) return document.body.scrollHeight;
    
    // 1. Ottieni la posizione del canvas rispetto alla finestra
    const rect = CANVAS.getBoundingClientRect();
    
    // 2. Calcola dove le immagini devono atterrare: la base del canvas + un margine (es. 20px)
    return rect.top + rect.height + 20; 
}


function createRaindrop() {
    // Cicla tra i 3 asset (siga, maria, hellokitty) in sequenza
    const assetPath = RAIN_ASSETS[assetIndex % RAIN_ASSETS.length];
    assetIndex++;

    const raindrop = document.createElement('img');
    raindrop.src = assetPath;
    
    // Dimensione base (casuale tra 30px e 50px)
    let size = Math.floor(Math.random() * 20) + 30; 
    
    // NUOVA LOGICA: Raddoppia la dimensione se l'asset è hellokitty
    if (assetPath.includes('hellokitty.png')) {
        size = size * 3; // Raddoppia la dimensione
    }
    // FINE NUOVA LOGICA
    
    const initialX = Math.random() * window.innerWidth;
    
    raindrop.style.cssText = `
        position: fixed; 
        width: ${size}px;
        height: ${size}px;
        left: ${initialX}px;
        top: -${size}px; 
        opacity: 0.8; 
        pointer-events: none;
        z-index: -10; 
    `;
    
    RAIN_CONTAINER.appendChild(raindrop);

    // Avvia l'animazione di caduta
    animateRaindrop(raindrop, size);
}

function animateRaindrop(element, size) {
    const duration = Math.random() * 3 + 4; 
    const yStopPosition = getYStop(); 
    
    // Calcolo del valore di translateY
    const translateY_value = yStopPosition + size; 
    
    const rotationEnd = (Math.random() > 0.5 ? 360 : -360) * (Math.random() * 2 + 1); 

    element.style.transition = `transform ${duration}s linear`;
    
    element.style.transform = `translateY(${translateY_value}px) rotate(${rotationEnd}deg)`;

    element.addEventListener('transitionend', function handler() {
        element.removeEventListener('transitionend', handler);
        element.remove();
        
        if (UI.rainActive) {
            createRaindrop(); 
        }
    });

    setTimeout(() => {
        if (element.parentNode) {
            element.remove();
        }
    }, duration * 1000 + 500);
}


function startRainEffect() {
    AUGURI_TEXT.style.display = 'block'; 
    
    if (!rainInterval) {
        const SPAWN_RATE = 1000 / 6; 
        
        rainInterval = setInterval(createRaindrop, SPAWN_RATE); 
    }
}

function stopRainEffect() {
    AUGURI_TEXT.style.display = 'none'; 
    
    if (rainInterval) {
        clearInterval(rainInterval);
        rainInterval = null;
        RAIN_CONTAINER.innerHTML = ''; 
    }
}