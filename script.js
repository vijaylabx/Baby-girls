document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Logic ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.overlay');
  const closeMenuBtn = document.querySelector('.close-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  function openMenu() {
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
  }

  function closeMenu() {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  // --- Carousel Logic ---
  // Clone carousel items to create an infinite scroll effect
  const carousels = document.querySelectorAll('.carousel-track');
  carousels.forEach(track => {
    const items = Array.from(track.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  });


  // --- Buy Now Logic (using event delegation for clones) ---
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-buy')) {
      e.preventDefault();
      const card = e.target.closest('.product-card');
      if (card) {
        const productName = card.querySelector('.product-name').textContent.trim();
        const priceNode = card.querySelector('p');
        let productPrice = "";
        if (priceNode) {
          const tempP = priceNode.cloneNode(true);
          const delNode = tempP.querySelector('del');
          if (delNode) tempP.removeChild(delNode);
          productPrice = tempP.textContent.trim();
        }
        // Redirect with both product and price
        window.location.href = `order.html?product=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}`;
      }
    }
  });

  // --- Order Form Auto-fill Logic ---
  const urlParams = new URLSearchParams(window.location.search);
  const productParam = urlParams.get('product');
  const priceParam = urlParams.get('price');
  
  if (productParam) {
    const productInput = document.getElementById('productName');
    if (productInput) {
      // Show "Product Name - $Price"
      productInput.value = priceParam ? `${productParam} - ${priceParam}` : productParam;
    }
  }

  // --- Order Form Submit Logic ---
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Order Placed Successfully! Thank you for shopping with us.');
      orderForm.reset();
      window.location.href = 'index.html';
    });
  }

  // --- Contact Form Submit Logic ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Message Sent Successfully! We will get back to you soon.');
      contactForm.reset();
    });
  }
});

// --- Filter Products Logic ---
function filterProduct(category) {
  const products = document.querySelectorAll('.products .product-card');
  products.forEach(product => {
    if (category === 'all') {
      product.style.display = 'block';
    } else {
      if (product.classList.contains(category)) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    }
  });
}
