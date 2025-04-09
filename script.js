// ==================== VARIABLES Y CONFIGURACIÓN ====================

// Array estático de frutas con datos adicionales y con imágenes actualizadas para Pera y Uva
const frutas = [
  {
    nombre: "Manzana",
    coin: "bitcoin",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
    familia: "Rosaceae",
    nutritions: { carbohydrates: 14, protein: 0.3, fat: 0.2 }
  },
  {
    nombre: "Banana",
    coin: "ethereum",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    familia: "Musaceae",
    nutritions: { carbohydrates: 23, protein: 1.1, fat: 0.3 }
  },
  {
    nombre: "Fresa",
    coin: "cardano",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/2/29/PerfectStrawberry.jpg",
    familia: "Rosaceae",
    nutritions: { carbohydrates: 8, protein: 0.7, fat: 0.3 }
  },
  {
    nombre: "Uva",
    coin: "solana",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Wine_grapes03.jpg", // imagen actualizada
    familia: "Vitaceae",
    nutritions: { carbohydrates: 18, protein: 0.7, fat: 0.2 }
  },
  {
    nombre: "Mango",
    coin: "polkadot",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/9/90/Hapus_Mango.jpg",
    familia: "Anacardiaceae",
    nutritions: { carbohydrates: 15, protein: 0.8, fat: 0.4 }
  },
  {
    nombre: "Naranja",
    coin: "litecoin",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg",
    familia: "Rutaceae",
    nutritions: { carbohydrates: 12, protein: 0.9, fat: 0.1 }
  },
  {
    nombre: "Pera",
    coin: "ripple",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/0/0b/D%27anjou_pear.jpg", // imagen actualizada
    familia: "Rosaceae",
    nutritions: { carbohydrates: 15, protein: 0.4, fat: 0.1 }
  },
  {
    nombre: "Piña",
    coin: "binancecoin",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Pineapple_and_cross_section.jpg",
    familia: "Bromeliaceae",
    nutritions: { carbohydrates: 13, protein: 0.5, fat: 0.1 }
  }
];

// Elementos del DOM
const fruitsStore = document.getElementById("fruitsStore");
const weatherInfoElem = document.getElementById("weatherInfo");
const weatherDisplayElem = document.getElementById("weatherDisplay");
const btnGetWeather = document.getElementById("btnGetWeather");
const locationSelect = document.getElementById("locationSelect");
const btnCart = document.getElementById("btnCart");
const cartCountElem = document.getElementById("cartCount");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalBody = document.getElementById("modalBody");

const cartModal = document.getElementById("cartModal");
const cartClose = document.getElementById("cartClose");
const cartItemsElem = document.getElementById("cartItems");
const btnClearCart = document.getElementById("btnClearCart");

// Información global del clima
let climaGlobal = {
  ciudad: "",
  temp: 0,
  description: ""
};

// Carrito de compras (almacenado en LocalStorage)
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ==================== FUNCIONES DE INTEGRACIÓN DE APIS ====================

// 1. Obtener clima desde wttr.in usando ciudad predefinida
function obtenerClima(ciudad) {
  const url = `https://wttr.in/${encodeURIComponent(ciudad)}?format=j1`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const current = data.current_condition[0];
      climaGlobal.ciudad = ciudad;
      climaGlobal.temp = parseInt(current.temp_C);
      climaGlobal.description = current.weatherDesc[0].value;
      // Actualizar info de clima en la cabecera
      weatherInfoElem.innerHTML = `Ubicación: ${ciudad} | Temperatura: ${climaGlobal.temp}°C | Condición: ${climaGlobal.description}`;
      
      // Actualizar mensaje dinámico según clima
      let mensaje = "El clima influye en la producción agrícola; ";
      if(climaGlobal.description.toLowerCase().includes("sunny") ||
         climaGlobal.description.toLowerCase().includes("clear") ||
         climaGlobal.description.toLowerCase().includes("sun")) {
           mensaje += "condiciones óptimas (soleado) aumentan la oferta.";
      } else if(climaGlobal.description.toLowerCase().includes("rain") ||
                climaGlobal.description.toLowerCase().includes("cloud") ||
                climaGlobal.description.toLowerCase().includes("shower")) {
           mensaje += "climas adversos la reducen.";
      } else {
           mensaje += "la oferta se mantiene moderada.";
      }
      document.getElementById("weatherMessage").textContent = mensaje;
      
      // Tras obtener clima, procedemos a obtener precios
      obtenerPreciosFrutas();
    })
    .catch(error => {
      console.error("Error al obtener el clima:", error);
      weatherInfoElem.textContent = "No se pudo obtener el clima para la ubicación indicada.";
    });
}

