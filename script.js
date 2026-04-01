// Simulazione aggiunta al carrello
let cartCount = 0;

function aggiungiAlCarrello() {
    cartCount++;
    
    // Aggiorna il numerino (badge) sull'icona del carrello
    const badge = document.getElementById('cart-badge');
    if(badge) {
        badge.innerText = cartCount;
        
        // Piccolo effetto visivo
        badge.style.transform = "scale(1.5)";
        setTimeout(() => {
            badge.style.transform = "scale(1)";
        }, 200);
    }
    
    alert("Prodotto aggiunto al carrello con successo!");
}

// Simulazione Checkout
function procediCheckout() {
    alert("Reindirizzamento al gateway di pagamento sicuro (Stripe/PayPal)... \n\n[Nota: Essendo una demo, il processo termina qui.]");
}