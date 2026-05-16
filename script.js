// ==========================================================
// TECHSTORE - LOGICA EVOLUTA PER E-COMMERCE (CARRELLO & FILTRI)
// ==========================================================

document.addEventListener('DOMContentLoaded', function() {
    // 1. Aggiorna il badge del carrello all'avvio su qualsiasi pagina
    aggiornaBadgeCarrello();

    // 2. Gestione dinamica del filtro prezzo nella pagina Catalogo
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            priceValue.innerText = "Fino a €" + this.value;
            filtraProdottiPerPrezzo(this.value);
        });
    }

    // 3. Se ci troviamo nella pagina del carrello, la popoliamo dinamicamente
    if (window.location.pathname.includes('carrello.html')) {
        renderizzaCarrello();
    }
});

// --- FUNZIONI CORE DEL CARRELLO (LocalStorage) ---

// Recupera gli articoli salvati nel browser
function ottieniCarrello() {
    const carrello = localStorage.getItem('techstore_cart');
    return carrello ? JSON.parse(carrello) : [];
}

// Salva gli articoli nel browser e aggiorna i badge visivi
function salvaCarrello(carrello) {
    localStorage.setItem('techstore_cart', JSON.stringify(carrello));
    aggiornaBadgeCarrello();
}

// Aggiorna il numerino sopra l'icona del carrello
function aggiornaBadgeCarrello() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const carrello = ottieniCarrello();
        const totaleArticoli = carrello.reduce((tot, item) => tot + item.quantita, 0);
        badge.innerText = totaleArticoli;
        
        // Effetto animazione al cambio di valore
        badge.style.transform = "scale(1.3)";
        setTimeout(() => { badge.style.transform = "scale(1)"; }, 200);
    }
}

// Funzione intelligente collegata al click dei bottoni "Aggiungi al Carrello"
function aggiungiAlCarrello() {
    // Sfrutta l'evento del browser per capire da quale card è partito il click
    const evento = window.event;
    if (!evento) return;
    
    const elementoCliccato = evento.target;
    
    // Cerca se il click è avvenuto in una card del catalogo o nella pagina del prodotto singolo
    const card = elementoCliccato.closest('.product-card');
    const paginaSingola = elementoCliccato.closest('.single-product-container');
    
    let nome, prezzoTesto, immagine, quantita = 1;
    
    if (card) {
        // Estrae i dati dalla griglia della Home o del Catalogo
        nome = card.querySelector('h3').innerText;
        prezzoTesto = card.querySelector('.price').innerText;
        immagine = card.querySelector('img').src;
    } else if (paginaSingola) {
        // Estrae i dati dalla pagina di dettaglio prodotto
        nome = paginaSingola.querySelector('h1').innerText;
        prezzoTesto = paginaSingola.querySelector('.huge-price').innerText;
        immagine = paginaSingola.querySelector('.main-img').src;
        
        // Controlla se l'utente ha selezionato una quantità specifica (es: 2, 3 laptop)
        const qtyInput = paginaSingola.querySelector('.qty-input');
        if (qtyInput) {
            quantita = parseInt(qtyInput.value) || 1;
        }
    } else {
        return;
    }
    
    // Converte la stringa del prezzo (es: "€ 1.450,00") in un numero decimale puro (1450.00)
    const prezzo = parseFloat(prezzoTesto.replace('€', '').replace(/\./g, '').replace(',', '.').trim());
    
    let carrello = ottieniCarrello();
    const indiceElemento = carrello.findIndex(item => item.nome === nome);
    
    if (indiceElemento > -1) {
        carrello[indiceElemento].quantita += quantita;
    } else {
        carrello.push({ nome, prezzo, immagine, quantita });
    }
    
    salvaCarrello(carrello);
    alert(`"${nome}" è stato aggiunto al carrello!`);
}

// --- RENDERING DINAMICO DELLA PAGINA CARRELLO ---

