// Lista de frutas y monedas asociadas (API CoinGecko)
const frutas = [
  {
    nombre: "Manzana",
    simbolo: "bitcoin",
    imagen: "https://i.ibb.co/y5Br6Gf/apple.jpg",
  },
  {
    nombre: "Banana",
    simbolo: "ethereum",
    imagen: "https://i.ibb.co/PGXfRgh/banana.jpg",
  },
  {
    nombre: "Fresa",
    simbolo: "cardano",
    imagen: "https://i.ibb.co/GpyCyB4/strawberry.jpg",
  },
  {
    nombre: "Uva",
    simbolo: "solana",
    imagen: "https://i.ibb.co/2cD1BdY/grape.jpg",
  },
];

// Mostrar cards de frutas con precios simulados
function mostrarFrutas(dataCripto) {
  const contenedor = document.getElementById("frutas");
  contenedor.innerHTML = "";

  frutas.forEach((fruta) => {
    const precioUSD = dataCripto[fruta.simbolo]?.usd || 0;
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
            <img src="${fruta.imagen}" alt="${fruta.nombre}">
            <h3>${fruta.nombre}</h3>
            <p>Precio simulado: $${precioUSD.toFixed(2)} / kg</p>
        `;

    contenedor.appendChild(card);
  });
}

// Obtener cotizaciones de criptos desde CoinGecko
function obtenerPreciosFrutas() {
  const ids = frutas.map((f) => f.simbolo).join(",");
  fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
  )
    .then((res) => res.json())
    .then((data) => mostrarFrutas(data))
    .catch((err) => console.error("Error al obtener precios:", err));
}

// Obtener clima desde OpenWeather
function obtenerClima(ciudad) {
  const apiKey = "TU_API_KEY_OPENWEATHER"; // Reemplaza con tu API KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const info = `
            📍 ${data.name}, ${data.sys.country}<br>
            🌡️ ${data.main.temp}°C - ${data.weather[0].description}
            `;
      document.getElementById("weatherInfo").innerHTML = info;
    })
    .catch((err) => {
      document.getElementById("weatherInfo").innerText =
        "Ciudad no encontrada.";
      console.error("Error al obtener clima:", err);
    });
}

// Evento al presionar "Consultar clima"
document.getElementById("getWeather").addEventListener("click", () => {
  const ciudad = document.getElementById("locationInput").value.trim();
  if (ciudad) {
    obtenerClima(ciudad);
  }
});

// Cargar al inicio
obtenerPreciosFrutas();
