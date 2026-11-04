# Isari Nails — web oficial

Landing page estática y optimizada para Cloudflare Workers/Pages. Diseño editorial en rosa y berenjena, fotografías reales de sets de Isari Nails, animaciones ligeras sin librerías externas y experiencia responsive.

## Despliegue

- Carpeta raíz: `/`
- Build command: ninguno (HTML/CSS/JS estáticos).
- Static assets: `assets/`
- Página principal: `index.html`
- GitHub: `hecroigg/isari_nails`, rama `main`.

Para un Worker conectado a GitHub, el archivo `wrangler.jsonc` fija el nombre `isari-nails` y el directorio de assets estáticos `./`. En Workers Builds, establecer el comando de despliegue `npx wrangler deploy` (comportamiento estándar). No hay build ni dependencias npm de la web.

## Contenido

- `index.html`: estructura, SEO y accesibilidad.
- `styles.css`: estilos responsive, efectos visuales y animaciones optimizadas.
- `script.js`: navegación móvil, filtros, reveals discretos, barra de scroll y solicitud de pedido con copia al portapapeles.
- `scroll-motion.css`: fondo global de varias capas, anillos y partículas decorativas con movimiento por scroll; escena fotográfica fija de tres capítulos.
- `scroll-motion.js`: un único motor ligero `requestAnimationFrame` con listener pasivo para mover fondo, fotografías, brillos y escena mientras se desliza, respetando accesibilidad y movimiento reducido.
- `assets/`: fotografías de diseños reales preparadas a partir de capturas aportadas por el propietario; no incluye testimonios inventados.
- `wrangler.jsonc`: configuración de Cloudflare Workers con assets estáticos.
- `.assetsignore`: excluye del directorio público archivos internos de configuración y documentación.

Las fotos de Instagram se utilizan como inspiración y presentación de diseños; los precios y plazos no están fijados en esta web. Las consultas se derivan al perfil `@isari_nails` (y a `ig.me` en dispositivos táctiles compatibles).

## Rendimiento y compatibilidad

- Sin Three.js, WebGL ni frameworks de JavaScript; el efecto de profundidad se produce sobre fotografías reales mediante transformaciones CSS y perspectiva 3D, evitando los modelos poligonales que no se parecían a uñas.
- Imágenes WebP optimizadas (unos 160 KB en conjunto) y lazy loading bajo el primer bloque.
- Animaciones `transform` / `opacity`, controladas desde un único `requestAnimationFrame` pasivo para evitar repintados por frame.
- El fondo se desplaza en todas las secciones, con fotografías que reaccionan al scroll; recorrido cinematográfico de 3 escenas, sin vídeos pesados.
- Respeta `prefers-reduced-motion`; con JS desactivado mantiene contenido, fotos y botones operativos.
- Verificado en Chromium local: 320, 390 y 1440 px, sin desbordamiento horizontal ni errores JavaScript; tres estados de la escena, menú y filtros verificados.

## Notas de mantenimiento

Para cambiar diseños y fotografías, editar la galería de `index.html` y las imágenes del directorio `assets/`. Si cambia el dominio, actualizar `canonical`, OpenGraph, robots y sitemap.
