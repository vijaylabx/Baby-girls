document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Logic ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.overlay');
  const closeMenuBtn = document.querySelector('.close-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  // --- Track Order Page Logic ---
  if (window.location.pathname.includes('track.html')) {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const email = params.get('email');
    const product = params.get('product');
    const quantity = params.get('qty');
    const payment = params.get('pay');
    const address = params.get('addr');
    const txid = params.get('txid');
    const img = params.get('img');

    if (name) document.getElementById('trackCustomerName').textContent = name;
    if (email) document.getElementById('trackEmail').textContent = email;
    if (product) document.getElementById('trackProductName').textContent = product;
    if (quantity) document.getElementById('trackQuantity').textContent = quantity;
    if (payment) document.getElementById('trackPaymentMethod').textContent = payment;
    if (address) document.getElementById('trackAddress').textContent = address;
    if (img) document.getElementById('trackProductImg').src = img;
    
    if (txid && txid !== 'undefined' && txid !== '') {
      document.getElementById('trackTXIDContainer').style.display = 'block';
      document.getElementById('trackTXID').textContent = txid;
    }
  }

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
        const productImg = card.querySelector('.product-img').src;
        const priceNode = card.querySelector('p');
        let productPrice = "";
        if (priceNode) {
          const tempP = priceNode.cloneNode(true);
          const delNode = tempP.querySelector('del');
          if (delNode) tempP.removeChild(delNode);
          productPrice = tempP.textContent.trim();
        }
        // Redirect with product, price, and image
        window.location.href = `order.html?product=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}&image=${encodeURIComponent(productImg)}`;
      }
    }
  });

  // --- Order Form Auto-fill Logic ---
  const urlParams = new URLSearchParams(window.location.search);
  const productParam = urlParams.get('product');
  const priceParam = urlParams.get('price');
  const imageParam = urlParams.get('image');

  if (productParam) {
    const productInput = document.getElementById('productName');
    if (productInput) {
      // Show "Product Name - $Price"
      productInput.value = priceParam ? `${productParam} - ${priceParam}` : productParam;
    }
  }

  // Display Product Image on Order Page
  if (imageParam) {
    const previewDiv = document.getElementById('productPreview');
    const imgElement = document.getElementById('selectedProductImg');
    if (previewDiv && imgElement) {
      imgElement.src = imageParam;
      previewDiv.style.display = 'block';
    }
  }

  // Display Payment QR Code and Address based on selection
  const paymentSelect = document.getElementById('paymentMethod');
  const paymentContainer = document.getElementById('paymentImageContainer');
  const paymentImg = document.getElementById('paymentQR');
  const paymentAddress = document.getElementById('paymentAddressNote');
  const cryptoProofFields = document.getElementById('cryptoProofFields');

  if (paymentSelect && paymentContainer && paymentImg && paymentAddress && cryptoProofFields) {
    paymentSelect.addEventListener('change', () => {
      const selection = paymentSelect.value;
      if (selection === 'bitcoin') {
        paymentImg.src = 'payment/BTC.jpeg';
        paymentAddress.textContent = 'Address: bc1pu7xhgjvskzc8vt94e83djledla9hnkgmalm0s943r8q86j993uwsldgy0z';
        paymentContainer.style.display = 'block';
        cryptoProofFields.style.display = 'block';
      } else if (selection === 'usdt_trc20') {
        paymentImg.src = 'payment/Trc20.jpeg';
        paymentAddress.textContent = 'Address: TLMz1tHMkfmBT1SAmb88DUiXN4UkhnLfQT';
        paymentContainer.style.display = 'block';
        cryptoProofFields.style.display = 'block';
      } else if (selection === 'usdt_erc20') {
        paymentImg.src = 'payment/ERC20.jpeg';
        paymentAddress.textContent = 'Address: 0xF3E3396237ff66594Cc0A005120a27A58B7821fa';
        paymentContainer.style.display = 'block';
        cryptoProofFields.style.display = 'block';
      } else {
        paymentContainer.style.display = 'none';
        cryptoProofFields.style.display = 'none';
      }
    });
  }

  // --- Order Form Submit Logic ---
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName').value;
      const mobile = document.getElementById('mobileNumber').value;
      const email = document.getElementById('email').value;
      const address = document.getElementById('address').value;
      const product = document.getElementById('productName').value;
      const quantity = document.getElementById('quantity').value;
      const payment = document.getElementById('paymentMethod').options[document.getElementById('paymentMethod').selectedIndex].text;
      const txid = document.getElementById('transactionId') ? document.getElementById('transactionId').value : '';
      
      // Get the product image from the URL params (since it was passed to this page)
      const currentParams = new URLSearchParams(window.location.search);
      const productImg = currentParams.get('image') || '';

      // Build the tracking URL
      const trackUrl = `track.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&product=${encodeURIComponent(product)}&qty=${encodeURIComponent(quantity)}&pay=${encodeURIComponent(payment)}&addr=${encodeURIComponent(address)}&txid=${encodeURIComponent(txid)}&img=${encodeURIComponent(productImg)}`;

      alert(`Order Confirmed!\n\nThank you, ${name}! Redirecting to your tracking page...`);
      
      orderForm.reset();
      window.location.href = trackUrl;
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
