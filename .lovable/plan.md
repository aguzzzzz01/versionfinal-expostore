## Lo que voy a hacer

### 1. iPhones — unificar en UN solo producto con selector de modelo + almacenamiento + color
Hoy hay 5 productos iPhone separados (16, 17e, 17, 17 Pro, 17 Pro Max), todos con la misma foto del lineup. Los junto en **un único producto "iPhone"** donde:
- Primer selector: **Modelo** (16 / 17e / 17 / 17 Pro / 17 Pro Max) → cambia foto, precio base, descripción.
- Segundo selector: **Almacenamiento** (128GB / 256GB / 512GB / 1TB según modelo) → cambia precio.
- Tercer selector: **Color** (círculos clickeables) → cambia la foto al color elegido.

Necesito **una foto por modelo y por color** (5 modelos × ~3-5 colores ≈ 20 imágenes). Las voy a generar con IA en calidad alta (renders de producto profesionales sobre fondo blanco). Si tenés fotos reales, son mejores — avisame y las cargás vos.

### 2. Perfumes por color → UN producto con selector tipo iPhone
Hoy hay 4 productos Lattafa Yara (Rosa/Amarillo/Blanco/Fucsia) y 3 Fakhar (Black/Oro/Woman) como productos separados. Los uno:
- **Lattafa Yara** → 1 producto con 4 variantes de color clickeables (Rosa, Amarillo, Blanco, Fucsia).
- **Lattafa Fakhar** → 1 producto con 3 variantes (Black, Oro, Woman).
Cada variante mantiene su nombre, descripción y precio actual. Al clickear el círculo cambia la imagen.

### 3. Mejorar calidad de imagen (sin cambiar el producto)
Voy a re-generar en alta calidad, manteniendo exactamente el mismo producto:
- Oil Capilar Karseell Maca Essence
- Crema Capilar Karseell 500g
- Camiseta de la Selección Argentina (3 estrellas)

### 4. Sabah Al Ward Al Wataniah
Re-genero la foto del frasco más chica/centrada para que se vea bien en PC, mismo perfume, fondo limpio.

### 5. Verificación de productos temáticos (Spider-Man / Star Wars / Mickey-Minnie / etc.)
Las imágenes actuales son archivos `UUID.jpg` subidos sueltos. **No puedo verificar si la imagen coincide con el producto real sin que me digas cuáles están mal o me pases las fotos correctas.** Tampoco puedo generar con IA imágenes oficiales de personajes con licencia (Spider-Man, Mickey, Mandalorian, etc.) — saldrían genéricas y posiblemente peores.

**Necesito tu decisión** (pregunta abajo).

## Orden de ejecución
1. Refactor del `Product` type + `ProductCard` para soportar selector multi-nivel (modelo → almacenamiento → color con cambio de imagen).
2. Unificar productos Yara y Fakhar.
3. Unificar iPhones + generar imágenes (paralelo).
4. Re-generar las 4 imágenes de calidad (Karseell oil, Karseell crema, camiseta, Sabah Al Ward).
5. Verificación visual final en preview.

## Detalles técnicos
- `ProductColorVariant` ya existe — lo extiendo con un nivel superior `ProductModelVariant` para iPhones (modelo → opciones de storage → colores con imágenes).
- En `ProductCard`, cuando el producto tenga `models`, renderizo dropdown/tabs de modelo arriba, lista de storages al medio, y los círculos de color abajo (la imagen del círculo seleccionado se muestra grande).
- Las imágenes nuevas se guardan en `src/assets/images/nuevos/` con nombres descriptivos.
