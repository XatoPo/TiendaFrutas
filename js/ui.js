/**
 * Módulo para manejar la interfaz de usuario
 * Contiene funciones para actualizar y mostrar elementos en la UI
 */

import { FRUTAS } from "./config.js"
import { calcularDisponibilidad, calcularPrecio, generarMensajeClima, generarExplicacionPrecio } from "./api.js"
import { agregarAlCarrito } from "./cart.js"

// Referencias a elementos del DOM
const fruitsStore = document.getElementById("fruitsStore")
const weatherInfoElem = document.getElementById("weatherInfo")
const weatherIconElem = document.getElementById("weatherIcon")
const weatherMessageElem = document.getElementById("weatherMessage")
const modal = document.getElementById("modal")
const modalClose = document.getElementById("modalClose")
const modalBody = document.getElementById("modalBody")

/**
 * Actualiza la información del clima en la interfaz
 * @param {Object} climaData - Datos del clima
 */
export function actualizarInfoClima(climaData) {
  weatherIconElem.textContent = climaData.icon || "🌤️"
  weatherInfoElem.textContent = `${climaData.ciudad}: ${climaData.temp}°C - ${climaData.description}`
  weatherMessageElem.textContent = generarMensajeClima()
}

/**
 * Muestra las frutas en la interfaz con sus precios y disponibilidad
 * @param {Object} datosPrecios - Datos de precios de criptomonedas
 */
export function mostrarFrutas(datosPrecios) {
  fruitsStore.innerHTML = ""
  const disponibilidad = calcularDisponibilidad()

  FRUTAS.forEach((fruta) => {
    const coinPrice = datosPrecios[fruta.coin]?.usd || 100 // Valor por defecto si no hay datos
    const precioFruta = calcularPrecio(coinPrice, disponibilidad, fruta.factorClima)

    // Crear tarjeta de fruta
    const card = document.createElement("div")
    card.className = "fruit-card"

    // Determinar clase de disponibilidad
    let availabilityClass = ""
    if (disponibilidad === "Alta") {
      availabilityClass = "availability-high"
    } else if (disponibilidad === "Moderada") {
      availabilityClass = "availability-medium"
    } else if (disponibilidad === "Baja") {
      availabilityClass = "availability-low"
    } else {
      availabilityClass = "availability-low"
    }

    card.innerHTML = `
      <img src="${fruta.imagen}" alt="${fruta.nombre}" class="fruit-image">
      <div class="fruit-content">
        <h3 class="fruit-title">${fruta.nombre}</h3>
        <p class="fruit-price">$${precioFruta} USD</p>
        <span class="availability-badge ${availabilityClass}">
          Disponibilidad: ${disponibilidad}
        </span>
        <p class="fruit-coin">Simulado con ${fruta.coin.toUpperCase()}</p>
        <div class="fruit-actions">
          <button class="btn btn-details" data-fruta='${JSON.stringify({ ...fruta, precio: precioFruta })}'>
            Ver Detalles
          </button>
          <button class="btn btn-add" data-fruta='${JSON.stringify({
            nombre: fruta.nombre,
            precio: precioFruta,
            imagen: fruta.imagen,
            cantidad: 1,
          })}'>
            Añadir
          </button>
        </div>
      </div>
    `

    fruitsStore.appendChild(card)
  })

  // Agregar event listeners a los botones
  document.querySelectorAll(".btn-details").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const fruta = JSON.parse(e.target.getAttribute("data-fruta"))
      abrirModal(fruta, disponibilidad)
    })
  })

  document.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const producto = JSON.parse(e.target.getAttribute("data-fruta"))
      agregarAlCarrito(producto)
      mostrarNotificacion(`${producto.nombre} añadido al carrito`)
    })
  })
}

/**
 * Abre el modal con detalles de la fruta
 * @param {Object} fruta - Datos de la fruta
 * @param {string} disponibilidad - Nivel de disponibilidad
 */
