# Tienda de Frutas en Línea - Actividad 1

## Descripción
Esta aplicación web frontend simula una tienda de frutas en línea con un carrito de compras. Se integra con dos APIs gratuitas:

1. **wttr.in:** Obtiene el clima actual (temperatura, condiciones y ubicación) a partir de una selección de ciudades predefinidas (ciudades de España y capitales de Latinoamérica).
2. **CoinGecko API:** Obtiene cotizaciones reales de criptomonedas para simular el precio "bancario" de cada fruta.

La información de las frutas es estática e incluye:
- Imagen, nombre, familia y valores nutricionales.
- Precio simulado (USD) basado en la cotización de la moneda asignada.
- Disponibilidad que varía dinámicamente según el clima obtenido.

Además, la aplicación incluye:
- Un **modal de detalle** de fruta con información completa y controles para seleccionar la cantidad a agregar al carrito.
- Un **carrito de compras** donde se puede ver, aumentar o disminuir la cantidad de productos.
- Mensajes dinámicos en función del clima:
  - "El clima influye en la producción agrícola; condiciones óptimas (soleado) aumentan la oferta, mientras que climas adversos la reducen." (Se actualiza según las condiciones reales).

## Instrucciones de Ejecución
1. Descarga o clona el repositorio.
2. Descomprime y abre el archivo `index.html` en un navegador moderno.
3. Selecciona una ciudad predefinida del menú y haz clic en "Consultar clima".
4. Explora la tienda: haz clic en una fruta para ver sus detalles y utiliza los controles de cantidad para agregar al carrito.
5. Usa el botón "Carrito" para ver y gestionar los productos agregados.

## Tecnologías
- HTML5 semántico
- CSS3 (diseño responsivo e inspirado en interfaces modernas)
- JavaScript (uso de fetch, APIs y DOM)
- APIs utilizadas:
  - [wttr.in](https://wttr.in/) para datos climáticos.
  - [CoinGecko API](https://www.coingecko.com/en/api) para obtener cotizaciones.

## Autor
Edward Jair Ochoa Valero - Universidad XYZ
