// ==================== VARIABLES Y CONFIGURACIÓN ====================

// Mapeo de frutas a criptomonedas para simular el precio
const frutas = [
  { nombre: "Manzana", coin: "bitcoin" },
  { nombre: "Banana", coin: "ethereum" },
  { nombre: "Fresa", coin: "cardano" },
  { nombre: "Uva", coin: "solana" },
  { nombre: "Mango", coin: "polkadot" },
  { nombre: "Naranja", coin: "litecoin" },
  { nombre: "Pera", coin: "ripple" },
  { nombre: "Piña", coin: "binancecoin" }
];

// Elementos del DOM
const fruitsStore = document.getElementById("fruitsStore");
const weatherInfoElem = document.getElementById("weatherInfo");
const btnGetWeather = document.getElementById("btnGetWeather");
const locationInput = document.getElementById("locationInput");
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

// ==================== FUNCIONES DE INTEGRACIÓN DE APIs ====================

// 1. Obtener clima desde wttr.in
function obtenerClima(ciudad) {
  const url = `https://wttr.in/${encodeURIComponent(ciudad)}?format=j1`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const current = data.current_condition[0];
      climaGlobal.ciudad = ciudad;
      climaGlobal.temp = parseInt(current.temp_C);
      climaGlobal.description = current.weatherDesc[0].value;
      // Mostrar la información de clima en la cabecera
      weatherInfoElem.innerHTML = `
        Ubicación: ${ciudad} | Temperatura: ${climaGlobal.temp}°C | Condición: ${climaGlobal.description}
      `;
      // Una vez obtenido el clima, consultamos los precios de las criptomonedas para simular precios de frutas
      obtenerPreciosFrutas();
    })
    .catch(error => {
      console.error("Error al obtener el clima:", error);
      weatherInfoElem.textContent = "No se pudo obtener el clima para la ubicación indicada.";
    });
}

// 2. Obtener precios de criptomonedas desde CoinGecko para simular precios de frutas
function obtenerPreciosFrutas() {
  const ids = frutas.map(f => f.coin).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Mostrar las frutas en la tienda
      mostrarFrutas(data);
    })
    .catch(error => console.error("Error al obtener precios:", error));
}

// ==================== FUNCIONES DE MANEJO DE DATOS ====================

// Función para calcular el precio simulado de la fruta a partir del precio de la criptomoneda
function calcularPrecio(coinPrice) {
  // Factor de ajuste para simular un precio razonable en el mercado de frutas
  const coeficiente = 0.0001;
  return (coinPrice * coeficiente).toFixed(2);
}

// Función para determinar la disponibilidad en base a la descripción climática
function calcularDisponibilidad() {
  const desc = climaGlobal.description.toLowerCase();
  if (desc.includes("sunny") || desc.includes("clear") || desc.includes("sun")) {
    return "Alta";
  } else if (desc.includes("rain") || desc.includes("cloud") || desc.includes("shower")) {
    return "Baja";
  } else {
    return "Moderada";
  }
}

// ==================== MOSTRAR INFORMACIÓN EN LA INTERFAZ ====================