// 2. Obtener precios de criptomonedas desde CoinGecko para simular precios
function obtenerPreciosFrutas() {
  const ids = frutas.map(f => f.coin).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      mostrarFrutas(data);
    })
    .catch(error => console.error("Error al obtener precios:", error));
}

// ==================== FUNCIONES DE MANEJO DE DATOS ====================

// Calcular precio simulado de la fruta a partir de la cotización
function calcularPrecio(coinPrice) {
  const coeficiente = 0.0001; // Factor de ajuste
  return (coinPrice * coeficiente).toFixed(2);
}

// Determinar disponibilidad basada en condiciones climáticas
function calcularDisponibilidad() {
  const desc = climaGlobal.description.toLowerCase();
  if(desc.includes("sunny") || desc.includes("clear") || desc.includes("sun")) {
    return "Alta";
  } else if(desc.includes("rain") || desc.includes("cloud") || desc.includes("shower")) {
    return "Baja";
  } else {
    return "Moderada";
  }
}

// ==================== MOSTRAR INFORMACIÓN EN LA INTERFAZ ====================

// Mostrar lista de frutas usando datos estáticos
function mostrarFrutas(datosPrecios) {
  fruitsStore.innerHTML = "";
  const disponibilidad = calcularDisponibilidad();
  frutas.forEach(fruta => {
    const coinPrice = datosPrecios[fruta.coin]?.usd || 0;
    const precioFruta = calcularPrecio(coinPrice);
    
    // Generar tarjeta de fruta
    const card = document.createElement("div");
    card.className = "fruit-card";
    card.innerHTML = `
      <img src="${fruta.imagen}" alt="${fruta.nombre}">
      <h2>${fruta.nombre}</h2>
      <p><strong>Precio:</strong> $${precioFruta} USD</p>
      <p><strong>Disponibilidad:</strong> ${disponibilidad}</p>
      <p><small>Simulado con ${fruta.coin.toUpperCase()}</small></p>
      <button class="btnShowModal" data-fruta='${JSON.stringify({ ...fruta, precio: precioFruta })}'>Ver Detalles</button>
    `;
    // Al hacer clic en la tarjeta (excepto en el botón), se abre el modal
    card.addEventListener("click", (e) => {
      if(e.target.classList.contains("btnShowModal")) return;
      abrirModal(fruta, precioFruta, disponibilidad);
    });
    // Botón para agregar directo 1 unidad al carrito (opcional)
    const btnAgregar = document.createElement("button");
    btnAgregar.textContent = "Agregar al Carrito (1)";
    btnAgregar.className = "btnAddCart";
    btnAgregar.setAttribute("data-fruta", JSON.stringify({ nombre: fruta.nombre, precio: precioFruta, imagen: fruta.imagen, cantidad: 1 }));
    btnAgregar.addEventListener("click", (e) => {
      e.stopPropagation();
      const producto = JSON.parse(e.target.getAttribute("data-fruta"));
      agregarAlCarrito(producto);
    });
    card.appendChild(btnAgregar);
    fruitsStore.appendChild(card);
  });
}

// ==================== MODAL DE DETALLE CON CONTROLES DE CANTIDAD ====================

