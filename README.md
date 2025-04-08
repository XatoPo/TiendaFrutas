# Tienda de Frutas en Línea - Actividad 1

## Descripción
Esta aplicación web frontend simula una tienda de frutas en línea con carrito de compras y se integra con tres APIs gratuitas:

1. **wttr.in**: Para obtener el clima actual (temperatura, condiciones, ubicación).
2. **CoinGecko**: Para obtener precios reales de criptomonedas y simular el precio “bancario” de cada fruta.
3. **Fruityvice API**: Para obtener información adicional (nombre, imagen, familia, nutrición) de cada fruta.

La aplicación muestra:
- Una lista de frutas con imagen, nombre, precio simulado (en USD) y disponibilidad (influenciada por el clima).
- Un modal con información detallada al hacer clic en una fruta.
- Un carrito de compras para agregar y gestionar productos, almacenado en LocalStorage.
- Permite al usuario ingresar su ciudad para obtener datos climáticos personalizados.

### Justificación
El clima afecta la producción agrícola; por eso, la aplicación muestra cómo condiciones favorables (por ejemplo, clima soleado) aumentan la disponibilidad de frutas, mientras que condiciones adversas la reducen. Además, se utiliza el valor de criptomonedas (obtenido vía CoinGecko) para simular precios financieros reales, adaptando la “cotización en la banca” para el mercado de frutas.

## Instrucciones de Ejecución
1. Descarga o clona el repositorio.
2. Abre el archivo `index.html` en un navegador moderno.
3. Ingresa una ciudad para consultar el clima.
4. Explora la tienda: haz clic en cualquier fruta para ver detalles y usa el botón “Agregar al Carrito” para simular compras.

## Tecnologías
- HTML5 semántico
- CSS3 (diseño responsivo e inspirado en Vercel)
- JavaScript (modular, uso de fetch y LocalStorage)
- APIs utilizadas:
  - [wttr.in](https://wttr.in/)
  - [CoinGecko API](https://www.coingecko.com/en/api)
  - [Fruityvice API](https://www.fruityvice.com/)

## Autor
Nombre del Alumno - Universidad XYZ