export function abrirModal(fruta, disponibilidad) {
  const explicacionPrecio = generarExplicacionPrecio(fruta.nombre, disponibilidad)

  modalBody.innerHTML = `
    <div class="fruit-detail">
      <div class="fruit-detail-header">
        <img src="${fruta.imagen}" alt="${fruta.nombre}" class="fruit-detail-img">
        <div class="fruit-detail-title">
          <h2>${fruta.nombre}</h2>
          <p>${fruta.descripcion || "Fruta fresca de temporada"}</p>
        </div>
      </div>
      
      <div class="fruit-detail-info">
        <p><strong>Familia:</strong> ${fruta.familia}</p>
        <p><strong>Precio:</strong> $${fruta.precio} USD</p>
        <p><strong>Disponibilidad:</strong> ${disponibilidad}</p>
      </div>
      
      <div class="price-explanation">
        <h4>¿Por qué este precio?</h4>
        <p>${explicacionPrecio}</p>
      </div>
      
      <div class="nutrition-info">
        <h3>Información Nutricional</h3>
        <div class="nutrition-grid">
          <div class="nutrition-item">
            <div class="nutrition-value">${fruta.nutritions.carbohydrates}g</div>
            <div class="nutrition-label">Carbohidratos</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">${fruta.nutritions.protein}g</div>
            <div class="nutrition-label">Proteínas</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">${fruta.nutritions.fat}g</div>
            <div class="nutrition-label">Grasas</div>
          </div>
        </div>
      </div>
      
      <p class="fruit-coin"><small>Precio simulado usando ${fruta.coin.toUpperCase()} de CoinGecko</small></p>
      
      <div class="quantity-control">
        <button id="decrement" class="quantity-btn">-</button>
        <span id="quantity" class="quantity-value">1</span>
        <button id="increment" class="quantity-btn">+</button>
      </div>
      
      <button id="addModalCart" class="add-to-cart-btn">Agregar al Carrito</button>
    </div>
  `

  // Mostrar el modal con animación
  modal.style.display = "block"
  setTimeout(() => {
    modal.classList.add("show")
  }, 10)

  // Variables para cantidad y botones
  let quantity = 1
  const quantityElem = document.getElementById("quantity")

  document.getElementById("decrement").addEventListener("click", () => {
    if (quantity > 1) {
      quantity--
      quantityElem.textContent = quantity
    }
  })

  document.getElementById("increment").addEventListener("click", () => {
    quantity++
    quantityElem.textContent = quantity
  })

  document.getElementById("addModalCart").addEventListener("click", () => {
    agregarAlCarrito({
      nombre: fruta.nombre,
      precio: fruta.precio,
      imagen: fruta.imagen,
      cantidad: quantity,
    })
    cerrarModal()
    mostrarNotificacion(`${quantity} ${fruta.nombre}${quantity > 1 ? "s" : ""} añadido al carrito`)
  })
}

/**
 * Cierra el modal con animación
 */
export function cerrarModal() {
  modal.classList.remove("show")
  setTimeout(() => {
    modal.style.display = "none"
  }, 300)
}

/**
 * Muestra una notificación temporal
 * @param {string} mensaje - Mensaje a mostrar
 */
export function mostrarNotificacion(mensaje) {
  // Crear elemento de notificación
  const notificacion = document.createElement("div")
  notificacion.className = "notificacion"
  notificacion.textContent = mensaje
  notificacion.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--primary-color);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
  `

  document.body.appendChild(notificacion)

  // Mostrar con animación
  setTimeout(() => {
    notificacion.style.transform = "translateY(0)"
    notificacion.style.opacity = "1"
  }, 10)

  // Ocultar después de 3 segundos
  setTimeout(() => {
    notificacion.style.transform = "translateY(100px)"
    notificacion.style.opacity = "0"

    // Eliminar del DOM después de la animación
    setTimeout(() => {
      document.body.removeChild(notificacion)
    }, 300)
  }, 3000)
}

/**
 * Muestra un indicador de carga
 */
export function mostrarCargando() {
  fruitsStore.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Cargando frutas...</p>
    </div>
  `
}