// Mostrar modal con detalles y permitir seleccionar cantidad
function abrirModal(fruta, precioFruta, disponibilidad) {
  modalBody.innerHTML = `
    <img src="${fruta.imagen}" alt="${fruta.nombre}" class="modal-img">
    <h2>${fruta.nombre}</h2>
    <p><strong>Familia:</strong> ${fruta.familia}</p>
    <p><strong>Precio:</strong> $${precioFruta} USD</p>
    <p><strong>Disponibilidad:</strong> ${disponibilidad}</p>
    <p><strong>Nutrición:</strong> Carbohidratos: ${fruta.nutritions.carbohydrates}g, Proteínas: ${fruta.nutritions.protein}g, Grasas: ${fruta.nutritions.fat}g</p>
    <p><small>Precio simulado usando ${fruta.coin.toUpperCase()} de CoinGecko</small></p>
    <div class="quantity-control">
      <button id="decrement">-</button>
      <span id="quantity">1</span>
      <button id="increment">+</button>
    </div>
    <button id="addModalCart">Agregar al Carrito</button>
  `;
  modal.style.display = "block";
  
  // Variables para cantidad y botones
  let quantity = 1;
  const quantityElem = document.getElementById("quantity");
  document.getElementById("decrement").addEventListener("click", () => {
    if(quantity > 1) { quantity--; quantityElem.textContent = quantity; }
  });
  document.getElementById("increment").addEventListener("click", () => {
    quantity++; quantityElem.textContent = quantity;
  });
  document.getElementById("addModalCart").addEventListener("click", () => {
    agregarAlCarrito({ nombre: fruta.nombre, precio: precioFruta, imagen: fruta.imagen, cantidad: quantity });
    modal.style.display = "none";
  });
}

// ==================== FUNCIONALIDAD DEL CARRITO ====================

// Agregar producto al carrito (si ya existe, sumar cantidad)
function agregarAlCarrito(producto) {
  const indice = carrito.findIndex(item => item.nombre === producto.nombre);
  if(indice > -1) {
    carrito[indice].cantidad += producto.cantidad;
  } else {
    carrito.push(producto);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

// Actualizar contador del carrito y mostrar carrito
function actualizarContadorCarrito() {
  cartCountElem.textContent = carrito.length;
  mostrarCarrito();
}

// Mostrar productos del carrito
function mostrarCarrito() {
  cartItemsElem.innerHTML = "";
  let total = 0;
  carrito.forEach((item, index) => {
    total += parseFloat(item.precio) * item.cantidad;
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" class="cart-img">
      <span>${item.nombre} (${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)} USD</span>
      <button class="btnRemove" data-index="${index}">X</button>
    `;
    cartItemsElem.appendChild(li);
  });
  document.getElementById("cartTotal").textContent = `Total: $${total.toFixed(2)}`;
}

// Eliminar producto del carrito
cartItemsElem.addEventListener("click", (e) => {
  if(e.target.classList.contains("btnRemove")){
    const index = e.target.getAttribute("data-index");
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
  }
});

// Vaciar carrito
btnClearCart.addEventListener("click", () => {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
});

// ==================== EVENTOS DE MODAL Y CARRITO ====================

// Cerrar modal de detalle
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});
// Abrir modal del carrito
btnCart.addEventListener("click", () => {
  cartModal.style.display = "block";
});
// Cerrar modal del carrito
cartClose.addEventListener("click", () => {
  cartModal.style.display = "none";
});
// Cerrar modales al hacer clic fuera del contenido
window.addEventListener("click", (e) => {
  if(e.target === modal) modal.style.display = "none";
  if(e.target === cartModal) cartModal.style.display = "none";
});

// ==================== INICIALIZACIÓN ====================

// Al cargar la página se usa una ciudad por defecto (la seleccionada en el select)
window.addEventListener("load", () => {
  const ciudadPorDefecto = locationSelect.value;
  obtenerClima(ciudadPorDefecto);
  actualizarContadorCarrito();
});

// Cambiar ciudad cuando se consulte
btnGetWeather.addEventListener("click", () => {
  const ciudad = locationSelect.value;
  obtenerClima(ciudad);
});