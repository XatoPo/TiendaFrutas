/**
 * Configuración global de la aplicación
 * Contiene constantes y datos estáticos utilizados en toda la aplicación
 */

// Array estático de frutas con datos adicionales
export const FRUTAS = [
  {
    nombre: "Manzana",
    coin: "bitcoin",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
    familia: "Rosaceae",
    nutritions: { carbohydrates: 14, protein: 0.3, fat: 0.2 },
    descripcion: "Fruta crujiente y jugosa, rica en fibra y antioxidantes.",
    factorClima: 1.2, // Más sensible al clima
    precioBase: 2.5, // Precio base en USD
  },
  {
    nombre: "Banana",
    coin: "ethereum",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    familia: "Musaceae",
    nutritions: { carbohydrates: 23, protein: 1.1, fat: 0.3 },
    descripcion: "Fruta energética rica en potasio, perfecta para deportistas.",
    factorClima: 1.5, // Muy sensible al clima
    precioBase: 1.8, // Precio base en USD
  },
  {
    nombre: "Fresa",
    coin: "cardano",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/2/29/PerfectStrawberry.jpg",
    familia: "Rosaceae",
    nutritions: { carbohydrates: 8, protein: 0.7, fat: 0.3 },
    descripcion: "Pequeña fruta roja con alto contenido de vitamina C y antioxidantes.",
    factorClima: 1.8, // Extremadamente sensible al clima
    precioBase: 3.2, // Precio base en USD
  },
  {
    nombre: "Uva",
    coin: "solana",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Wine_grapes03.jpg",
    familia: "Vitaceae",
    nutritions: { carbohydrates: 18, protein: 0.7, fat: 0.2 },
    descripcion: "Fruta dulce que crece en racimos, rica en antioxidantes y resveratrol.",
    factorClima: 1.3, // Sensible al clima
    precioBase: 2.75, // Precio base en USD
  },
  {
    nombre: "Mango",
    coin: "polkadot",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/9/90/Hapus_Mango.jpg",
    familia: "Anacardiaceae",
    nutritions: { carbohydrates: 15, protein: 0.8, fat: 0.4 },
    descripcion: "Fruta tropical dulce y jugosa, rica en vitaminas A y C.",
    factorClima: 1.7, // Muy sensible al clima
    precioBase: 3.5, // Precio base en USD
  },
  {
    nombre: "Naranja",
    coin: "litecoin",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg",
    familia: "Rutaceae",
    nutritions: { carbohydrates: 12, protein: 0.9, fat: 0.1 },
    descripcion: "Cítrico jugoso con alto contenido de vitamina C y fibra.",
    factorClima: 1.2, // Sensible al clima
    precioBase: 1.95, // Precio base en USD
  },
  {
    nombre: "Pera",
    coin: "ripple",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/0/0b/D%27anjou_pear.jpg",
    familia: "Rosaceae",
    nutritions: { carbohydrates: 15, protein: 0.4, fat: 0.1 },
    descripcion: "Fruta dulce y jugosa con piel fina, rica en fibra y vitaminas.",
    factorClima: 1.4, // Sensible al clima
    precioBase: 2.3, // Precio base en USD
  },
  {
    nombre: "Piña",
    coin: "binancecoin",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Pineapple_and_cross_section.jpg",
    familia: "Bromeliaceae",
    nutritions: { carbohydrates: 13, protein: 0.5, fat: 0.1 },
    descripcion: "Fruta tropical con sabor dulce y ácido, rica en bromelina y vitamina C.",
    factorClima: 1.6, // Muy sensible al clima
    precioBase: 3.8, // Precio base en USD
  },
]

// Configuración de la API del clima
export const WEATHER_API = {
  baseUrl: "https://wttr.in/",
  format: "j1",
}

// Configuración de la API de criptomonedas
export const CRYPTO_API = {
  baseUrl: "https://api.coingecko.com/api/v3/simple/price",
}

// Configuración de los iconos del clima
export const WEATHER_ICONS = {
  sunny: "☀️",
  clear: "☀️",
  partly_cloudy: "⛅",
  cloudy: "☁️",
  overcast: "☁️",
  mist: "🌫️",
  fog: "🌫️",
  rain: "🌧️",
  drizzle: "🌦️",
  shower: "🌧️",
  thunderstorm: "⛈️",
  snow: "❄️",
  default: "🌤️",
}

// Factor base para calcular el precio de las frutas
export const PRICE_FACTOR = 0.0001

// Objeto para almacenar información global del clima
export const climaGlobal = {
  ciudad: "",
  temp: 0,
  description: "",
  icon: WEATHER_ICONS.default,
}

// Factores de disponibilidad que afectan al precio
export const DISPONIBILIDAD_FACTORES = {
  Alta: 0.8, // Descuento por alta disponibilidad
  Moderada: 1.0, // Precio base
  Baja: 1.2, // Incremento moderado por baja disponibilidad
  "Muy Baja": 1.5, // Incremento razonable por muy baja disponibilidad
}
