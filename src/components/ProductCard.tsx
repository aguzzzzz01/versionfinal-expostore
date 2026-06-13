import { useMemo, useState } from "react";
import { MessageCircle, ChevronDown, ChevronUp, Info, ShoppingCart, Check } from "lucide-react";
import { Product, ProductModel } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const WHATSAPP_NUMBER = "5491138012403";
const PERFUME_CATEGORIES = new Set([
  "perfumes", "lattafa", "armaf", "afnan", "al-haramain", "al-wataniah",
  "anfar-1950", "ard-al-zaafaran", "bharara", "emper", "escada",
  "fragrance-world", "maison-alhambra", "orientica", "rasasi", "rayhaan",
  "tubbees", "french-avenue", "victoria-secret",
  "legacy-king", "paris-corner", "zakat", "zimaya", "thoq-al-hawamer",
]);
const waLink = (productName: string, details?: string[]) => {
  const extras = (details ?? []).filter(Boolean);
  const detailsTxt = extras.length ? ` (${extras.join(" · ")})` : "";
  const msg = `Hola David! Vi tu catálogo web. Me interesa: ${productName}${detailsTxt} - Código de seguimiento: EXPOSTORE`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

export function ProductCard({ product }: { product: Product }) {
  const hasModels = !!product.models && product.models.length > 0;
  const hasVariants = !hasModels && !!product.variants && product.variants.length > 0;
  const hasSizes = !hasModels && !hasVariants && !!product.sizeVariants && product.sizeVariants.length > 0;

  // Indices for nested selection
  const [modelIdx, setModelIdx] = useState(0);
  const [variantIdx, setVariantIdx] = useState(0); // color selector for non-model products
  const [sizeIdx, setSizeIdx] = useState(0);
  const [modelColorIdx, setModelColorIdx] = useState(0); // color selector inside a model
  const [isExpanded, setIsExpanded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, setOpen } = useCart();

  // Resolve the currently displayed data
  const activeModel: ProductModel | null = hasModels ? product.models![modelIdx] : null;

  const displayName = useMemo(() => {
    if (activeModel) return activeModel.name;
    if (hasVariants) return product.variants![variantIdx].name;
    if (hasSizes) return product.sizeVariants![sizeIdx].name;
    return product.name;
  }, [activeModel, hasVariants, variantIdx, hasSizes, sizeIdx, product, modelIdx]);

  const displayDesc = useMemo(() => {
    if (activeModel) return activeModel.description;
    if (hasVariants) return product.variants![variantIdx].description;
    if (hasSizes) return product.sizeVariants![sizeIdx].description;
    return product.description;
  }, [activeModel, hasVariants, variantIdx, hasSizes, sizeIdx, product, modelIdx]);

  const displayTag = useMemo(() => {
    if (activeModel) return activeModel.tag;
    if (hasVariants) return product.variants![variantIdx].tag || product.tag;
    if (hasSizes) return product.sizeVariants![sizeIdx].tag || product.tag;
    return product.tag;
  }, [activeModel, hasVariants, variantIdx, hasSizes, sizeIdx, product, modelIdx]);

  const displayImage = useMemo(() => {
    if (activeModel) {
      const c = activeModel.colors?.[modelColorIdx];
      if (c?.image) return c.image;
      return activeModel.image;
    }
    if (hasVariants) return product.variants![variantIdx].image;
    if (hasSizes) return product.sizeVariants![sizeIdx].image;
    return product.image;
  }, [activeModel, modelColorIdx, hasVariants, variantIdx, hasSizes, sizeIdx, product]);

  const displayPrice = useMemo(() => {
    if (activeModel) return activeModel.price;
    if (hasVariants) return product.variants![variantIdx].price;
    if (hasSizes) return product.sizeVariants![sizeIdx].price;
    return product.price || "Contactar";
  }, [activeModel, hasVariants, variantIdx, hasSizes, sizeIdx, product, modelIdx]);

  const optionsList = activeModel?.options ?? product.options;
  const colorsList = activeModel?.colors ?? null;
  const isPerfume = PERFUME_CATEGORIES.has(product.category as string);

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-border/80 bg-card/60 p-4 hover:border-gold/50 transition-colors duration-300 overflow-hidden shadow-sm"
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "560px 420px",
      } as React.CSSProperties}
    >
      {displayTag && (
        <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest bg-gold text-primary-foreground shadow-sm">
          {displayTag.toUpperCase()}
        </div>
      )}

      {/* Image */}
      <div
        className="relative aspect-square rounded-xl overflow-hidden mb-4 border border-border/20"
      >
        {/* Unified premium gradient backdrop (gold/dark) — same look across all products */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, oklch(0.32 0.10 88 / 0.55), transparent 60%), radial-gradient(ellipse at 70% 90%, oklch(0.82 0.16 88 / 0.18), transparent 65%), linear-gradient(160deg, oklch(0.16 0.02 80) 0%, oklch(0.07 0 0) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[8%] h-3 w-3/5 rounded-[50%] bg-black/40 blur-md"
        />
        {isPerfume && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-100/15 via-transparent to-black/25" />
        )}
        <img
          key={displayImage}
          src={displayImage}
          alt={displayName}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="relative h-full w-full object-contain p-3 drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.dataset.fallback) {
              img.dataset.fallback = "1";
              img.style.opacity = "0";
            }
          }}
        />
      </div>


      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-base leading-snug text-foreground/90 group-hover:text-gold transition-colors">
          {displayName}
        </h3>

        <div className="mt-2 text-xs">
          <div className="overflow-hidden relative">
            <p
              className={`text-muted-foreground/90 leading-relaxed font-normal ${!isExpanded ? "line-clamp-2" : ""}`}
            >
              {displayDesc}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 flex items-center gap-0.5 text-gold hover:text-amber-400 font-bold transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
          >
            {isExpanded ? (
              <>
                <span>Ver menos</span>
                <ChevronUp className="size-3" />
              </>
            ) : (
              <>
                <span>Ver descripción completa</span>
                <ChevronDown className="size-3" />
              </>
            )}
          </button>
        </div>

        {/* Model selector (iPhones) */}
        {hasModels && (
          <div className="mt-4 space-y-1.5 border-t border-border/20 pt-3">
            <div className="text-[10px] uppercase tracking-widest font-black text-gold/80">
              Elegir Modelo:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.models!.map((m, idx) => {
                const isSelected = modelIdx === idx;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setModelIdx(idx);
                      setModelColorIdx(0);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase transition-all border ${
                      isSelected
                        ? "bg-gradient-gold text-primary-foreground border-gold shadow-sm"
                        : "bg-black/20 text-muted-foreground border-border/40 hover:border-gold/40 hover:text-foreground"
                    }`}
                  >
                    {m.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Variant (color) selector for non-model products with variants */}
        {hasVariants && (
          <div className="mt-4 space-y-1.5 border-t border-border/20 pt-3">
            <div className="text-[10px] uppercase tracking-widest font-black text-gold/80">
              Elegir Versión / Color:
            </div>
            <div className="flex flex-wrap gap-2 py-1 items-center">
              {product.variants!.map((v, idx) => {
                const isSelected = variantIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setVariantIdx(idx)}
                    title={v.colorName}
                    type="button"
                    className={`relative size-7 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-115 active:scale-95 border-2 ${
                      isSelected
                        ? "border-gold scale-110 shadow-glow"
                        : "border-border/60 hover:border-gold/40"
                    }`}
                    style={{ backgroundColor: v.colorHex }}
                  >
                    {isSelected && (
                      <span
                        className={`size-1.5 rounded-full ${
                          v.colorHex === "#ffffff" ? "bg-black" : "bg-white"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
              <span className="text-[10px] text-muted-foreground/70 font-bold ml-1">
                {product.variants![variantIdx].colorName}
              </span>
            </div>
          </div>
        )}

        {/* Size selector (ML variants) */}
        {hasSizes && (
          <div className="mt-4 space-y-1.5 border-t border-border/20 pt-3">
            <div className="text-[10px] uppercase tracking-widest font-black text-gold/80">
              Elegir Tamaño:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.sizeVariants!.map((s, idx) => {
                const isSelected = sizeIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSizeIdx(idx)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase transition-all border ${
                      isSelected
                        ? "bg-gradient-gold text-primary-foreground border-gold shadow-sm"
                        : "bg-black/20 text-muted-foreground border-border/40 hover:border-gold/40 hover:text-foreground"
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Color selector inside the active model (iPhone colors) */}
        {hasModels && colorsList && colorsList.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <div className="text-[10px] uppercase tracking-widest font-black text-gold/80">
              Color:
            </div>
            <div className="flex flex-wrap gap-2 py-1 items-center">
              {colorsList.map((c, idx) => {
                const isSelected = modelColorIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setModelColorIdx(idx)}
                    title={c.name}
                    className={`relative size-7 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-115 active:scale-95 border-2 ${
                      isSelected
                        ? "border-gold scale-110 shadow-glow"
                        : "border-border/60 hover:border-gold/40"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <span
                        className={`size-1.5 rounded-full ${
                          c.hex.toLowerCase() === "#ffffff" || c.hex.toLowerCase() === "#fff"
                            ? "bg-black"
                            : "bg-white"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
              <span className="text-[10px] text-muted-foreground/70 font-bold ml-1">
                {colorsList[modelColorIdx].name}
              </span>
            </div>
          </div>
        )}

        {/* Options list (storage prices) */}
        {optionsList && optionsList.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-border/20 pt-3">
            <div className="text-[9px] uppercase tracking-widest font-black text-gold/80">
              Variantes & Almacenamiento
            </div>
            <div className="space-y-1 max-h-28 overflow-y-auto pr-1 font-mono text-[11px]">
              {optionsList.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md bg-black/20 px-2 py-1 border border-border/10 text-muted-foreground transition hover:border-gold/20"
                >
                  <span className="text-foreground/80 font-medium">{opt.spec}</span>
                  <span className="text-gold font-bold">{opt.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.wholesale && (
          <div className="mt-4 relative overflow-hidden rounded-xl border border-gold/40 bg-gradient-to-br from-gold/[0.10] via-amber-500/[0.06] to-gold/[0.10] p-2.5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
            <div className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5 inline-flex size-5 items-center justify-center rounded-md bg-gradient-gold text-primary-foreground">
                <Info className="size-3" />
              </span>
              <div className="leading-snug">
                <p className="text-[9px] tracking-[0.25em] font-black uppercase text-gold">
                  Precio Mayorista
                </p>
                <p className="text-[10px] text-foreground/85 font-medium mt-0.5">
                  Mín. 4 unidades · Por unidad <span className="font-black text-gold">+$5.000 ARS</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
                PRECIO
              </span>
              <span className="text-lg font-black text-gradient-gold">{displayPrice}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const cartId = `${product.id}::${hasModels ? activeModel?.id ?? modelIdx : ""}::${hasVariants ? variantIdx : ""}::${hasSizes ? sizeIdx : ""}::${hasModels ? modelColorIdx : ""}`;
                const detailParts = [
                  hasVariants ? `Color: ${product.variants![variantIdx].colorName}` : "",
                  hasModels && colorsList && colorsList.length > 0 ? `Color: ${colorsList[modelColorIdx].name}` : "",
                  hasSizes ? `Tamaño: ${product.sizeVariants![sizeIdx].size}` : "",
                ].filter(Boolean);
                const cartName = detailParts.length ? `${displayName} (${detailParts.join(" · ")})` : displayName;
                addItem({
                  id: cartId,
                  name: cartName,
                  image: displayImage,
                  price: typeof displayPrice === "string" ? displayPrice : String(displayPrice),
                });
                setJustAdded(true);
                window.setTimeout(() => setJustAdded(false), 1400);
              }}
              className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-wider rounded-xl border transition-all duration-300 active:scale-95 ${
                justAdded
                  ? "bg-gold/15 text-gold border-gold/50"
                  : "bg-white/5 text-foreground border-border/50 hover:border-gold/50 hover:text-gold"
              }`}
              aria-label="Agregar al carrito"
            >
              {justAdded ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
              <span>{justAdded ? "Agregado" : "Agregar"}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl bg-black/30 text-muted-foreground border border-border/40 hover:text-gold hover:border-gold/40 transition-all"
            >
              <ShoppingCart className="size-3.5" />
              <span>Ver carrito</span>
            </button>
            <a
              href={waLink(displayName, [
                hasVariants ? `Color: ${product.variants![variantIdx].colorName}` : "",
                hasModels && colorsList && colorsList.length > 0 ? `Color: ${colorsList[modelColorIdx].name}` : "",
                hasSizes ? `Tamaño: ${product.sizeVariants![sizeIdx].size}` : "",
                `Precio: ${displayPrice}`,
              ])}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-whatsapp text-whatsapp-foreground shadow-glow hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <MessageCircle className="size-4 animate-pulse" />
              <span>Consultar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
