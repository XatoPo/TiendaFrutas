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

function obtenerPreciosFrutas() {
  const ids = frutas.map((f) => f.simbolo).join(",");
  fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
  )
    .then((res) => res.json())
    .then((data) => mostrarFrutas(data))
    .catch((err) => console.error("Error al obtener precios:", err));
}

function obtenerClima(ciudad) {
  const url = `https://wttr.in/${encodeURIComponent(ciudad)}?format=j1`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const info = `
        📍 ${ciudad}<br>
        🌡️ ${data.current_condition[0].temp_C}°C - ${data.current_condition[0].weatherDesc[0].value}
      `;
      document.getElementById("weatherInfo").innerHTML = info;
    })
    .catch((err) => {
      document.getElementById("weatherInfo").innerText =
        "Ciudad no encontrada.";
      console.error("Error al obtener clima:", err);
    });
}

document.getElementById("getWeather").addEventListener("click", () => {
  const ciudad = document.getElementById("locationInput").value.trim();
  if (ciudad) {
    obtenerClima(ciudad);
  }
});

obtenerPreciosFrutas();
