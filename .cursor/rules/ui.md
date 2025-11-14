OBLIGATORIO
- Crea interfaz en modo dark. No Light

## Background y Gradientes

### Background Principal
- Usa gradientes simples de dark teal/cyan a negro (ej: `bg-gradient-to-b from-teal-950 via-gray-950 to-black`)
- Aplica efectos sutiles de luz desde arriba con `bg-gradient-radial` o overlays con opacidad baja
- Evita gradientes complejos o múltiples capas; mantén simplicidad visual
- El fondo debe ser completamente oscuro, sin elementos distractores

### Efectos Visuales Sutiles
- Líneas geométricas abstractas muy sutiles (opacidad < 10%) solo si aportan sin distraer
- Efectos de glow/brillo suaves desde el centro superior hacia abajo
- No uses patrones complejos ni texturas que compitan con el contenido

## Formularios

### Contenedor de Formularios
- Fondo: `bg-gray-900/90` o `bg-gray-950` con ligera transparencia si aplica
- Bordes: `border border-gray-800` o sin borde si el contraste es suficiente
- Bordes redondeados: `rounded-lg` o `rounded-xl` (8-12px)
- Padding generoso: `p-8` o `p-10` para espacios respirables
- Sombra sutil: `shadow-xl` con color oscuro

### Inputs
- Fondo: `bg-gray-800` o `bg-gray-900` (oscuro pero distinguible del contenedor)
- Bordes: `border border-gray-700` con `focus:border-teal-500` o `focus:border-cyan-500`
- Bordes redondeados: `rounded-md` o `rounded-lg`
- Padding interno: `px-4 py-2.5` o `px-3 py-2`
- Texto: `text-gray-100` para valores, `text-gray-400` para placeholders
- Iconos dentro del input: Posición izquierda con `pl-10` o `pl-11`, color `text-gray-400`
- Focus ring: `focus:ring-2 focus:ring-teal-500/20` o `focus:ring-cyan-500/20` (sutil)
- Transiciones suaves: `transition-colors duration-200`

### Labels
- Color: `text-gray-200` o `text-gray-300` (legible pero no dominante)
- Tamaño: `text-sm font-medium`
- Espaciado: `mb-1` o `mb-2` entre label e input

### Botones Principales
- Fondo: Gradiente teal/cyan (`bg-gradient-to-r from-teal-600 to-cyan-600`) o sólido `bg-teal-600`
- Hover: `hover:from-teal-700 hover:to-cyan-700` o `hover:bg-teal-700`
- Texto: `text-white font-medium`
- Bordes redondeados: `rounded-md` o `rounded-lg`
- Padding: `px-4 py-2.5` o `px-6 py-3`
- Ancho completo en formularios: `w-full`
- Transiciones: `transition-all duration-200`
- Focus: `focus:ring-2 focus:ring-teal-500/50 focus:outline-none`
- Estados disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

### Botones Secundarios/Links
- Color: `text-gray-400` o `text-teal-400` para links
- Hover: `hover:text-gray-300` o `hover:text-teal-300`
- Sin subrayado por defecto, solo en hover si es necesario

## Tipografía

### Títulos Principales (Hero/Slogan)
- Tamaño: `text-4xl` o `text-5xl` para desktop
- Peso: `font-bold` o `font-extrabold`
- Color: Gradiente de texto (`bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent`) o `text-teal-300`
- Centrado: `text-center`
- Espaciado entre líneas: `leading-tight` o `leading-snug`

### Subtítulos
- Tamaño: `text-lg` o `text-xl`
- Color: `text-cyan-300` o `text-teal-300` (ligeramente más claro que el título)
- Peso: `font-semibold` o `font-bold`

### Títulos de Formularios
- Tamaño: `text-3xl` o `text-2xl`
- Color: `text-white` o `text-gray-100`
- Peso: `font-bold`
- Centrado: `text-center`

### Descripción/Subtítulo de Formularios
- Tamaño: `text-sm` o `text-base`
- Color: `text-gray-400` o `text-gray-500`
- Centrado: `text-center`

## Layout y Espaciado

### Páginas de Autenticación
- Contenedor principal: `min-h-screen flex items-center justify-center`
- Padding horizontal: `px-4` o `px-6` para móviles
- Contenedor de formulario: `max-w-md` o `max-w-lg` centrado
- Espaciado vertical entre elementos: `space-y-6` o `space-y-8`

### Headers/Footers
- Header: Logo pequeño con icono circular (`w-8 h-8 rounded-full bg-teal-500/20`) y texto al lado
- Footer: Texto pequeño centrado `text-xs text-gray-500` en la parte inferior

## Iconos

### Dentro de Inputs
- Librería: Solo `lucide-react`
- Posición: Absoluta a la izquierda con `absolute left-3 top-1/2 -translate-y-1/2`
- Tamaño: `h-5 w-5` o `h-4 w-4`
- Color: `text-gray-400` o `text-gray-500`
- Input debe tener `pl-10` o `pl-11` para espacio del icono

### En Botones
- Tamaño: `h-4 w-4` o `h-5 w-5`
- Color: Mismo color del texto del botón (`text-white`)
- Espaciado: `gap-2` entre icono y texto

## Colores Principales

### Paleta Dark
- Background principal: `gray-950` o `black`
- Background secundario: `gray-900`
- Background inputs: `gray-800`
- Bordes: `gray-700` o `gray-800`
- Texto principal: `gray-100` o `white`
- Texto secundario: `gray-400`
- Texto terciario: `gray-500`

### Acentos
- Teal/Cyan: `teal-500`, `teal-600`, `cyan-500`, `cyan-600`
- Gradientes: `from-teal-600 to-cyan-600` o variaciones
- Hover states: Una tonalidad más oscura del color base

## Principios Generales

- **Simplicidad**: Menos es más. Evita elementos decorativos innecesarios
- **Contraste**: Asegura legibilidad suficiente entre texto y fondos
- **Consistencia**: Usa la misma paleta y espaciado en toda la aplicación
- **Espaciado generoso**: Mejor demasiado espacio que poco
- **Transiciones suaves**: Todas las interacciones deben tener `transition-*` apropiadas
- **Focus states**: Siempre incluir estados de focus accesibles y visibles
- **Responsive**: Diseño mobile-first, luego adaptar a desktop