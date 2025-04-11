/**
 * Archivo principal de la aplicación
 * Inicializa la aplicación y maneja los eventos principales
 */

import { obtenerClima, obtenerPreciosFrutas } from "./api.js"
import { mostrarFrutas, mostrarCargando, actualizarInfoClima, cerrarModal, mostrarNotificacion } from "./ui.js"
import { abrirCarrito, cerrarCarrito, configurarEventosCarrito, actualizarContadorCarrito } from "./cart.js"
import { climaGlobal } from "./config.js"

// Referencias a elementos del DOM
const btnGetWeather = document.getElementById("btnGetWeather")
const locationSelect = document.getElementById("locationSelect")
const btnCart = document.getElementById("btnCart")
const modalClose = document.getElementById("modalClose")
const cartClose = document.getElementById("cartClose")
const modal = document.getElementById("modal")
const cartModal = document.getElementById("cartModal")
const fruitsStore = document.getElementById("fruitsStore")

/**
 * Inicializa la aplicación
 */
async function inicializarApp() {
  // Configurar eventos del carrito
  configurarEventosCarrito()

  // Inicializar carrito
  actualizarContadorCarrito()

  // Mostrar indicador de carga
  mostrarCargando()

  try {
    // Obtener clima para la ciudad seleccionada
    const ciudadPorDefecto = locationSelect.value
    await obtenerClima(ciudadPorDefecto)
    actualizarInfoClima(climaGlobal)

    // Obtener precios y mostrar frutas
    const datosPrecios = await obtenerPreciosFrutas()
    mostrarFrutas(datosPrecios)
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error)
    fruitsStore.innerHTML = `
      <div class="error-message">
        <p>Lo sentimos, ha ocurrido un error al cargar los datos.</p>
        <button id="btnRetry" class="btn btn-primary">Intentar de nuevo</button>
      </div>
    `

    document.getElementById("btnRetry")?.addEventListener("click", inicializarApp)
  }
}

/**
 * Actualiza el clima y los precios de las frutas
 */
async function actualizarDatos() {
  try {
    mostrarCargando()
    const ciudad = locationSelect.value
    await obtenerClima(ciudad)
    actualizarInfoClima(climaGlobal)

    const datosPrecios = await obtenerPreciosFrutas()
    mostrarFrutas(datosPrecios)
  } catch (error) {
    console.error("Error al actualizar datos:", error)
    mostrarNotificacion("Error al actualizar los datos. Inténtalo de nuevo.")
  }
}

// Event listeners
btnGetWeather.addEventListener("click", actualizarDatos)
btnCart.addEventListener("click", abrirCarrito)
modalClose.addEventListener("click", cerrarModal)
cartClose.addEventListener("click", cerrarCarrito)

// Cerrar modales al hacer clic fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modal) cerrarModal()
  if (e.target === cartModal) cerrarCarrito()
})

// Inicializar la aplicación cuando se carga la página
window.addEventListener("load", inicializarApp)