// Función principal para mostrar la lista de frutas
function mostrarFrutas(datosPrecios) {
  fruitsStore.innerHTML = "";
  const disponibilidad = calcularDisponibilidad();

  // Recorre cada fruta y muestra la tarjeta
  frutas.forEach(fruta => {
    const coinPrice = datosPrecios[fruta.coin]?.usd || 0;
    const precioFruta = calcularPrecio(coinPrice);

    // Para agregar más información, se consulta la Fruityvice API (tercera API) para obtener datos adicionales
    // Se hace una búsqueda por nombre y se agregan detalles como familia y/o otros datos relevantes.
    const url = `https://cors-anywhere.herokuapp.com/https://www.fruityvice.com/api/fruit/${fruta.nombre.toLowerCase()}`;

    fetch(url)
      .then(response => response.json())
      .then(info => {
        // Construir la tarjeta con la información recopilada
        const card = document.createElement("div");
        card.className = "fruit-card";
        card.innerHTML = `
          <img src="${info.image || `https://via.placeholder.com/150?text=${fruta.nombre}`}" alt="${fruta.nombre}">
          <h2>${fruta.nombre}</h2>
          <p><strong>Precio:</strong> $${precioFruta} USD</p>
          <p><strong>Disponibilidad:</strong> ${disponibilidad}</p>
          <p><small>Simulado con ${fruta.coin.toUpperCase()}</small></p>
          <button class="btnAddCart" data-fruit='${JSON.stringify({
            nombre: fruta.nombre,
            precio: precioFruta,
            imagen: info.image || `https://via.placeholder.com/150?text=${fruta.nombre}`
          })}'>Agregar al Carrito</button>
        `;
        // Evento para abrir modal de detalles al hacer clic en la tarjeta (excluyendo el botón de agregar)
        card.addEventListener("click", (e) => {
          if (e.target.classList.contains("btnAddCart")) return; // Evitar conflicto con agregar al carrito
          abrirModal(info, precioFruta, disponibilidad, fruta.coin);
        });
        fruitsStore.appendChild(card);
      })
      .catch(err => {
        console.error("Error al obtener datos de Fruityvice:", err);
      });
  });
}

// Función para abrir el modal con detalles de la fruta
function abrirModal(info, precioFruta, disponibilidad, coin) {
  // Construir contenido del modal
  modalBody.innerHTML = `
    <img src="${info.image || `https://via.placeholder.com/150?text=${info.name}`}" alt="${info.name}" class="modal-img">
    <h2>${info.name}</h2>
    <p><strong>Familia:</strong> ${info.family || "N/A"}</p>
    <p><strong>Precio:</strong> $${precioFruta} USD</p>
    <p><strong>Disponibilidad:</strong> ${disponibilidad}</p>
    <p><small>Precio simulado usando ${coin.toUpperCase()} de CoinGecko</small></p>
    <p><strong>Nutrición:</strong> Carbohidratos: ${info.nutritions?.carbohydrates || "N/A"}g, Proteínas: ${info.nutritions?.protein || "N/A"}g, Grasas: ${info.nutritions?.fat || "N/A"}g</p>
  `;
  modal.style.display = "block";
}

// ==================== FUNCIONALIDAD DEL CARRITO ====================

// Agregar producto al carrito
function agregarAlCarrito(producto) {
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

// Actualizar contador del carrito en el header
function actualizarContadorCarrito() {
  cartCountElem.textContent = carrito.length;
  mostrarCarrito();
}

// Mostrar carrito en el modal de carrito
function mostrarCarrito() {
  cartItemsElem.innerHTML = "";
  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" class="cart-img">
      <span>${item.nombre} - $${item.precio} USD</span>
      <button class="btnRemove" data-index="${index}">X</button>
    `;
    cartItemsElem.appendChild(li);
  });
}

// Eliminar producto del carrito
cartItemsElem.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnRemove")) {
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

// Evento para agregar producto al carrito desde botón en cada tarjeta
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnAddCart")) {
    // Detener el evento de la tarjeta para que no abra el modal
    e.stopPropagation();
    const producto = JSON.parse(e.target.getAttribute("data-fruit"));
    agregarAlCarrito(producto);
  }
});

// Cerrar modal de detalles
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

// Abrir el modal del carrito
btnCart.addEventListener("click", () => {
  cartModal.style.display = "block";
});

// Cerrar modal del carrito
cartClose.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// Cerrar modales al hacer clic fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
  if (e.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// ==================== INICIALIZACIÓN ====================

// Al cargar la página se utiliza una ciudad por defecto
window.addEventListener("load", () => {
  const ciudadPorDefecto = "Madrid";
  locationInput.value = ciudadPorDefecto;
  obtenerClima(ciudadPorDefecto);
  actualizarContadorCarrito();
});