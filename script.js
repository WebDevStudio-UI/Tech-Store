// =================================================================
// TECHSTORE - DATABASE, CARRELLO, WISHLIST E RECENSIONI DINAMICHE
// =================================================================

const prodottiDB = {
    'smartphone': { id: 'smartphone', nome: 'Phone Pro Max 256GB', categoria: 'Smartphone', prezzo: '€ 1.199,00', descrizione: 'Il display più luminoso di sempre. Fotocamera da 48MP per scatti mozzafiato anche di notte e un chip che ridefinisce le prestazioni degli smartphone.', immagine: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop', stelle: 5, recensioni: '(340)' },
    'laptop': { id: 'laptop', nome: 'UltraBook 15" M2 - 512GB SSD', categoria: 'Computer', prezzo: '€ 1.450,00', descrizione: 'Il portatile perfetto per i professionisti. Sottile, leggero e con una batteria che dura tutto il giorno. Display Retina ad altissima risoluzione e nuovo processore ultra-veloce.', immagine: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop', stelle: 5, recensioni: '(128)' },
    'cuffie': { id: 'cuffie', nome: 'Cuffie Noise Cancelling', categoria: 'Audio', prezzo: '€ 249,99', descrizione: 'Isolati dal mondo esterno grazie alla cancellazione attiva del rumore di livello professionale. Fino a 40 ore di autonomia e ricarica rapida via USB-C.', immagine: 'https://images.unsplash.com/photo-1612444530582-fc66184b156b?q=80&w=1000&auto=format&fit=crop', stelle: 4, recensioni: '(85)' },
    'watch': { id: 'watch', nome: 'Watch Series 8', categoria: 'Smartwatch', prezzo: '€ 499,00', descrizione: 'Il tuo compagno ideale per la salute e lo sport. Monitoraggio avanzato del somno, sensore di temperatura e notifiche intelligenti sempre al tuo polso.', immagine: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop', stelle: 4, recensioni: '(92)' },
    'pc-gaming': { id: 'pc-gaming', nome: 'PC Desktop Gaming X', categoria: 'Computer', prezzo: '€ 1.850,00', descrizione: 'Prestazioni senza compromessi per i gamer più esigenti. Dotato di scheda grafica di ultima generazione, raffreddamento a liquido e illuminazione RGB completamente personalizzabile.', immagine: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=1000&auto=format&fit=crop', stelle: 5, recensioni: '(47)' },
    'tablet': { id: 'tablet', nome: 'Pad Air 10.9"', categoria: 'Tablet', prezzo: '€ 699,00', descrizione: 'Incredibilmente sottile, straordinariamente potente. Perfetto per lo studio, il disegno professionale con penna digitale e l\'intrattenimento multimediale in alta definizione.', immagine: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1000&auto=format&fit=crop', stelle: 4, recensioni: '(114)' }
};

document.addEventListener('DOMContentLoaded', function() {
    // Sincronizzazione Badge globali
    aggiornaBadgeCarrello();
    aggiornaBadgeWishlist();

    // Filtro Prezzo (Catalogo)
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            document.getElementById('priceValue').innerText = "Fino a €" + this.value;
            filtraProdotti();
        });
    }

    // Router delle Pagine Dinamiche
    const path = window.location.pathname;
    if (path.includes('carrello.html')) renderizzaCarrello();
    if (path.includes('preferiti.html')) renderizzaWishlist();
    if (path.includes('prodotto.html')) caricaDettagliProdotto();
});

// --- LOGICA REQUISITO 1: WISHLIST (LISTA DEI DESIDERI) ---
function ottieniWishlist() {
    return localStorage.getItem('techstore_wishlist') ? JSON.parse(localStorage.getItem('techstore_wishlist')) : [];
}

function salvaWishlist(wishlist) {
    localStorage.setItem('techstore_wishlist', JSON.stringify(wishlist));
    aggiornaBadgeWishlist();
}

function aggiornaBadgeWishlist() {
    const badge = document.getElementById('wishlist-badge');
    if (badge) badge.innerText = ottieniWishlist().length;
}

window.aggiungiAiPreferiti = function(prodId) {
    let wishlist = ottieniWishlist();
    if (wishlist.includes(prodId)) {
        alert("Questo prodotto è già nei tuoi preferiti!");
        return;
    }
    wishlist.push(prodId);
    salvaWishlist(wishlist);
    alert(`"${prodidToName(prodId)}" aggiunto alla Lista dei Desideri! ❤️`);
};

window.rimuoviDaiPreferiti = function(prodId) {
    let wishlist = ottieniWishlist();
    wishlist = wishlist.filter(id => id !== prodId);
    salvaWishlist(wishlist);
    renderizzaWishlist();
};

function renderizzaWishlist() {
    const grid = document.getElementById('wishlist-grid');
    if (!grid) return;
    
    const wishlist = ottieniWishlist();
    if (wishlist.length === 0) {
        grid.parentNode.innerHTML = `
            <div class="empty-wishlist">
                <i class="far fa-heart"></i>
                <h2>La tua lista è vuota</h2>
                <p>Sfoglia il catalogo e clicca sul cuore per salvare i tuoi prodotti ideali.</p>
                <a href="catalogo.html" class="btn-primary" style="display:inline-block; margin-top:1.5rem; padding: 0.7rem 2rem;">Vai al Catalogo</a>
            </div>`;
        return;
    }

    grid.innerHTML = '';
    wishlist.forEach(id => {
        const prod = prodottiDB[id];
        if (!prod) return;
        grid.innerHTML += `
            <div class="product-card">
                <img src="${prod.immagine}" alt="${prod.nome}">
                <div class="product-info">
                    <span class="category-tag">${prod.categoria}</span>
                    <h3>${prod.nome}</h3>
                    <p class="price">${prod.prezzo}</p>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <a href="prodotto.html?id=${prod.id}" class="btn-secondary" style="flex:1; text-align:center;">Dettagli</a>
                        <button class="btn-remove" onclick="rimuoviDaiPreferiti('${prod.id}')" style="border:1px solid #dee2e6; padding:0 10px; border-radius:5px;"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>`;
    });
}

function prodidToName(id) { return prodottiDB[id]?.nome || id; }


// --- LOGICA REQUISITO 2: RECENSIONI DINAMICHE ---
function ottieniRecensioni(prodId) {
    return localStorage.getItem(`techstore_reviews_${prodId}`) ? JSON.parse(localStorage.getItem(`techstore_reviews_${prodId}`)) : [];
}

function renderingRecensioni(prodId) {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    const reviews = ottieniRecensioni(prodId);
    if (reviews.length === 0) {
        container.innerHTML = '<p style="color:#777; font-style:italic;">Nessuna recensione scritta per questo articolo. Sii il primo!</p>';
        return;
    }

    container.innerHTML = '';
    reviews.forEach(rev => {
        let stelle = '⭐'.repeat(rev.stelle);
        container.innerHTML += `
            <div class="review-card">
                <div class="review-header">
                    <strong>${rev.autore}</strong>
                    <span class="review-stars">${stelle}</span>
                </div>
                <p style="color:#555; font-size:0.95rem;">${rev.testo}</p>
                <small style="color:#999; display:block; margin-top:5px;">Inviata il: ${rev.data}</small>
            </div>`;
    });
}

window.aggiungiRecensioneDinamica = function(event) {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('id');
    
    const autore = document.getElementById('rev-author').value;
    const stelle = parseInt(document.getElementById('rev-stars').value);
    const testo = document.getElementById('rev-text').value;
    const data = new Date().toLocaleDateString('it-IT');

    let recensioni = ottieniRecensioni(prodId);
    recensioni.unshift({ autore, stelle, testo, data }); // Inserisce in cima
    
    localStorage.setItem(`techstore_reviews_${prodId}`, JSON.stringify(recensioni));
    
    // Reset del form e re-render
    document.getElementById('formRecensione').reset();
    renderingRecensioni(prodId);
    alert("Recensione pubblicata sul browser!");
};


// --- VECCHIE LOGICHE CATALOGO & CARRELLO (CONSOLIDATE) ---
function caricaDettagliProdotto() {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('id');
    const prodotto = prodottiDB[prodId];

    if (!prodotto) {
        document.querySelector('.single-product-container').innerHTML = `<div style="padding:50px; text-align:center; width:100%;"><h2>Articolo non trovato</h2><a href="catalogo.html" class="btn-primary">Torna al Catalogo</a></div>`;
        return;
    }

    document.title = `${prodotto.nome} | TechStore`;
    document.querySelector('.product-gallery .main-img').src = prodotto.immagine;
    document.querySelector('.product-details .category-tag').innerText = prodotto.categoria;
    document.querySelector('.product-details h1').innerText = prodotto.nome;
    document.querySelector('.product-details .huge-price').innerText = prodotto.prezzo;
    document.querySelector('.product-details .description').innerText = prodotto.descrizione;

    let stelleHTML = '<i>⭐</i>'.repeat(prodotto.stelle);
    document.querySelector('.product-details .rating').innerHTML = stelleHTML + " " + prodotto.recensioni;
    
    document.querySelector('.add-to-cart-large').setAttribute('onclick', `aggiungiProdottoDiretto('${prodId}')`);
    document.getElementById('main-wishlist-btn').setAttribute('onclick', `aggiungiAiPreferiti('${prodId}')`);

    // Carica le recensioni associate
    renderingRecensioni(prodId);
}

function filtraProdotti() {
    const prezzoMassimo = parseFloat(document.getElementById('priceRange')?.value || 3000);
    const checkboxes = document.querySelectorAll('.sidebar-filters input[type="checkbox"]:checked');
    const categorieSelezionate = Array.from(checkboxes).map(cb => cb.parentElement.innerText.trim().toLowerCase());
    const schedeProdotto = document.querySelectorAll('.product-grid .product-card');
    
    schedeProdotto.forEach(card => {
        const prezzo = parseFloat(card.querySelector('.price').innerText.replace('€', '').replace(/\./g, '').replace(',', '.').trim());
        const categoria = card.querySelector('.category-tag').innerText.trim().toLowerCase();
        const matchesPrezzo = prezzo <= prezzoMassimo;
        const matchesCategoria = categorieSelezionate.length === 0 || categorieSelezionate.some(sel => sel.includes(categoria) || categoria.includes(sel));
        
        card.style.display = (matchesPrezzo && matchesCategoria) ? 'block' : 'none';
    });
}

function ottieniCarrello() { return localStorage.getItem('techstore_cart') ? JSON.parse(localStorage.getItem('techstore_cart')) : []; }
function salvaCarrello(carrello) { localStorage.setItem('techstore_cart', JSON.stringify(carrello)); aggiornaBadgeCarrello(); }
function aggiornaBadgeCarrello() { const badge = document.getElementById('cart-badge'); if (badge) badge.innerText = ottieniCarrello().reduce((tot, item) => tot + item.quantita, 0); }

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
    if (index > -1) carrello[index].quantita += 1;
    else carrello.push({ nome, prezzo, immagine, quantita: 1 });

    salvaCarrello(carrello);
    alert(`"${nome}" aggiunto al carrello!`);
}

window.aggiungiProdottoDiretto = function(prodId) {
    const prodotto = prodottiDB[prodId];
    if (!prodotto) return;
    const qtyInput = document.querySelector('.qty-input');
    const quantita = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    const prezzo = parseFloat(prodotto.prezzo.replace('€', '').replace(/\./g, '').replace(',', '.').trim());

    let carrello = ottieniCarrello();
    const index = carrello.findIndex(item => item.nome === prodotto.nome);
    if (index > -1) carrello[index].quantita += quantita;
    else carrello.push({ nome: prodotto.nome, prezzo, immagine: prodotto.immagine, quantita });

    salvaCarrello(carrello);
    alert(`Aggiunto al carrello: x${quantita} "${prodotto.nome}"`);
};

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
                <div class="item-details"><h3>${item.nome}</h3></div>
                <div class="item-qty"><input type="number" value="${item.quantita}" min="1" onchange="cambiaQty(${index}, this.value)"></div>
                <div class="item-price">€ ${totaleRiga.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</div>
                <button class="btn-remove" onclick="rimuoviElemento(${index})"><i class="fas fa-trash"></i></button>
            </div>`;
    });
    aggiornaPrezziRiepilogo(subtotale);
}

window.cambiaQty = function(index, qty) {
    let carrello = ottieniCarrello();
    const nuovaQty = parseInt(qty);
    if (nuovaQty > 0) { carrello[index].quantita = nuovaQty; salvaCarrello(carrello); renderizzaCarrello(); }
};

window.rimuoviElemento = function(index) {
    let carrello = ottieniCarrello();
    carrello.splice(index, 1);
    salvaCarrello(carrello);
    renderizzaCarrello();
};

function aggiornaPrezziRiepilogo(subtotale) {
    const summaryLines = document.querySelectorAll('.summary-line span:last-child');
    const totalLine = document.querySelector('.summary-line.total span:last-child');
    const strSubtotale = `€ ${subtotale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`;
    if (summaryLines.length >= 2) { summaryLines[0].innerText = strSubtotale; summaryLines[1].innerText = subtotale > 0 ? "Gratuita" : "€ 0,00"; }
    if (totalLine) totalLine.innerText = strSubtotale;
}

window.procediCheckout = function() {
    if (ottieniCarrello().length === 0) { alert("Il carrello è vuoto!"); return; }
    alert("Reindirizzamento al gateway sicuro...\n\nGrazie per aver testato la demo!");
    localStorage.removeItem('techstore_cart');
    window.location.href = 'index.html';
};
