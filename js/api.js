/**
 * Módulo para manejar las llamadas a APIs externas
 * Contiene funciones para obtener datos del clima y precios de criptomonedas
 */

import {
  WEATHER_API,
  CRYPTO_API,
  WEATHER_ICONS,
  FRUTAS,
  climaGlobal,
  PRICE_FACTOR,
  DISPONIBILIDAD_FACTORES,
} from "./config.js"

/**
 * Obtiene datos del clima para una ciudad específica
 * @param {string} ciudad - Nombre de la ciudad
 * @returns {Promise} - Promesa con los datos del clima
 */
export async function obtenerClima(ciudad) {
  try {
    const url = `${WEATHER_API.baseUrl}${encodeURIComponent(ciudad)}?format=${WEATHER_API.format}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error al obtener el clima: ${response.status}`)
    }

    const data = await response.json()
    const current = data.current_condition[0]

    // Actualizar objeto global de clima
    climaGlobal.ciudad = ciudad
    climaGlobal.temp = Number.parseInt(current.temp_C)
    climaGlobal.description = current.weatherDesc[0].value
    climaGlobal.icon = getWeatherIcon(current.weatherDesc[0].value)

    return climaGlobal
  } catch (error) {
    console.error("Error al obtener el clima:", error)
    throw error
  }
}

/**
 * Obtiene los precios de las criptomonedas para simular precios de frutas
 * @returns {Promise} - Promesa con los datos de precios
 */
export async function obtenerPreciosFrutas() {
  try {
    const ids = FRUTAS.map((fruta) => fruta.coin).join(",")
    const url = `${CRYPTO_API.baseUrl}?ids=${ids}&vs_currencies=usd`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error al obtener precios: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al obtener precios:", error)
    throw error
  }
}

/**
 * Determina el icono adecuado según la descripción del clima
 * @param {string} description - Descripción del clima
 * @returns {string} - Emoji que representa el clima
 */
function getWeatherIcon(description) {
  const desc = description.toLowerCase()

  if (desc.includes("sunny") || desc.includes("clear")) {
    return WEATHER_ICONS.sunny
  } else if (desc.includes("partly cloudy")) {
    return WEATHER_ICONS.partly_cloudy
  } else if (desc.includes("cloudy") || desc.includes("overcast")) {
    return WEATHER_ICONS.cloudy
  } else if (desc.includes("mist") || desc.includes("fog")) {
    return WEATHER_ICONS.mist
  } else if (desc.includes("rain") || desc.includes("shower")) {
    return WEATHER_ICONS.rain
  } else if (desc.includes("drizzle")) {
    return WEATHER_ICONS.drizzle
  } else if (desc.includes("thunder")) {
    return WEATHER_ICONS.thunderstorm
  } else if (desc.includes("snow")) {
    return WEATHER_ICONS.snow
  }

  return WEATHER_ICONS.default
}

/**
 * Calcula el precio simulado de la fruta a partir de la cotización y disponibilidad
 * @param {number} coinPrice - Precio de la criptomoneda
 * @param {string} disponibilidad - Nivel de disponibilidad
 * @param {number} factorClima - Factor de sensibilidad al clima específico de la fruta
 * @param {number} precioBase - Precio base de la fruta
 * @returns {string} - Precio formateado con dos decimales
 */
export function calcularPrecio(coinPrice, disponibilidad, factorClima = 1.0, precioBase = 2.0) {
  // Usamos el precio base como punto de partida
  let precio = precioBase

  // Aplicamos una pequeña variación basada en el precio de la criptomoneda (máximo ±30%)
  const variacionCripto = (coinPrice * PRICE_FACTOR) / precioBase
  precio = precio * (1 + Math.min(Math.max(variacionCripto - 0.5, -0.3), 0.3))

  // Aplicamos el factor de disponibilidad
  const factorDisponibilidad = DISPONIBILIDAD_FACTORES[disponibilidad] || 1.0

  // Calculamos el precio final considerando la disponibilidad y el factor específico de la fruta
  const precioFinal = precio * factorDisponibilidad * factorClima

  // Aseguramos un precio mínimo de 0.5 USD
  return Math.max(precioFinal, 0.5).toFixed(2)
}

/**
 * Determina la disponibilidad de las frutas basada en condiciones climáticas
 * @returns {string} - Nivel de disponibilidad (Alta, Moderada, Baja, Muy Baja)
 */
