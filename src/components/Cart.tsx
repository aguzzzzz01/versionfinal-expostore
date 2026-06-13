import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/contexts/CartContext";

const WHATSAPP_NUMBER = "5491138012403";

function buildWhatsAppMessage(items: ReturnType<typeof useCart>["items"]) {
  const lines = items.map(
    (i, idx) => `${idx + 1}. ${i.name} — x${i.quantity} (${i.price})`
  );
  const body = [
    "Hola David! Vi tu catálogo web y quiero consultar por estos productos del carrito:",
    "",
    ...lines,
    "",
    `Total de items: ${items.reduce((a, i) => a + i.quantity, 0)}`,
    "Código de seguimiento: EXPOSTORE",
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
}

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Abrir carrito"
      className="relative inline-flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 text-foreground hover:border-gold/40 hover:text-gold transition-colors"
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-primary-foreground text-[10px] font-black">
          {count}
        </span>
      )}
    </button>
  );
}

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQty, clear, count } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-background border-l border-border/40 flex flex-col shadow-2xl"
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-5 text-gold" />
                <h2 className="text-sm font-black uppercase tracking-widest text-gradient-gold">
                  Tu Carrito ({count})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar carrito"
                className="size-8 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-gold hover:bg-white/5 transition-colors"
              >
                <X className="size-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <ShoppingCart className="size-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-bold text-foreground/90">Tu carrito está vacío</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Agregá productos del catálogo para consultarlos juntos por WhatsApp.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-xl border border-border/30 bg-card/40 p-3"
                  >
                    <div className="size-16 shrink-0 rounded-lg overflow-hidden border border-border/20 bg-gradient-to-br from-neutral-100 via-white to-neutral-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <p className="text-xs font-bold text-foreground/90 line-clamp-2 leading-snug">
                        {item.name}
                      </p>
                      <p className="text-xs text-gold font-black mt-1">{item.price}</p>
                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-md border border-border/40 bg-black/30">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            aria-label="Disminuir cantidad"
                            className="size-7 inline-flex items-center justify-center text-muted-foreground hover:text-gold"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="px-2 text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            aria-label="Aumentar cantidad"
                            className="size-7 inline-flex items-center justify-center text-muted-foreground hover:text-gold"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label="Eliminar producto"
                          className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border/30 p-4 space-y-3 bg-black/40">
                <button
                  type="button"
                  onClick={clear}
                  className="w-full text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-red-400 transition-colors"
                >
                  Vaciar carrito
                </button>
                <a
                  href={buildWhatsAppMessage(items)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-whatsapp text-whatsapp-foreground font-black uppercase tracking-wider text-xs shadow-glow hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <MessageCircle className="size-4" />
                  <span>Consultar por WhatsApp</span>
                </a>
                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  Te llevamos a WhatsApp con todos los productos listados para coordinar tu pedido.
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
