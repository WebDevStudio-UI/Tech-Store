// Gestione del Carrello
let cartCount = 0;

function aggiungiAlCarrello() {
    cartCount++;
    const badge = document.getElementById('cart-badge');
    if(badge) {
        badge.innerText = cartCount;
        badge.style.transform = "scale(1.5)";
        setTimeout(() => { badge.style.transform = "scale(1)"; }, 200);
    }
    alert("Prodotto aggiunto al carrello con successo!");
}

function procediCheckout() {
    alert("Reindirizzamento al gateway di pagamento sicuro (Stripe/PayPal)... \n\n[Nota: Essendo una demo per il portfolio, il processo termina qui.]");
}

// Gestione dinamica del filtro prezzo nella pagina Catalogo
document.addEventListener('DOMContentLoaded', function() {
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            priceValue.innerText = "Fino a €" + this.value;
        });
    }
});