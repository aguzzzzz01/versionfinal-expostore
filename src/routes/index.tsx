import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sparkles,
  Smartphone,
  Scissors,
  Flame,
  Package,
  ShieldCheck,
  Truck,
  MapPin,
  Instagram,
  MessageCircle,
  Wallet,
  Banknote,
  Bitcoin,
  ArrowRight,
  Star,
  CheckCircle2,
  PackageOpen,
  LayoutGrid,
  Shirt,
  Search,
  X,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  ArrowDownUp,
  Gamepad2,
} from "lucide-react";
import logo from "../assets/logo_fixed_1779202163805_1779229384372.png";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { CartButton } from "@/components/Cart";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "EXPOSTORE | Catálogo Premium en Lanús, Buenos Aires" },
      {
        name: "description",
        content:
          "EXPOSTORE Lanús: perfumes árabes y de diseñador, iPhones originales, Karssell, electrodomésticos, combos y ofertas semanas. Envíos a todo el país.",
      },
    ],
  }),
});

const WHATSAPP_NUMBER = "5491138012403";
const waLink = (productName: string) => {
  const msg = `Hola David! Vi tu catálogo web. Me interesa: ${productName} - Código de seguimiento: EXPOSTORE`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

export type Category =
  | "all"
  | "perfumes"
  | "lattafa"
  | "armaf"
  | "afnan"
  | "al-haramain"
  | "al-wataniah"
  | "anfar-1950"
  | "ard-al-zaafaran"
  | "bharara"
  | "emper"
  | "escada"
  | "fragrance-world"
  | "maison-alhambra"
  | "orientica"
  | "rasasi"
  | "rayhaan"
  | "tubbees"
  | "french-avenue"
  | "victoria-secret"
  | "legacy-king"
  | "paris-corner"
  | "zakat"
  | "zimaya"
  | "thoq-al-hawamer"
  | "iphone"
  | "karssell"
  | "electro"
  | "combos"
  | "indumentaria"
  | "play";

const MAIN_CATEGORIES: { id: Category; label: string; sub: string; Icon: typeof Sparkles }[] = [
  { id: "perfumes", label: "Perfumes", sub: "Colección Árabe & Designer", Icon: Sparkles },
  { id: "iphone", label: "iPhones", sub: "Apple Original", Icon: Smartphone },
  { id: "play", label: "Play", sub: "Consolas PlayStation", Icon: Gamepad2 },
  { id: "karssell", label: "Karssell", sub: "Cuidado capilar", Icon: Scissors },
  { id: "indumentaria", label: "Indumentaria", sub: "Camisetas oficiales", Icon: Shirt },
  { id: "electro", label: "Electro", sub: "Hogar y más", Icon: Flame },
  { id: "combos", label: "Combos", sub: "Ahorro total", Icon: Package },
];

const PERFUME_BRANDS: { id: Category; label: string }[] = [
  { id: "lattafa", label: "Lattafa" },
  { id: "al-haramain", label: "Al Haramain" },
  { id: "rayhaan", label: "Rayhaan" },
  { id: "al-wataniah", label: "Al Wataniah" },
  { id: "armaf", label: "Armaf" },
  { id: "afnan", label: "AFNAN" },
  { id: "anfar-1950", label: "Anfar 1950" },
  { id: "ard-al-zaafaran", label: "Ard Al Zaafaran" },
  { id: "maison-alhambra", label: "Maison Alhambra" },
  { id: "bharara", label: "Bharara" },
  { id: "emper", label: "Emper" },
  { id: "escada", label: "Escada" },
  { id: "fragrance-world", label: "Fragrance World" },
  { id: "rasasi", label: "Rasasi" },
  { id: "orientica", label: "Orientica" },
  { id: "french-avenue", label: "French Avenue" },
  { id: "victoria-secret", label: "Victoria's Secret" },
  { id: "tubbees", label: "Tubbees" },
  { id: "legacy-king", label: "Legacy King" },
  { id: "paris-corner", label: "Paris Corner" },
  { id: "zakat", label: "Zakat" },
  { id: "zimaya", label: "Zimaya" },
  { id: "thoq-al-hawamer", label: "Thoq Al Hawamer" },
];




function Home() {
  const [active, setActive] = useState<Category>("all");
  const [activeBrand, setActiveBrand] = useState<Category | null>(null);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");

  // Extracts a numeric value from a price string like "$55.000" or "u$ 760"
  // USD values are normalized with a rough multiplier so sorting is fair across currencies.
  const getPriceValue = (price?: string): number => {
    if (!price) return Number.POSITIVE_INFINITY;
    const isUSD = /u\$|usd|us\$/i.test(price);
    const cleaned = price.replace(/[^\d,.\-]/g, "").replace(/\./g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    if (Number.isNaN(num)) return Number.POSITIVE_INFINITY;
    return isUSD ? num * 1200 : num;
  };

  const getProductPriceValue = (p: (typeof PRODUCTS)[number]): number => {
    const candidates: (string | undefined)[] = [p.price];
    if (p.variants) p.variants.forEach((v) => candidates.push(v.price));
    if (p.sizeVariants) p.sizeVariants.forEach((s) => candidates.push(s.price));
    if (p.models) p.models.forEach((m) => candidates.push(m.price));
    const values = candidates.map(getPriceValue).filter((n) => Number.isFinite(n));
    if (values.length === 0) return Number.POSITIVE_INFINITY;
    return Math.min(...values);
  };

  const activeCat = useMemo(() => {
    if (active === "all") return null;
    return (
      MAIN_CATEGORIES.find((c) => c.id === active) ||
      PERFUME_BRANDS.find((b) => b.id === active) ||
      null
    );
  }, [active]);

  const filteredProducts = useMemo(() => {
    let base =
      active === "all"
        ? PRODUCTS
        : active === "perfumes"
          ? activeBrand
            ? PRODUCTS.filter((p) => p.category === activeBrand)
            : PRODUCTS.filter((p) =>
                PERFUME_BRANDS.map((b) => b.id).includes(p.category as Category),
              )
          : PRODUCTS.filter((p) => p.category === active);

    const q = query.trim().toLowerCase();
    const searched = !q
      ? base
      : base.filter((p) => {
          const haystacks: string[] = [p.name, p.description ?? ""];
          if (p.variants) p.variants.forEach((v) => haystacks.push(v.name, v.colorName ?? ""));
          if (p.sizeVariants) p.sizeVariants.forEach((s) => haystacks.push(s.name, s.size));
          if (p.models)
            p.models.forEach((m) => {
              haystacks.push(m.name, m.shortLabel ?? "");
              m.colors?.forEach((c) => haystacks.push(c.name));
            });
          return haystacks.some((h) => h.toLowerCase().includes(q));
        });

    if (sortOrder === "none") return searched;
    const sorted = [...searched].sort((a, b) => {
      const av = getProductPriceValue(a);
      const bv = getProductPriceValue(b);
      return sortOrder === "asc" ? av - bv : bv - av;
    });
    return sorted;
  }, [active, activeBrand, query, sortOrder]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-gold/30 selection:text-foreground">
      {/* Dynamic Ambient Blur Globals */}
      <div className="fixed top-0 left-1/4 -z-50 size-[500px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-10 right-10 -z-50 size-[400px] rounded-full bg-amber-500/5 blur-[140px] pointer-events-none" />

      {/* Top Professional Marquee */}
      <div className="border-b border-border/20 bg-black/80 overflow-hidden relative z-50">
        <div className="flex animate-marquee whitespace-nowrap py-2.5 text-[10px] sm:text-[11px] font-black tracking-[0.2em] text-gold/90">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-12 px-6">
              <span className="flex items-center gap-2">
                <Truck className="size-3.5" /> ENVÍOS A TODO EL PAÍS
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-3.5" /> PRODUCTOS 100% ORIGINALES
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-3.5" /> SHOWROOM & RETIRO EN LANÚS
              </span>
              <span className="flex items-center gap-2">
                <Bitcoin className="size-3.5" /> ACEPTAMOS USDT / CRIPTO
              </span>
              <span className="flex items-center gap-2">
                <Star className="size-3.5" /> ATENCIÓN DIRECTA PERSONALIZADA
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modern High-End Nav Header with Luxury Gradients */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-black/75 backdrop-blur-xl border-b border-border/20 before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold/50 before:to-transparent"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-white px-3 py-1.5 border border-gold/30 shadow-glow"
            >
              <img src={logo} alt="EXPOSTORE" className="h-8 sm:h-9 w-auto object-contain" />
            </motion.div>
            <div className="hidden sm:block leading-tight">
              <div className="text-[10px] tracking-[0.4em] text-gradient-gold font-black uppercase">
                LANÚS · BS AS
              </div>
              <div className="text-[11px] text-muted-foreground font-medium">
                Catálogo Importado
              </div>
            </div>
          </a>

          {/* Nav options with visual indicator background on active section */}
          <nav className="hidden md:flex items-center gap-1.5 rounded-full p-1 bg-white/5 border border-white/10">
            <a
              href="#top"
              className="px-4 py-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-gold transition-all duration-300"
            >
              Inicio
            </a>
            <a
              href="#catalogo"
              className="px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary-foreground bg-gradient-to-r from-gold/10 to-gold/20 border border-gold/30 rounded-full shadow-sm hover:scale-102 transition-all duration-300"
            >
              Catálogo
            </a>
            <a
              href="#faq"
              className="px-4 py-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-gold transition-all duration-300"
            >
              Preguntas
            </a>
            <div className="flex items-center gap-1.5 pl-2 pr-1 ml-1 border-l border-white/10">
              <Search className="size-3.5 text-gold shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.trim()) {
                    setActive("all");
                    setActiveBrand(null);
                  }
                }}
                placeholder="Buscar producto..."
                aria-label="Buscar productos"
                className="bg-transparent outline-none text-xs font-medium tracking-wide text-foreground placeholder:text-muted-foreground/60 w-32 lg:w-44"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Limpiar búsqueda"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </nav>


          <div className="flex items-center gap-2 shrink-0">
            <CartButton />
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={waLink("Consulta general Soporte Directo")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 via-gold to-amber-600 px-4 sm:px-5 py-2.5 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-glow shadow-gold/20 hover:shadow-gold/40 transition-all"
            >
              <MessageCircle className="size-4 animate-pulse" />
              <span className="hidden sm:inline">Soporte</span>
            </motion.a>
          </div>
        </div>
        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3 -mt-1">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-2">
            <Search className="size-4 text-gold shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim()) {
                  setActive("all");
                  setActiveBrand(null);
                }
              }}
              placeholder="Buscar producto..."
              aria-label="Buscar productos"
              className="flex-1 bg-transparent outline-none text-xs font-medium text-foreground placeholder:text-muted-foreground/60"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
                className="text-muted-foreground hover:text-gold transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero with soft high-end typography and sleek fades */}
      <section
        id="top"
        className="relative overflow-hidden bg-gradient-hero py-16 sm:py-24 lg:py-32"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.82_0.16_88/0.1),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3.5 py-1.5 text-[10px] font-black tracking-widest text-gold mb-6 shadow-sm">
              <Sparkles className="size-3.5 text-gold animate-spin-slow" /> CATÁLOGO OFICIAL
              EXPOSTORE
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.95] uppercase">
              BIENVENIDO A<br />
              <span className="text-gradient-gold drop-shadow-sm font-black">EXPOSTORE</span>
            </h1>
            <p className="mt-6 text-sm sm:text-base text-muted-foreground/90 max-w-xl leading-relaxed">
              Showroom multirubro premium en Lanús, Buenos Aires. Especialistas en selecta
              perfumería árabe original, iPhones sellados con garantía Apple y lo último en estética
              capilar profesional.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#catalogo"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 via-gold to-amber-600 px-7 py-3.5 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-glow shadow-gold/20 hover:shadow-gold/40 transition-all self-start"
              >
                EXPLORAR CATÁLOGO <ArrowRight className="size-4" />
              </motion.a>
              <div className="flex flex-wrap gap-3">
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={waLink("Consulta general")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-widest text-foreground hover:border-gold/40 hover:bg-white/10 transition-all"
                >
                  <MessageCircle className="size-4" /> WHATSAPP
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="https://whatsapp.com/channel/0029VbASD0s2UPBF6mkysO2S"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 via-gold to-amber-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-glow shadow-gold/20 hover:shadow-gold/40 transition-all"
                >
                  <MessageCircle className="size-4" /> CANAL DE WHATSAPP
                </motion.a>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-muted-foreground/80 font-bold tracking-wide uppercase">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-gold" /> Stock 100% Real
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-gold" /> Garantía de Confianza
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-gold" /> Envíos Seguros
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-gold" /> Productos Originales
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories chips section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex flex-col mb-10">
          <p className="text-[10px] tracking-[0.4em] text-gold font-black uppercase">
            RUBROS PREMIUM
          </p>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Navegar por categoría</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <CategoryChip
            active={active === "all"}
            label="Ver todo"
            sub="Todos los productos"
            Icon={LayoutGrid}
            onClick={() => {
              setActive("all");
              setActiveBrand(null);
            }}
          />
          {MAIN_CATEGORIES.map((c) => (
            <CategoryChip
              key={c.id}
              active={active === c.id}
              label={c.label}
              sub={c.sub}
              Icon={c.Icon}
              onClick={() => {
                setActive(c.id);
                if (c.id !== "perfumes") setActiveBrand(null);
              }}
            />
          ))}
        </div>

        {/* Brand Sub-navigation with smooth transition */}
        <AnimatePresence>
          {active === "perfumes" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-10 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="h-[1px] bg-gold/20 flex-1" />
                <p className="text-[9px] tracking-[0.3em] text-gold font-black uppercase whitespace-nowrap">
                  Marcas Seleccionadas
                </p>
                <div className="h-[1px] bg-gold/20 flex-1" />
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveBrand(null)}
                  className={`px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-300 border ${
                    activeBrand === null
                      ? "bg-gradient-gold text-primary-foreground border-gold shadow-md"
                      : "bg-card/40 border-border/60 hover:border-gold/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Todas las Marcas
                </motion.button>
                {PERFUME_BRANDS.map((brand) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={brand.id}
                    onClick={() => setActiveBrand(brand.id)}
                    className={`px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-300 border ${
                      activeBrand === brand.id
                        ? "bg-gradient-gold text-primary-foreground border-gold shadow-md"
                        : "bg-card/40 border-border/60 hover:border-gold/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {brand.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sort filter — applies to current view */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-gold/25 bg-gradient-to-r from-gold/[0.06] via-amber-500/[0.04] to-gold/[0.06] p-4 sm:px-5 sm:py-3 backdrop-blur-md shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-gold text-primary-foreground shadow-glow shadow-gold/10">
              <ArrowDownUp className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-[9px] tracking-[0.3em] text-gold font-black uppercase">
                Ordenar
              </p>
              <p className="text-xs font-bold text-foreground/80">
                {active === "all"
                  ? "Todos los productos"
                  : `Filtrar por precio · ${activeCat?.label ?? ""}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSortOrder("none")}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-300 border ${
                sortOrder === "none"
                  ? "bg-gradient-gold text-primary-foreground border-gold shadow-md"
                  : "bg-black/30 border-border/60 text-muted-foreground hover:text-foreground hover:border-gold/40"
              }`}
            >
              Predeterminado
            </button>
            <button
              type="button"
              onClick={() => setSortOrder("asc")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-300 border ${
                sortOrder === "asc"
                  ? "bg-gradient-gold text-primary-foreground border-gold shadow-md"
                  : "bg-black/30 border-border/60 text-muted-foreground hover:text-foreground hover:border-gold/40"
              }`}
            >
              <ArrowUpNarrowWide className="size-3.5" />
              Menor precio
            </button>
            <button
              type="button"
              onClick={() => setSortOrder("desc")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-300 border ${
                sortOrder === "desc"
                  ? "bg-gradient-gold text-primary-foreground border-gold shadow-md"
                  : "bg-black/30 border-border/60 text-muted-foreground hover:text-foreground hover:border-gold/40"
              }`}
            >
              <ArrowDownWideNarrow className="size-3.5" />
              Mayor precio
            </button>
          </div>
        </div>
      </section>

      {/* Catalog Grid Area */}
      <section id="catalogo" className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 pt-4">
        <div className="flex flex-col mb-10">
          <p className="text-[10px] tracking-[0.4em] text-gold font-black uppercase">
            {active === "all" ? "Nuestra selección" : activeCat?.label}
          </p>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            {active === "all" ? "Catálogo Exclusivo" : `Rubro: ${activeCat?.label}`}
          </h2>
        </div>




        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl border border-gold/20 bg-gradient-card p-10 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 size-72 rounded-full bg-gradient-gold opacity-10 blur-3xl" />
            <div className="relative z-10">
              <div className="mx-auto size-16 rounded-2xl bg-gradient-gold grid place-items-center text-primary-foreground shadow-glow shadow-gold/10">
                <PackageOpen className="size-8 animate-bounce" />
              </div>
              <h3 className="mt-6 text-xl sm:text-2xl font-black">
                <span className="text-gradient-gold">No encontramos resultados</span>
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-muted-foreground/90 max-w-md mx-auto leading-relaxed">
                Escribinos por WhatsApp y te ayudamos a conseguir lo que buscás, 
                o te avisamos en cuanto tengamos nuevos ingresos.
              </p>
              <div className="mt-6">
                <a
                  href={waLink(activeCat?.label ?? "Ingresos programados")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-xs font-black uppercase tracking-wider text-whatsapp-foreground shadow-glow hover:scale-105 transition duration-300"
                >
                  <MessageCircle className="size-4 animate-pulse" /> Consultar disponibilidad
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* "Can't find it?" CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-card p-8 sm:p-10"
        >
          <div className="absolute -top-24 -left-24 size-72 rounded-full bg-gradient-gold opacity-10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-gradient-gold opacity-10 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
            <div className="shrink-0 size-16 rounded-2xl bg-gradient-gold grid place-items-center text-primary-foreground shadow-glow shadow-gold/20">
              <Search className="size-7" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.4em] text-gold font-black uppercase">
                ¿No encontraste lo que buscás?
              </p>
              <h3 className="mt-1 text-xl sm:text-2xl font-black leading-tight">
                Pedinos <span className="text-gradient-gold">cualquier producto a medida</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground/90 max-w-xl">
                Trabajamos con un catálogo extendido bajo pedido. Contanos qué necesitás y te
                cotizamos al instante por WhatsApp, sin compromiso.
              </p>
            </div>
            <a
              href={`https://wa.me/5491138012403?text=${encodeURIComponent(
                "Hola David! No encontré un producto en el catálogo y quería hacer una consulta. Código de seguimiento: EXPOSTORE",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-xs font-black uppercase tracking-wider text-whatsapp-foreground shadow-glow hover:scale-105 transition duration-300"
            >
              <MessageCircle className="size-4 animate-pulse" />
              Hacer una consulta
            </a>
          </div>
        </motion.div>
      </section>


      {/* FAQ Accordion Grid */}
      <section id="faq" className="mx-auto max-w-7xl px-4 sm:px-6 py-20 border-t border-border/20">
        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[0.4em] text-gold font-black uppercase">
            INFORMACIÓN DE COMPRA
          </p>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Preguntas Frecuentes</h2>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground/80 max-w-lg mx-auto">
            Resolvé tus dudas de forma rápida antes de realizar tu pedido.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              q: "¿Cómo realizo una compra?",
              a: "Simplemente seleccioná la versión del producto que más te guste del catálogo, dale clic al botón 'Pedir' y el sistema te guiará directamente a nuestro WhatsApp oficial para coordinar el método de entrega.",
            },
            {
              q: "¿Hacen envíos a todo el país?",
              a: "Sí, despachamos con envío asegurado de forma diaria a toda la Argentina por Correo Argentino u OCA. También disponemos de showroom en Lanús.",
            },
            {
              q: "¿Cuáles son los medios de pago?",
              a: "Soportamos Efectivo, Transferencias Bancarias, Mercado Pago y Criptomonedas (USDT) para máxima comodidad.",
            },
            {
              q: "¿Los productos son originales?",
              a: "Todos nuestros perfumes, tratamientos Karseell y teléfonos iPhones son rigurosamente 100% genuinos y con garantía de origen oficial.",
            },
            {
              q: "¿Tienen showroom físico?",
              a: "Operamos como punto de venta y retiro privado en Lanús, Buenos Aires. Podés escribirnos libremente para coordinar tu cita.",
            },
            {
              q: "¿Tienen precios para revendedores?",
              a: "Totalmente. Ofrecemos cotizaciones con considerables descuentos mayoristas para compras a granel de lociones Karseell y fragancias árabes.",
            },
          ].map((faq, i) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              key={i}
              className="p-6 rounded-2xl border border-border/65 bg-card/30 hover:border-gold/40 transition-colors duration-300 group hover:shadow-glow/5"
            >
              <h3 className="font-bold text-gold text-sm tracking-wide mb-2.5 group-hover:translate-x-0.5 transition-transform duration-300">
                {faq.q}
              </h3>
              <p className="text-xs text-muted-foreground/90 leading-relaxed font-light">
                "{faq.a}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="border-y border-border/20 bg-gradient-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <p className="text-[10px] tracking-[0.4em] text-gold font-black text-center uppercase">
            CALIDAD GARANTIZADA
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-center mt-1 mb-12">
            La confianza es nuestra prioridad
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                Icon: Truck,
                title: "Envíos directos blindados",
                desc: "Despachos inmediatos a cada rincón de Argentina con empaquetado seguro.",
              },
              {
                Icon: ShieldCheck,
                title: "Absoluta originalidad",
                desc: "Fragancias importadas selladas y equipos Apple 100% auténticos.",
              },
              {
                Icon: MapPin,
                title: "Atención privada en Lanús",
                desc: "Retiros cómodos e inspección de productos en nuestro showroom.",
              },
            ].map((f, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                key={i}
                className="group relative rounded-2xl border border-border bg-card/40 p-6 overflow-hidden hover:border-gold/40 transition-colors"
              >
                <div className="absolute -top-10 -right-10 size-32 rounded-full bg-gradient-gold opacity-5 blur-2xl group-hover:opacity-10 transition duration-500" />
                <div className="size-12 rounded-xl bg-gradient-gold grid place-items-center text-primary-foreground shadow-glow shadow-gold/10">
                  <f.Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-base font-bold text-foreground/90">{f.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Aesthetic Payment Badge Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <p className="text-[10px] tracking-[0.4em] text-gold font-semibold text-center uppercase">
          MEDIOS DE PAGO HABILITADOS
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-center mt-1 mb-10">
          Pagá de la forma más cómoda
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { Icon: Wallet, label: "Mercado Pago" },
            { Icon: Banknote, label: "Efectivo Billete" },
            { Icon: Wallet, label: "Transferencias" },
            { Icon: Bitcoin, label: "USDT / Cripto" },
          ].map((m, i) => (
            <motion.div
              whileHover={{ y: -3 }}
              key={i}
              className="rounded-xl border border-border bg-card/30 p-4 flex flex-col items-center justify-center gap-2.5 transition-colors duration-300 hover:border-gold/30"
            >
              <div className="size-10 rounded-full bg-gold/5 grid place-items-center text-gold">
                <m.Icon className="size-5" />
              </div>
              <div className="text-xs font-bold tracking-wide">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer support prompt */}
      <section className="relative overflow-hidden border-t border-border/20">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-gold to-orange-700 opacity-95" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-primary-foreground">
          <div>
            <h3 className="text-2xl font-black tracking-tight uppercase">
              ¿Tienes alguna duda sobre un producto?
            </h3>
            <p className="text-xs opacity-90 mt-1 font-medium select-none">
              Escribinos directamente al WhatsApp y te asistimos gratis.
            </p>
          </div>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={waLink("Consulta general")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-gold hover:text-white transition duration-300 shadow-xl"
          >
            <MessageCircle className="size-4 animate-bounce" /> Consultar ahora
          </motion.a>
        </div>
      </section>

      {/* Main Bottom Footer */}
      <footer className="border-t border-border/15 bg-black/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8 text-xs">
          <div>
            <div className="inline-block rounded-xl bg-white px-3 py-1.5 border border-gold/30">
              <img src={logo} alt="EXPOSTORE" className="h-8 w-auto object-contain" />
            </div>
            <p className="mt-4 text-muted-foreground/90 max-w-xs leading-relaxed">
              La boutique de importados de confianza más representativa de Lanús, Buenos Aires.
            </p>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.3em] text-gold font-black mb-3.5 uppercase">
              CONTACTO OFICIAL
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2 font-medium">
                <MapPin className="size-4 text-gold shrink-0" /> Lanús, Buenos Aires, Argentina
              </li>
              <li>
                <a
                  href={waLink("Contacto directo")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-gold transition font-bold"
                >
                  <MessageCircle className="size-4 text-gold shrink-0" /> +54 9 11 3801-2403
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/expostorelanus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-gold transition font-bold"
                >
                  <Instagram className="size-4 text-gold shrink-0" /> @expostorelanus
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.3em] text-gold font-black mb-3.5 uppercase">
              RUBROS
            </div>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-muted-foreground font-medium">
              <li>
                <button
                  onClick={() => {
                    setActive("all");
                    setActiveBrand(null);
                    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-gold transition text-left"
                >
                  Ver Todo
                </button>
              </li>
              {MAIN_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setActive(c.id);
                      setActiveBrand(null);
                      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-gold transition text-left"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border/10 py-5 text-center text-[10px] text-muted-foreground/60 tracking-wider flex flex-col items-center justify-center gap-2">
          <div>
            © {new Date().getFullYear()} EXPOSTORE · Todos los derechos reservados · Lanús, Buenos
            Aires
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gold font-bold">
            <button
              onClick={() => setActivePolicy("terms")}
              className="hover:underline hover:text-amber-400 cursor-pointer font-black uppercase text-[9px] tracking-wider"
            >
              Términos de Compra
            </button>
            <span className="opacity-30">|</span>
            <button
              onClick={() => setActivePolicy("warranty")}
              className="hover:underline hover:text-amber-400 cursor-pointer font-black uppercase text-[9px] tracking-wider"
            >
              Garantías y Cambios
            </button>
            <span className="opacity-30">|</span>
            <button
              onClick={() => setActivePolicy("info")}
              className="hover:underline hover:text-amber-400 cursor-pointer font-black uppercase text-[9px] tracking-wider"
            >
              Retiros y Envíos
            </button>
          </div>
        </div>
      </footer>

      {/* Legal Policies Modal Popup overlay */}
      <AnimatePresence>
        {activePolicy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setActivePolicy(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gold/40 bg-card/95 p-6 sm:p-8 text-foreground/90 shadow-2xl flex flex-col"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border/20 pb-4 mb-4">
                <h3 className="text-lg font-black tracking-widest text-gradient-gold uppercase">
                  {activePolicy === "terms" && "Términos y Condiciones de Compra"}
                  {activePolicy === "warranty" && "Políticas de Garantías y Cambios"}
                  {activePolicy === "info" && "Información sobre Retiros y Envíos"}
                </h3>
                <button
                  onClick={() => setActivePolicy(null)}
                  className="rounded-lg bg-gold/10 px-3 py-1.5 text-xs font-black uppercase text-gold hover:bg-gold/20 trigger-btn transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground font-light overflow-y-auto max-h-[50vh] pr-2 scrollbar-thin scrollbar-thumb-gold">
                {activePolicy === "terms" && (
                  <>
                    <p className="font-bold text-foreground">1. Relación de Pedido Especial</p>
                    <p>
                      Cualquier solicitud de mercadería iniciada por nuestro catálogo redirigido a
                      WhatsApp constituye un acuerdo de preventa o reserva de stock real. El
                      comprador se compromete a verificar las especificaciones elegidas de perfumes,
                      presentaciones o mists corporales antes de ser confirmada la orden por David.
                    </p>
                    <p className="font-bold text-foreground">2. Precios y Variabilidad de Moneda</p>
                    <p>
                      Debido a la naturaleza importada de dispositivos como iPhones y perfumes
                      Premium, algunos precios de referencia pueden presentarse en dólares (u$s) o
                      pesos ($) y quedan condicionados a la tasa de cambio vigente al momento final
                      de concretar la operación.
                    </p>
                    <p className="font-bold text-foreground">3. Transacciones Cripto (USDT)</p>
                    <p>
                      Aceptamos USDT sobre red TRC-20 como medio de pago alternativo. Los detalles
                      de la dirección o wallet oficial de EXPOSTORE se entregan únicamente de forma
                      privada a través del chat de WhatsApp verificado para evitar suplantaciones de
                      identidad.
                    </p>
                  </>
                )}

                {activePolicy === "warranty" && (
                  <>
                    <p className="font-bold text-foreground">1. Garantías de Origen Apple</p>
                    <p>
                      Todos los equipos iPhones nuevos de EXPOSTORE se entregan sellados en su
                      empaque original de fábrica, contando con 1 (un) año de garantía oficial de
                      fabricante Apple Inc., gestionable directamente en cualquier sucursal Apple
                      Store oficial.
                    </p>
                    <p className="font-bold text-foreground">
                      2. Higiene de Perfumería y Cosmética
                    </p>
                    <p>
                      Por estrictas regulaciones sanitarias de higiene y salud, los perfumes árabes
                      importados (Lattafa, Armaf, Al Wataniah, etc.) y tratamientos de reparación
                      capilar Karseell no disponen de cambios directos por disconformidad con el
                      aroma o uso parcial si ya han sido desprecintados o removidos de su celofán
                      exterior.
                    </p>
                    <p className="font-bold text-foreground">3. Procedimiento de Falla Técnica</p>
                    <p>
                      Cualquier reclamo sobre rotura por parte del correo en el transporte debe ser
                      notificado con un video continuo de unboxing durante las 24 horas de haber
                      recibido el paquete, garantizando el reenvío o reposición con total
                      cordialidad.
                    </p>
                  </>
                )}

                {activePolicy === "info" && (
                  <>
                    <p className="font-bold text-foreground">1. Despachos y Logística</p>
                    <p>
                      Realizamos envíos asegurados a todo el territorio de la República Argentina a
                      través de Correo Argentino u OCA. Los plazos estipulados de despacho son de 24
                      a 48 horas útiles después de acreditarse el método de pago seleccionado.
                    </p>
                    <p className="font-bold text-foreground">
                      2. Punto de Retiro y Showroom Privado
                    </p>
                    <p>
                      Navegar y coordinar retiros en mano es directo y cómodo en nuestro punto
                      privado en Lanús, Buenos Aires. La dirección exacta y horarios flexibles de
                      showroom se acuerdan formalmente tras finalizar la confirmación vía WhatsApp.
                    </p>
                    <p className="font-bold text-foreground">3. Seguimiento Online</p>
                    <p>
                      Proveemos el código de seguimiento (tracking number) en tiempo real para
                      brindarte máxima tranquilidad en cada envío postal.
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 border-t border-border/20 pt-4 flex justify-end">
                <button
                  onClick={() => setActivePolicy(null)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground font-black uppercase text-xs tracking-wider shadow-md hover:scale-102 transition duration-300 cursor-pointer"
                >
                  Entendido y Aceptar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smooth Floating WhatsApp Button */}
    </div>
  );
}

function CategoryChip({
  label,
  sub,
  Icon,
  active,
  onClick,
}: {
  label: string;
  sub: string;
  Icon: typeof Sparkles;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative text-left rounded-2xl border p-4 sm:p-5 transition-all duration-300 overflow-hidden cursor-pointer
        ${
          active
            ? "border-gold bg-gradient-card shadow-md shadow-gold/5"
            : "border-border/60 bg-card/30 hover:border-gold/40"
        }`}
    >
      <div
        className={`absolute -top-8 -right-8 size-24 rounded-full blur-2xl transition-opacity duration-500
        ${active ? "bg-gradient-gold opacity-30" : "bg-gold/10 opacity-0 group-hover:opacity-20"}`}
      />
      <div
        className={`size-10 rounded-xl grid place-items-center transition-all duration-300
        ${active ? "bg-gradient-gold text-primary-foreground shadow-glow" : "bg-gold/10 text-gold group-hover:bg-gradient-gold group-hover:text-primary-foreground"}`}
      >
        <Icon className="size-5" />
      </div>
      <div className="mt-4 font-black text-xs sm:text-sm tracking-wide leading-tight uppercase text-foreground/90">
        {label}
      </div>
      <div className="text-[10px] sm:text-xs text-muted-foreground/80 mt-1 leading-snug font-normal">
        {sub}
      </div>
    </motion.button>
  );
}
