// =============================================
// GESTIONE CARRELLO
// =============================================
let cartCount = 0;

function aggiungiAlCarrello() {
    cartCount++;
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.innerText = cartCount;
        badge.style.transform = "scale(1.5)";
        setTimeout(() => { badge.style.transform = "scale(1)"; }, 200);
    }
    alert("Prodotto aggiunto al carrello con successo!");
}

function procediCheckout() {
    alert("Reindirizzamento al gateway di pagamento sicuro (Stripe/PayPal)...\n\n[Nota: Essendo una demo per il portfolio, il processo termina qui.]");
}

// =============================================
// FILTRI CATALOGO
// =============================================
document.addEventListener('DOMContentLoaded', function () {

    // --- Slider prezzo ---
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function () {
            priceValue.innerText = "Fino a €" + Number(this.value).toLocaleString('it-IT');
            applicaFiltri();
        });
    }

    // --- Checkbox categorie ---
    const checkboxes = document.querySelectorAll('.filter-cat');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', applicaFiltri);
    });

    // --- Ordinamento ---
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', applicaFiltri);
    }

    // --- Reset ---
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            checkboxes.forEach(cb => cb.checked = false);
            if (priceRange) {
                priceRange.value = 3000;
                priceValue.innerText = "Fino a €3.000";
            }
            if (sortSelect) sortSelect.value = 'default';
            applicaFiltri();
        });
    }

    // --- Funzione principale filtri ---
    function applicaFiltri() {
        const grid = document.getElementById('productGrid');
        const noResults = document.getElementById('noResults');
        if (!grid) return;

        // Categorie selezionate
        const selezionate = Array.from(document.querySelectorAll('.filter-cat:checked')).map(cb => cb.value);

        // Prezzo massimo
        const maxPrezzo = priceRange ? parseInt(priceRange.value) : 9999;

        // Ordinamento
        const sort = sortSelect ? sortSelect.value : 'default';

        // Recupera tutte le card
        const cards = Array.from(grid.querySelectorAll('.product-card'));

        // Filtra: mostra/nascondi
        let visibili = 0;
        cards.forEach(card => {
            const categoria = card.getAttribute('data-category');
            const prezzo = parseInt(card.getAttribute('data-price'));

            const passaCategoria = selezionate.length === 0 || selezionate.includes(categoria);
            const passaPrezzo = prezzo <= maxPrezzo;

            if (passaCategoria && passaPrezzo) {
                card.style.display = '';
                visibili++;
            } else {
                card.style.display = 'none';
            }
        });

        // Messaggio nessun risultato
        if (noResults) {
            noResults.style.display = visibili === 0 ? 'block' : 'none';
        }

        // Ordinamento (riordina solo le card visibili)
        if (sort !== 'default') {
            const cardsVisibili = cards.filter(c => c.style.display !== 'none');
            cardsVisibili.sort((a, b) => {
                const pA = parseInt(a.getAttribute('data-price'));
                const pB = parseInt(b.getAttribute('data-price'));
                return sort === 'asc' ? pA - pB : pB - pA;
            });
            cardsVisibili.forEach(card => grid.appendChild(card));
        }
    }
});
