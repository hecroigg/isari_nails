# Isari Nails — web oficial

Landing page estática y optimizada para Cloudflare Workers/Pages. Diseño editorial en rosa y berenjena, fotografías reales de sets de Isari Nails, animaciones ligeras sin librerías externas y experiencia responsive.

## Despliegue

- Carpeta raíz: `/`
- Build command: ninguno (HTML/CSS/JS estáticos).
- Static assets: `assets/`
- Página principal: `index.html`
- GitHub: `hecroigg/isari_nails`, rama `main`.

Para un Worker ya conectado a GitHub, configurar el directorio de assets estáticos como `./` (o el que admita el asistente de Cloudflare). No se necesita Node/npm ni servidor.

## Contenido

- `index.html`: estructura, SEO y accesibilidad.
- `styles.css`: estilos responsive, efectos visuales y animaciones optimizadas.
- `script.js`: navegación móvil, filtros, reveals discretos, barra de scroll y solicitud de pedido con copia al portapapeles.
- `assets/`: fotografías preparadas a partir de capturas aportadas por el propietario; no incluye testimonios inventados.

Las fotos de Instagram se utilizan como inspiración y presentación de diseños; los precios y plazos no están fijados en esta web. Las consultas se derivan al perfil `@isari_nails` (y a `ig.me` en dispositivos táctiles compatibles).

## Rendimiento y compatibilidad

- Sin Three.js, WebGL ni frameworks de JavaScript; no hay nail meshes poligonales ni scripts de terceros.
- Imágenes WebP optimizadas (unos 160 KB en conjunto) y lazy loading bajo el primer bloque.
- Animaciones `transform` / `opacity`, condicionadas por `prefers-reduced-motion`.
- Verificado en Chromium local: 320, 390 y 1440 px, sin desbordamiento horizontal y sin errores JavaScript.

## Notas de mantenimiento

Para cambiar diseños y fotografías, editar la galería de `index.html` y las imágenes del directorio `assets/`. Si cambia el dominio, actualizar `canonical`, OpenGraph, robots y sitemap.
