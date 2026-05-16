// ==========================================================
// TECHSTORE - DATABASE PRODOTTI E LOGICA EVOLUTA (CORRETTO)
// ==========================================================

const prodottiDB = {
    'smartphone': {
        nome: 'Phone Pro Max 256GB',
        categoria: 'Smartphone',
        prezzo: '€ 1.199,00',
        descrizione: 'Il display più luminoso di sempre. Fotocamera da 48MP per scatti mozzafiato anche di notte e un chip che ridefinisce le prestazioni degli smartphone.',
        immagine: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop',
        recensioni: '(340 recensioni)',
        stelle: 5
    },
    'laptop': {
        nome: 'UltraBook 15" M2 - 512GB SSD',
        categoria: 'Computer',
        prezzo: '€ 1.450,00',
        descrizione: 'Il portatile perfetto per i professionisti. Sottile, leggero e con una batteria che dura tutto il giorno. Display Retina ad altissima risoluzione e nuovo processore ultra-veloce.',
        immagine: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop',
        recensioni: '(128 recensioni)',
        stelle: 5
    },
    'cuffie': {
        nome: 'Cuffie Noise Cancelling',
        categoria: 'Audio',
        prezzo: '€ 249,99',
        descrizione: 'Isolati dal mondo esterno grazie alla cancellazione attiva del rumore di livello professionale. Fino a 40 ore di autonomia e ricarica rapida via USB-C.',
        immagine: 'https://images.unsplash.com/photo-1612444530582-fc66184b156b?q=80&w=1000&auto=format&fit=crop',
        recensioni: '(85 recensioni)',
        stelle: 4
    },
    'watch': {
        nome: 'Watch Series 8',
        categoria: 'Smartwatch',
        prezzo: '€ 499,00',
        descrizione: 'Il tuo compagno ideale per la salute e lo sport. Monitoraggio avanzato del sonno, sensore di temperatura e notifiche intelligenti sempre al tuo polso.',
        immagine: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop',
        recensioni: '(92 recensioni)',
        stelle: 4
    },
    'pc-gaming': {
        nome: 'PC Desktop Gaming X',
        categoria: 'Computer',
        prezzo: '€ 1.850,00',
        descrizione: 'Prestazioni senza compromessi per i gamer più esigenti. Dotato di scheda grafica di ultima generazione, raffreddamento a liquido e illuminazione RGB completamente personalizzabile.',
        immagine: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=1000&auto=format&fit=crop',
        recensioni: '(47 recensioni)',
        stelle: 5
    },
    'tablet': {
        nome: 'Pad Air 10.9"',
        categoria: 'Tablet',
        prezzo: '€ 699,00',
        descrizione: 'Incredibilmente sottile, straordinariamente potente. Perfetto per lo studio, il disegno professionale con penna digitale e l\'intrattenimento multimediale in alta definizione.',
        immagine: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1000&auto=format&fit=crop',
        recensioni: '(114 recensioni)',
        stelle: 4
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Sincronizza lo stato visivo del carrello in tutte le pagine
    aggiornaBadgeCarrello();

    // Gestione input Range Prezzo (Catalogo)
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            priceValue.innerText = "Fino a €" + this.value;
            filtraProdotti();
        });
    }

    // Rendering dinamico se siamo nella pagina del carrello
    if (window.location.pathname.includes('carrello.html')) {
        renderizzaCarrello();
    }

    // Generazione dinamica della pagina prodotto
    if (window.location.pathname.includes('prodotto.html')) {
        caricaDettagliProdotto();
    }
});

