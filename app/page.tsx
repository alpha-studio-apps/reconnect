import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Reveal } from "@/components/Reveal";

const TEMAS = [
  "Llegada", "Respiración", "Tierra", "Raíces", "Vínculos",
  "Alegría", "Quietud", "Duelo", "Miedo", "Valores",
  "Propósito", "Futuro", "Gratitud", "Regreso",
];

const FEATURES = [
  {
    title: "No es un rastreador.",
    desc: "No mide tu productividad ni cuenta tus pasos. Pregunta lo que sientes, y espera.",
  },
  {
    title: "No es un programa.",
    desc: "No hay una forma correcta de hacerlo. Puedes pausar, releer, avanzar. A tu propio ritmo.",
  },
  {
    title: "No es otra app.",
    desc: "No hay rachas que proteger, no hay notificaciones exigiéndote atención. Nada que optimizar.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navigation variant="landing" />

      {/* Hero — Alpha Track pattern */}
      <section className="section flex-1 flex items-center">
        <div className="container max-w-3xl">
          <Reveal>
            {/* Eyebrow label */}
            <p
              className="text-caption font-semibold mb-5 tracking-widest uppercase"
              style={{ color: "#00C896" }}
            >
              Reconnect · 14 días
            </p>

            {/* Headline — accent word pattern like Alpha Track */}
            <h1 className="text-display-xl text-ink mb-6">
              Catorce días.<br />
              Solo{" "}
              <span className="accent-underline">tú.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-body-lg mb-10 max-w-xl" style={{ color: "#9CA3AF" }}>
              Una práctica tranquila para reconectar con lo que importa.
              No es un rastreador. No es un programa. Solo preguntas
              honestas y respuestas honestas.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <button className="btn-primary">
                  Comenzar tu camino →
                </button>
              </Link>
              <Link href="#como">
                <button className="btn-ghost">Cómo funciona</button>
              </Link>
            </div>
          </Reveal>

          {/* Mini dashboard preview — Alpha Track style */}
          <Reveal delay={0.35}>
            <div className="card mt-14 p-5 max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-caption font-semibold tracking-widest uppercase" style={{ color: "#374151" }}>
                  Reconnect · Día 7
                </span>
                <span className="flex items-center gap-1.5 text-caption" style={{ color: "#00C896" }}>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#00C896" }}
                  />
                  EN CURSO
                </span>
              </div>

              <div className="flex flex-col gap-3 mb-4">
                {[
                  { label: "Reflexión matutina", done: true },
                  { label: "Reflexión vespertina", done: false },
                  { label: "Práctica del día", done: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: item.done ? "#00C896" : "rgba(255,255,255,0.15)",
                          background: item.done ? "rgba(0,200,150,0.12)" : "transparent",
                        }}
                      >
                        {item.done && (
                          <span style={{ color: "#00C896", fontSize: "9px", fontWeight: 700 }}>✓</span>
                        )}
                      </div>
                      <span className="text-caption" style={{ color: item.done ? "#9CA3AF" : "#FFFFFF" }}>
                        {item.label}
                      </span>
                    </div>
                    <span className={item.done ? "badge-done" : "badge-pending"}>
                      {item.done ? "HECHO" : "PENDIENTE"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="divider mb-3" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-caption" style={{ color: "#6B7280" }}>Ejecución diaria</span>
                <span className="text-caption font-bold" style={{ color: "#FFFFFF" }}>33%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "33%" }} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What this is NOT */}
      <section className="section" id="que">
        <div className="container">
          <Reveal>
            <p className="text-caption font-semibold tracking-widest uppercase mb-10" style={{ color: "#374151" }}>
              Lo que esto no es
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="card p-7 h-full">
                  <h3 className="text-display-md mb-3" style={{ fontSize: "1.2rem" }}>
                    {f.title}
                  </h3>
                  <p className="text-body" style={{ color: "#9CA3AF" }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 14 días */}
      <section className="section" id="como">
        <div className="container">
          <Reveal>
            <p className="text-caption font-semibold tracking-widest uppercase mb-4" style={{ color: "#374151" }}>
              Catorce días
            </p>
            <h2 className="text-display-lg mb-4 max-w-xl">
              Un tema diferente, cada día.
            </h2>
            <p className="text-body mb-12 max-w-lg" style={{ color: "#9CA3AF" }}>
              Cada día tiene un tema, una reflexión matutina, una reflexión
              vespertina y una pequeña práctica. Eso es todo.
            </p>
          </Reveal>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {TEMAS.map((tema, i) => (
              <Reveal key={tema} delay={i * 0.025}>
                <div
                  className="flex flex-col items-center gap-2 py-4 rounded-xl border transition-all duration-150"
                  style={{
                    borderColor: "rgba(255,255,255,0.05)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <span className="text-[10px]" style={{ color: "#374151" }}>{i + 1}</span>
                  <span
                    className="text-[10px] text-center leading-tight px-1"
                    style={{ color: "#6B7280" }}
                  >
                    {tema}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.18}>
            <p className="text-caption mt-5" style={{ color: "#374151" }}>
              Cada tema construye sobre el anterior.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pull quote */}
      <section className="section">
        <div className="container-narrow text-center">
          <Reveal>
            <div
              className="text-display-md mb-4 leading-snug"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontVariationSettings: '"opsz" 48' }}
            >
              "La mayoría de las apps quieren{" "}
              <span style={{ color: "#9CA3AF" }}>más de ti.</span>
              <br />
              Esta solo quiere que{" "}
              <span className="text-accent font-normal">aparezcas.</span>"
            </div>
            <p className="text-caption mt-3" style={{ color: "#374151" }}>
              — La idea detrás de Reconnect
            </p>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container-narrow text-center">
          <Reveal>
            <h2 className="text-display-lg mb-4">¿Listo para comenzar?</h2>
            <p className="text-body mb-10" style={{ color: "#9CA3AF" }}>
              Tu primer día te espera. No hace falta prepararse.
            </p>
            <Link href="/signup">
              <button className="btn-primary">Comenzar gratis →</button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="container flex items-center justify-between">
          <span className="font-bold text-sm tracking-tight">Reconnect</span>
          <p className="text-caption" style={{ color: "#374151" }}>
            Una práctica tranquila para la reconexión.
          </p>
        </div>
      </footer>
    </div>
  );
}