export function calcularDisponibilidad() {
  const desc = climaGlobal.description ? climaGlobal.description.toLowerCase() : ""
  const temp = climaGlobal.temp || 20

  // Condiciones climáticas óptimas
  if ((desc.includes("sunny") || desc.includes("clear")) && temp >= 20 && temp <= 30) {
    return "Alta"
  }

  // Condiciones climáticas adversas
  if (desc.includes("thunder") || desc.includes("storm") || desc.includes("snow") || temp < 5) {
    return "Muy Baja"
  }

  // Condiciones climáticas desfavorables
  if (desc.includes("rain") || desc.includes("shower") || desc.includes("drizzle") || temp > 35) {
    return "Baja"
  }

  // Condiciones climáticas neutras
  if (desc.includes("cloudy") || desc.includes("overcast") || desc.includes("mist") || desc.includes("fog")) {
    // Si además hace frío, la disponibilidad es menor
    if (temp < 15) {
      return "Baja"
    }
    return "Moderada"
  }

  // Por defecto, disponibilidad moderada
  return "Moderada"
}

/**
 * Genera un mensaje sobre el impacto del clima en la disponibilidad
 * @returns {string} - Mensaje explicativo
 */
export function generarMensajeClima() {
  const desc = climaGlobal.description ? climaGlobal.description.toLowerCase() : ""
  const temp = climaGlobal.temp || 20
  let mensaje = "El clima influye en la producción agrícola; "

  if ((desc.includes("sunny") || desc.includes("clear")) && temp >= 20 && temp <= 30) {
    mensaje += "condiciones óptimas (soleado con temperatura ideal) aumentan la oferta y calidad de las frutas."
  } else if (desc.includes("thunder") || desc.includes("storm")) {
    mensaje += "tormentas y condiciones extremas reducen drásticamente la disponibilidad y dañan los cultivos."
  } else if (desc.includes("rain") || desc.includes("shower")) {
    mensaje += "lluvias moderadas a intensas reducen la disponibilidad y pueden afectar la calidad de algunas frutas."
  } else if (desc.includes("cloudy") || desc.includes("overcast")) {
    mensaje += "cielos nublados mantienen una producción moderada, aunque puede afectar la dulzura de algunas frutas."
  } else if (desc.includes("mist") || desc.includes("fog")) {
    mensaje += "la niebla y bruma pueden afectar la polinización y reducir ligeramente la producción."
  } else if (temp > 35) {
    mensaje += "temperaturas extremadamente altas pueden estresar los cultivos y reducir la calidad de las frutas."
  } else if (temp < 5) {
    mensaje += "temperaturas muy bajas pueden dañar los cultivos y reducir significativamente la disponibilidad."
  } else {
    mensaje += "las condiciones actuales mantienen una oferta moderada."
  }

  return mensaje
}

/**
 * Genera una explicación de cómo el clima afecta al precio de una fruta específica
 * @param {string} nombreFruta - Nombre de la fruta
 * @param {string} disponibilidad - Nivel de disponibilidad actual
 * @returns {string} - Explicación detallada
 */
export function generarExplicacionPrecio(nombreFruta, disponibilidad) {
  const desc = climaGlobal.description ? climaGlobal.description.toLowerCase() : ""
  const temp = climaGlobal.temp || 20

  let explicacion = ""

  switch (disponibilidad) {
    case "Alta":
      explicacion = `Las condiciones climáticas actuales (${climaGlobal.description}) son ideales para el cultivo de ${nombreFruta}. La alta disponibilidad reduce los precios.`
      break
    case "Moderada":
      explicacion = `Las condiciones climáticas actuales (${climaGlobal.description}) permiten una producción normal de ${nombreFruta}, manteniendo precios estables.`
      break
    case "Baja":
      explicacion = `Las condiciones climáticas actuales (${climaGlobal.description}) dificultan la producción de ${nombreFruta}, lo que aumenta su precio por menor disponibilidad.`
      break
    case "Muy Baja":
      explicacion = `Las condiciones climáticas adversas (${climaGlobal.description}) afectan severamente la producción de ${nombreFruta}, causando escasez y precios significativamente más altos.`
      break
  }

  // Añadir información sobre temperatura
  if (temp > 30) {
    explicacion += ` Además, las altas temperaturas (${temp}°C) pueden afectar la calidad y conservación del producto.`
  } else if (temp < 10) {
    explicacion += ` Además, las bajas temperaturas (${temp}°C) pueden retrasar la maduración y reducir la cosecha.`
  }

  return explicacion
}