// --- APPLICAZIONE FILTRI COMBINATI ---
function filtraProdotti() {
    const prezzoMassimo = parseFloat(document.getElementById('priceRange')?.value || 3000);
    const checkboxes = document.querySelectorAll('.sidebar-filters input[type="checkbox"]:checked');
    const categorieSelezionate = Array.from(checkboxes).map(cb => cb.parentElement.innerText.trim().toLowerCase());

    const schedeProdotto = document.querySelectorAll('.product-grid .product-card');
    
    schedeProdotto.forEach(card => {
        const testoPrezzo = card.querySelector('.price').innerText;
        const prezzo = parseFloat(testoPrezzo.replace('€', '').replace(/\./g, '').replace(',', '.').trim());
        const categoria = card.querySelector('.category-tag').innerText.trim().toLowerCase();
        
        const matchesPrezzo = prezzo <= prezzoMassimo;
        const matchesCategoria = categorieSelezionate.length === 0 || 
            categorieSelezionate.some(sel => sel.includes(categoria) || categoria.includes(sel));
        
        if (matchesPrezzo && matchesCategoria) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- POPOLAMENTO DINAMICO PAGINA DETTAGLIO ---
function caricaDettagliProdotto() {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('id');
    const prodotto = prodottiDB[prodId];

    if (!prodotto) {
        document.querySelector('.single-product-container').innerHTML = `
            <div style="padding: 50px; text-align: center; width: 100%;">
                <h2>Prodotto non trovato</h2>
                <p>L'articolo richiesto non esiste o è stato rimosso.</p>
                <a href="catalogo.html" class="btn-primary" style="display:inline-block; margin-top:20px;">Torna al Catalogo</a>
            </div>`;
        return;
    }

    document.title = `${prodotto.nome} | TechStore`;
    
    // FISSAZIONE DEL BUG: cambiato "producto" con "prodotto"
    document.querySelector('.product-gallery .main-img').src = prodotto.immagine;
    document.querySelector('.product-gallery .main-img').alt = prodotto.nome;
    document.querySelector('.product-details .category-tag').innerText = prodotto.categoria;
    document.querySelector('.product-details h1').innerText = prodotto.nome;
    document.querySelector('.product-details .huge-price').innerText = prodotto.prezzo;
    document.querySelector('.product-details .description').innerText = prodotto.descrizione;

    // Generazione dinamica icone stelle recensioni
    let stelleHTML = '';
    for (let i = 1; i <= 5; i++) {
        stelleHTML += i <= prodotto.stelle ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    document.querySelector('.product-details .rating').innerHTML = stelleHTML + " " + prodotto.recensioni;
    
    // Aggancio evento al pulsante d'acquisto passandogli la chiave id
    const cartBtn = document.querySelector('.add-to-cart-large');
    if (cartBtn) {
        cartBtn.setAttribute('onclick', `aggiungiProdottoDiretto('${prodId}')`);
    }
}

// --- SISTEMA DI PERSISTENZA CARRELLO (LocalStorage) ---
function ottieniCarrello() {
    const carrello = localStorage.getItem('techstore_cart');
    return carrello ? JSON.parse(carrello) : [];
}

function salvaCarrello(carrello) {
    localStorage.setItem('techstore_cart', JSON.stringify(carrello));
    aggiornaBadgeCarrello();
}

function aggiornaBadgeCarrello() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const carrello = ottieniCarrello();
        badge.innerText = carrello.reduce((tot, item) => tot + item.quantita, 0);
    }
}

// Aggiunta standard da griglia Home / Catalogo
function aggiungiAlCarrello() {
    const evento = window.event;
    if (!evento) return;
    const card = evento.target.closest('.product-card');
    if (!card) return;

    const nome = card.querySelector('h3').innerText;
    const prezzoTesto = card.querySelector('.price').innerText;
    const immagine = card.querySelector('img').src;
    const prezzo = parseFloat(prezzoTesto.replace('€', '').replace(/\./g, '').replace(',', '.').trim());

    let carrello = ottieniCarrello();
    const index = carrello.findIndex(item => item.nome === nome);

    if (index > -1) {
        carrello[index].quantita += 1;
    } else {
        carrello.push({ nome, prezzo, immagine, quantita: 1 });
    }

    salvaCarrello(carrello);
    alert(`"${nome}" aggiunto al carrello con successo!`);
}

// Aggiunta quantitativa dettagliata dalla pagina prodotto singolo
window.aggiungiProdottoDiretto = function(prodId) {
    const prodotto = prodottiDB[prodId];
    if (!prodotto) return;

    const qtyInput = document.querySelector('.qty-input');
    const quantita = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    const prezzo = parseFloat(prodotto.prezzo.replace('€', '').replace(/\./g, '').replace(',', '.').trim());

    let carrello = ottieniCarrello();
    const index = carrello.findIndex(item => item.nome === prodotto.nome);

    if (index > -1) {
        carrello[index].quantita += quantita;
    } else {
        carrello.push({ nome: prodotto.nome, prezzo: prezzo, immagine: prodotto.immagine, quantita: quantita });
    }

    salvaCarrello(carrello);
    alert(`Aggiunto al carrello: x${quantita} "${prodotto.nome}"`);
};

// --- GESTIONE SCHERMATA CARRELLO.HTML ---
function renderizzaCarrello() {
    const container = document.querySelector('.cart-items');
    if (!container) return;

    const carrello = ottieniCarrello();
    container.innerHTML = '<h2>Il tuo Carrello</h2>';

    if (carrello.length === 0) {
        container.innerHTML += '<p style="padding: 20px 0; color: #666;">Il tuo carrello è attualmente vuoto.</p>';
        aggiornaPrezziRiepilogo(0);
        return;
    }

    let subtotale = 0;
    carrello.forEach((item, index) => {
        const totaleRiga = item.prezzo * item.quantita;
        subtotale += totaleRiga;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.immagine}" alt="${item.nome}">
                <div class="item-details">
                    <h3>${item.nome}</h3>
                </div>
                <div class="item-qty">
                    <input type="
