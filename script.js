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

document.addEventListener('DOMContentLoaded', function () {

    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function () {
            priceValue.innerText = "Fino a €" + Number(this.value).toLocaleString('it-IT');
            applicaFiltri();
        });
    }

    const checkboxes = document.querySelectorAll('.filter-cat');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', applicaFiltri);
    });

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', applicaFiltri);
    }

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

    function applicaFiltri() {
        const grid = document.getElementById('productGrid');
        const noResults = document.getElementById('noResults');
        if (!grid) return;

        const selezionate = Array.from(document.querySelectorAll('.filter-cat:checked')).map(cb => cb.value);
        const maxPrezzo = priceRange ? parseInt(priceRange.value) : 9999;
        const sort = sortSelect ? sortSelect.value : 'default';

        const cards = Array.from(grid.querySelectorAll('.product-card'));
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

        if (noResults) {
            noResults.style.display = visibili === 0 ? 'block' : 'none';
        }

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
