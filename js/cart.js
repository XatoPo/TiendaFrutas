/**
 * Módulo para manejar el carrito de compras
 * Contiene funciones para agregar, eliminar y mostrar productos en el carrito
 */

// Referencias a elementos del DOM
const cartModal = document.getElementById("cartModal")
const cartClose = document.getElementById("cartClose")
const cartItemsElem = document.getElementById("cartItems")
const cartCountElem = document.getElementById("cartCount")
const btnClearCart = document.getElementById("btnClearCart")
const btnCheckout = document.getElementById("btnCheckout")
const emptyCartMessage = document.getElementById("emptyCartMessage")

// Carrito de compras (en memoria)
let carrito = []

/**
 * Agrega un producto al carrito
 * @param {Object} producto - Producto a agregar
 */
export function agregarAlCarrito(producto) {
  const indice = carrito.findIndex((item) => item.nombre === producto.nombre)

  if (indice > -1) {
    carrito[indice].cantidad += producto.cantidad
  } else {
    carrito.push(producto)
  }

  actualizarContadorCarrito()
}

/**
 * Elimina un producto del carrito
 * @param {number} index - Índice del producto a eliminar
 */
export function eliminarDelCarrito(index) {
  carrito.splice(index, 1)
  actualizarContadorCarrito()
}

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {number} index - Índice del producto
 * @param {number} cantidad - Nueva cantidad
 */
export function actualizarCantidadCarrito(index, cantidad) {
  if (cantidad <= 0) {
    eliminarDelCarrito(index)
    return
  }

  carrito[index].cantidad = cantidad
  mostrarCarrito()
}

/**
 * Actualiza el contador del carrito en la interfaz
 */
export function actualizarContadorCarrito() {
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0)
  cartCountElem.textContent = totalItems
  mostrarCarrito()
}

/**
 * Muestra los productos del carrito en la interfaz
 */
export function mostrarCarrito() {
  cartItemsElem.innerHTML = ""
  let total = 0

  if (carrito.length === 0) {
    emptyCartMessage.style.display = "block"
  } else {
    emptyCartMessage.style.display = "none"

    carrito.forEach((item, index) => {
      const subtotal = Number.parseFloat(item.precio) * item.cantidad
      total += subtotal

      const li = document.createElement("li")
      li.className = "cart-item"
      li.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.nombre}</div>
          <div class="cart-item-price">${item.precio} USD</div>
        </div>
        <div class="cart-item-quantity">
          <button class="cart-quantity-btn decrease" data-index="${index}">-</button>
          <span class="cart-quantity-value">${item.cantidad}</span>
          <button class="cart-quantity-btn increase" data-index="${index}">+</button>
        </div>
        <div class="cart-item-total">${subtotal.toFixed(2)}</div>
        <button class="cart-item-remove" data-index="${index}">&times;</button>
      `

      cartItemsElem.appendChild(li)
    })
  }

  document.getElementById("cartTotal").textContent = `Total: ${total.toFixed(2)} USD`
}

/**
 * Vacía el carrito
 */
export function vaciarCarrito() {
  carrito = []
  actualizarContadorCarrito()
}

/**
 * Abre el modal del carrito
 */
export function abrirCarrito() {
  cartModal.style.display = "block"
  setTimeout(() => {
    cartModal.classList.add("show")
  }, 10)
}

/**
 * Cierra el modal del carrito
 */
export function cerrarCarrito() {
  cartModal.classList.remove("show")
  setTimeout(() => {
    cartModal.style.display = "none"
  }, 300)
}

/**
 * Simula el proceso de finalizar compra
 */
export function finalizarCompra() {
  if (carrito.length === 0) {
    alert("El carrito está vacío")
    return
  }

  alert("¡Compra realizada con éxito!")
  vaciarCarrito()
  cerrarCarrito()
}

// Configurar event listeners para el carrito
export function configurarEventosCarrito() {
  cartItemsElem.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-item-remove")) {
      const index = Number.parseInt(e.target.getAttribute("data-index"))
      eliminarDelCarrito(index)
    } else if (e.target.classList.contains("decrease")) {
      const index = Number.parseInt(e.target.getAttribute("data-index"))
      actualizarCantidadCarrito(index, carrito[index].cantidad - 1)
    } else if (e.target.classList.contains("increase")) {
      const index = Number.parseInt(e.target.getAttribute("data-index"))
      actualizarCantidadCarrito(index, carrito[index].cantidad + 1)
    }
  })

  btnClearCart.addEventListener("click", vaciarCarrito)
  btnCheckout.addEventListener("click", finalizarCompra)
}