function renderizzaCarrello() {
    const contenitoreArticoli = document.querySelector('.cart-items');
    if (!contenitoreArticoli) return;
    
    const carrello = ottieniCarrello();
    
    // Ripristiniamo il titolo della sezione prima di scrivere i prodotti
    contenitoreArticoli.innerHTML = '<h2>Il tuo Carrello</h2>';
    
    if (carrello.length === 0) {
        contenitoreArticoli.innerHTML += '<p style="padding: 20px 0; color: #666;">Il tuo carrello è vuoto. Esplora il catalogo per aggiungere prodotti!</p>';
        aggiornaRiepilogoPrezzi(0);
        return;
    }
    
    let subtotale = 0;
    
    carrello.forEach((prodotto, indice) => {
        const totaleRiga = prodotto.prezzo * prodotto.quantita;
        subtotale += totaleRiga;
        
        const itemHTML = `
            <div class="cart-item">
                <img src="${prodotto.immagine}" alt="${prodotto.nome}">
                <div class="item-details">
                    <h3>${prodotto.nome}</h3>
                    <p style="color: #666; font-size: 0.9rem;">Unitario: € ${prodotto.prezzo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                </div>
                <div class="item-qty">
                    <input type="number" value="${prodotto.quantita}" min="1" onchange="cambiaQuantitaProdotto(${indice}, this.value)">
                </div>
                <div class="item-price">€ ${totaleRiga.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</div>
                <button class="btn-remove" onclick="rimuoviDalCarrello(${indice})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        contenitoreArticoli.innerHTML += itemHTML;
    });
    
    aggiornaRiepilogoPrezzi(subtotale);
}

function cambiaQuantitaProdotto(indice, nuovaQty) {
    let carrello = ottieniCarrello();
    const qty = parseInt(nuovaQty);
    if (qty > 0) {
        carrello[indice].quantita = qty;
        salvaCarrello(carrello);
        renderizzaCarrello();
    }
}

function rimuoviDalCarrello(indice) {
    let carrello = ottieniCarrello();
    carrello.splice(indice, 1);
    salvaCarrello(carrello);
    renderizzaCarrello();
}

function aggiornaRiepilogoPrezzi(subtotale) {
    const summaryLines = document.querySelectorAll('.summary-line span:last-child');
    const totalLine = document.querySelector('.summary-line.total span:last-child');
    
    const stringaSubtotale = `€ ${subtotale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`;
    
    if (summaryLines.length >= 2) {
        summaryLines[0].innerText = stringaSubtotale;
        summaryLines[1].innerText = subtotale > 0 ? "Gratuita" : "€ 0,00";
    }
    if (totalLine) {
        totalLine.innerText = stringaSubtotale;
    }
}

function procediCheckout() {
    const carrello = ottieniCarrello();
    if (carrello.length === 0) {
        alert("Il tuo carrello è vuoto!");
        return;
    }
    alert("Reindirizzamento al gateway di pagamento sicuro (Stripe/PayPal)...\n\n[Grazie per aver testato la demo! Il carrello verrà ora svuotato.]");
    localStorage.removeItem('techstore_cart');
    window.location.href = 'index.html';
}

// --- FILTRO PREZZO DINAMICO (PAGINA CATALOGO) ---

function filtraProdottiPerPrezzo(prezzoMassimo) {
    const schedeProdotto = document.querySelectorAll('.product-grid .product-card');
    
    schedeProdotto.forEach(card => {
        const testoPrezzo = card.querySelector('.price').innerText;
        // Converte il prezzo visivo in numero per il confronto logico
        const prezzo = parseFloat(testoPrezzo.replace('€', '').replace(/\./g, '').replace(',', '.').trim());
        
        if (prezzo <= prezzoMassimo) {
            card.style.display = 'block'; // Mostra il prodotto
        } else {
            card.style.display = 'none';  // Nascondi il prodotto
        }
    });
}
