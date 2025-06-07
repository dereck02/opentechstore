const productList = document.getElementById("product-list");
const cartButton = document.getElementById("cart-button");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const form = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalPrice = document.getElementById("modal-price");
const modalAddCart = document.getElementById("modal-add-cart");
const closeModal = document.getElementById("close-modal");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const checkoutBtn = document.getElementById("checkout-btn");

let selectedProduct = null;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let allProducts = [];

function updateCartCount() {
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.title} x${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
      <button class="remove-btn" data-index="${index}">&times;</button>
    `;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });

  const totalEl = document.createElement("li");
  totalEl.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
  cartItems.appendChild(totalEl);

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      saveCart();
      renderCart();
    });
  });
}

function addToCart(product) {
  const found = cart.find((item) => item.id === product.id);
  if (found) {
    found.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  alert(`${product.title} agregado al carrito`);
}

async function fetchProducts() {
  const res = await fetch(
    "https://fakestoreapi.com/products/category/electronics"
  );
  const electronics = await res.json();

  const extras = [
    {
      id: 201,
      title: "Monitor Curvo 32'' Samsung",
      description:
        "Monitor panorámico con resolución 2K, ideal para productividad.",
      price: 379.99,
      image: "img/monitorsamsun32.png",
      category: "monitor",
    },
    {
      id: 205,
      title: "Monitor LG UltraWide 29",
      description:
        "Monitor panorámico con resolución 2K, ideal para productividad.",
      price: 229.99,
      image: "img/Monitor LG UltraWide 29.jpeg",
      category: "monitor",
    },
    {
      id: 202,
      title: "GPU AMD Radeon RX 6800",
      description: "GPU tope de gama para máximo rendimiento.",
      price: 599.99,
      image: "img/GPU AMD Radeon RX 6800.jpg",
      category: "gpu",
    },
    {
      id: 203,
      title: "Placa de Video RTX 4080",
      description: "GPU tope de gama para máximo rendimiento.",
      price: 1499.0,
      image: "img/Placa de Video RTX 4080.png",
      category: "gpu",
    },
    {
      id: 204,
      title: "Notebook Dell Inspiron",
      description: "Notebook con Intel i7 y 16GB RAM para tareas exigentes.",
      price: 999.0,
      image: "img/Notebook Dell Inspiron.jpg",
      category: "laptop",
    },
    {
      id: 206,
      title: "SSD Crucial MX500 500GB",
      description: "GPU tope de gama para máximo rendimiento.",
      price: 99.0,
      image: "img/SSD Crucial MX500 500GB.png",
      category: "disco",
    },
  ];

  allProducts = [
    ...electronics.map((p) => ({ ...p, category: "general" })),
    ...extras,
  ];

  const extraProducts = [];
  allProducts.push(...extraProducts);

  renderProducts(allProducts);
}

function renderProducts(products) {
  productList.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-img" />
      <h3 class="product-name">${product.title}</h3>
    `;
    card.addEventListener("click", () => showModal(product));
    productList.appendChild(card);
  });
}

function showModal(product) {
  selectedProduct = product;
  modalImg.src = product.image;
  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  modalPrice.textContent = "$" + product.price.toFixed(2);
  modal.classList.add("show");
  modal.classList.remove("hidden");
}

function closeModalFunc() {
  modal.classList.remove("show");
  setTimeout(() => modal.classList.add("hidden"), 300);
}

cartButton.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
  cartModal.classList.add("show-cart");
  renderCart();
});

document.addEventListener("click", (e) => {
  if (e.target.id === "close-cart") {
    cartModal.classList.remove("show-cart");
    setTimeout(() => cartModal.classList.add("hidden"), 300);
  }
});

modalAddCart.addEventListener("click", () => {
  if (selectedProduct) {
    addToCart(selectedProduct);
    closeModalFunc();
  }
});

closeModal.addEventListener("click", closeModalFunc);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formMessage.textContent = "Mensaje enviado correctamente. ¡Gracias!";
  form.reset();
});

document.getElementById("browse-products-btn").addEventListener("click", () => {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

checkoutBtn.addEventListener("click", () => {
  alert("¡Gracias por tu compra!");
  cart = [];
  saveCart();
  renderCart();
  cartModal.classList.remove("show-cart");
  setTimeout(() => cartModal.classList.add("hidden"), 300);
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.dataset.category;
    if (category === "all") {
      const extraProducts = [
        {
          ...allProducts.find((p) => p.category === "laptop"),
          id: 304,
          title: "Notebook HP Pavilion 15",
          category: "laptop",
          price: 799.0,
        },
      ];
      allProducts.push(...extraProducts);

      renderProducts(allProducts);
    } else {
      renderProducts(allProducts.filter((p) => p.category === category));
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  updateCartCount();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
});
