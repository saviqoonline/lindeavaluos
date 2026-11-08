# Linde · Planos para avalúos

App web estática para elaborar croquis sencillos de inmuebles con medidas en metros y cálculo geométrico de áreas. Pensada para inspecciones y apoyo documental de avalúos.

## Cómo abrirla

1. Descomprime el ZIP completo.
2. Abre `index.html` con Chrome, Edge, Firefox u otro navegador moderno.
3. Para usarla desde cualquier celular con un enlace, publica **los cuatro archivos** (`index.html`, `styles.css`, `app.js`, `favicon.svg`) en una web estática, por ejemplo GitHub Pages o Netlify Drop. No requiere instalación ni servidor propio.

Es una **app web normal**, no una PWA: no lleva manifest, service worker ni opción de instalación incorporada.

## Funciones

- Proyectos y niveles múltiples.
- Rectángulos con ancho y alto editables; polígonos libres con vértices movibles.
- Categorías independientes: construida, libre, lote, común y no computable.
- Medición de áreas (m²), perímetros y longitudes. Cuadrícula en metros con ajuste de 5 cm, desactivable.
- Muros, puertas, ventanas, líneas de medición y anotaciones.
- Selección, arrastre, zoom, desplazamiento, deshacer y rehacer.
- Exportación de plano PNG (alta resolución), SVG (vectorial), CSV (cuadro de áreas), JSON (respaldo editable) y ficha PDF mediante la opción «Guardar como PDF» del cuadro de impresión del navegador.
- Responsive para celular, tableta y computador, mouse y pantallas táctiles.
- Los cambios se guardan automáticamente en el almacenamiento local del navegador.

## Guía breve

- **Rectángulo**: dos toques para marcar esquinas o arrastrar de una esquina a otra.
- **Polígono**: tocar cada esquina; terminar tocando el primer vértice, haciendo doble clic, pulsando **Terminar** o presionando Enter.
- **Muro / puerta / ventana / medir**: tocar los dos extremos.
- **Seleccionar**: tocar un objeto, arrastrarlo o mover sus vértices verdes. Editar datos en panel derecho.
- **Mover**: arrastrar el lienzo. Rueda de mouse o botones +/- para zoom.
- **Atajos**: V seleccionar, R rectángulo, P polígono, L muro, M medir, T texto, H mover. Ctrl+Z deshacer, Ctrl+Mayús+Z rehacer, Supr eliminar, Esc cancelar.
- **Ficha**: diligenciar los datos del inmueble para el encabezado de exportaciones.

## Privacidad y respaldos

No hay cuentas ni sincronización remota. Todo permanece en **el navegador y dispositivo donde se usa**. Si se borran los datos del sitio/navegador, se pueden perder los proyectos. Usa **Exportar → Respaldo JSON** con frecuencia para guardarlos y luego **Importar** para abrirlos en otro equipo. Evita el modo incógnito.

El dibujo y los cálculos son una ayuda de campo, **no sustituyen** levantamientos topográficos, planos arquitectónicos o estudios técnicos habilitados. Verifica datos y procedimientos según la finalidad del avalúo y la normativa aplicable.

## Estructura

- `index.html`: interfaz y editor SVG.
- `styles.css`: diseño responsive y ficha de impresión A4 apaisada.
- `app.js`: geometría, edición, almacenamiento y exportación, sin librerías de terceros.
- `favicon.svg`: ícono del producto.

Fuente opcional cargada de Google Fonts cuando hay conexión; si no, usa tipografía del sistema. Todo el editor funciona sin dependencias JS externas.

## Crear un croquis desde fotos

Pulsa **Crear desde fotos**, copia las instrucciones y pégalas en ChatGPT junto con las fotografías. Copia la respuesta y pégala en Linde para crear un proyecto nuevo. Linde no envía fotos ni se conecta a un servicio de IA. La interpretación puede contener errores u omisiones: comprueba todas las medidas y relaciones con el original. La información ilegible debe quedar como advertencia, no como una medida supuesta.

El respaldo de todos los proyectos se descarga desde Exportar → Respaldar todos y se recupera con Importar. La comparación de área se configura en Ficha; compara únicamente superficies equivalentes. Las alertas de geometría son orientativas y no detectan todos los casos.

## Herramientas adicionales

- **Polígono por medidas:** agrega lados con longitud y dirección o ángulo; el último punto se une al primero. Revisa que el cierre corresponda a la medición.
- **Plantillas y símbolos:** inserta espacios de ejemplo o etiquetas de acceso y escalera; modifica las medidas de ejemplo.
- **Fotos:** añade imágenes al proyecto o a un espacio seleccionado. Puedes escribir una descripción y seleccionar cuáles aparecerán en la ficha. Las imágenes se reducen y se guardan localmente; el espacio del navegador es limitado. Los respaldos JSON incluyen las fotos.
- La ficha PDF incluye un croquis por nivel y las fotografías seleccionadas.

### Croquis con elementos abiertos

Las instrucciones para ChatGPT solicitan formato `linde-foto-v2`: transcripción de lecturas, advertencias y croquis independientes con espacios, líneas, cotas y textos. Antes de crear los proyectos se muestra un resumen. Los elementos se marcan como pendientes de revisión; las áreas importadas quedan excluidas de las sumas. Una cota escrita es una lectura de la foto y no necesariamente coincide con la longitud de la línea dibujada. Los croquis sin amarre se guardan como proyectos separados. También se admite el formato anterior `linde-foto-v1`.
