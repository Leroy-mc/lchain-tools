import { useState, useMemo } from "react";

// L Chain Mobile — Deal Vergelijker
// Zelfde logica als deal_vergelijker.py, maar interactief.

const C = {
  bg: "#0E0F12",
  card: "#17181D",
  cardHi: "#1D1F26",
  line: "#26272E",
  text: "#F2F2F5",
  dim: "#8A8B94",
  green: "#30D158",
  orange: "#FF9F0A",
  red: "#FF453A",
  blue: "#0A84FF",
};

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const MONO = "'SF Mono', ui-monospace, Menlo, Consolas, monospace";

const START_DEALS = [
  { id: 1, toestel: "iPhone 15 Pro Max 256GB", inkoop: 650, reparatie: 85, verkoop: 920 },
  { id: 2, toestel: "iPhone 13 128GB", inkoop: 240, reparatie: 55, verkoop: 400 },
  { id: 3, toestel: "iPhone 14 Pro 128GB", inkoop: 423.89, reparatie: 157.26, verkoop: 660 },
  { id: 4, toestel: "MacBook Pro 14 M1 Pro", inkoop: 780, reparatie: 220, verkoop: 1250 },
  { id: 5, toestel: "iPhone 12 64GB", inkoop: 150, reparatie: 70, verkoop: 265 },
  { id: 6, toestel: "iPhone SE 2022", inkoop: 120, reparatie: 0, verkoop: 180 },
];

const eur = (n) =>
  "€" + n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Batterij-meter: marge getoond als battery health (40%+ marge = vol)
function Batterij({ marge, kleur }) {
  const vulling = Math.max(0, Math.min(1, marge / 40));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: 46, height: 20, border: `1.5px solid ${C.dim}`,
          borderRadius: 5, padding: 2, position: "relative",
        }}
      >
        <div
          style={{
            width: `${vulling * 100}%`, height: "100%",
            background: kleur, borderRadius: 2.5,
            transition: "width .4s ease, background .4s ease",
            minWidth: vulling > 0 ? 3 : 0,
          }}
        />
      </div>
      <div
        style={{
          width: 3, height: 8, background: C.dim,
          borderRadius: "0 2px 2px 0", marginLeft: -4,
        }}
      />
      <span style={{ fontFamily: MONO, fontSize: 13, color: kleur, fontWeight: 600 }}>
        {marge.toFixed(1)}%
      </span>
    </div>
  );
}

export default function DealVergelijker() {
  const [deals, setDeals] = useState(START_DEALS);
  const [margeMin, setMargeMin] = useState(15);
  const [margeGoed, setMargeGoed] = useState(25);
  const [form, setForm] = useState({ toestel: "", inkoop: "", reparatie: "", verkoop: "" });

  const berekend = useMemo(() => {
    return deals
      .map((d) => {
        const kosten = d.inkoop + d.reparatie;
        const winst = d.verkoop - kosten;
        const marge = d.verkoop > 0 ? (winst / d.verkoop) * 100 : 0;
        const advies = marge < margeMin ? "SKIP" : marge < margeGoed ? "TWIJFEL" : "DOEN";
        const kleur = advies === "DOEN" ? C.green : advies === "TWIJFEL" ? C.orange : C.red;
        return { ...d, kosten, winst, marge, advies, kleur };
      })
      .sort((a, b) => b.winst - a.winst);
  }, [deals, margeMin, margeGoed]);

  const doen = berekend.filter((d) => d.advies === "DOEN");
  const totWinstDoen = doen.reduce((s, d) => s + d.winst, 0);
  const totInvestDoen = doen.reduce((s, d) => s + d.kosten, 0);
  const beste = berekend[0];

  const voegToe = () => {
    const { toestel, inkoop, reparatie, verkoop } = form;
    if (!toestel.trim() || verkoop === "" || inkoop === "") return;
    setDeals([
      ...deals,
      {
        id: Date.now(),
        toestel: toestel.trim(),
        inkoop: parseFloat(inkoop) || 0,
        reparatie: parseFloat(reparatie) || 0,
        verkoop: parseFloat(verkoop) || 0,
      },
    ]);
    setForm({ toestel: "", inkoop: "", reparatie: "", verkoop: "" });
  };

  const verwijder = (id) => setDeals(deals.filter((d) => d.id !== id));

  const inputStyle = {
    background: C.cardHi, border: `1px solid ${C.line}`, borderRadius: 8,
    color: C.text, padding: "9px 11px", fontSize: 14, fontFamily: FONT,
    outline: "none", width: "100%", boxSizing: "border-box",
  };

  const drempelInput = {
    ...inputStyle, width: 56, fontFamily: MONO, textAlign: "center", padding: "5px 6px",
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: FONT, color: C.text, padding: "24px 16px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 13, letterSpacing: "0.18em", color: C.blue, fontWeight: 700 }}>
            L CHAIN MOBILE
          </span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 18px", letterSpacing: "-0.02em" }}>
          Deal Vergelijker
        </h1>

        {/* Samenvatting */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 18 }}>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: C.dim, letterSpacing: "0.08em", marginBottom: 4 }}>WINST ALS JE ALLE "DOEN" DOET</div>
            <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.green }}>{eur(totWinstDoen)}</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: C.dim, letterSpacing: "0.08em", marginBottom: 4 }}>INVESTERING DAARVOOR</div>
            <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700 }}>{eur(totInvestDoen)}</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: C.dim, letterSpacing: "0.08em", marginBottom: 4 }}>BESTE DEAL</div>
            <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {beste ? `${beste.toestel} · ${eur(beste.winst)}` : "—"}
            </div>
          </div>
        </div>

        {/* Drempels */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 18, fontSize: 13, color: C.dim }}>
          <span>Jouw regels:</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            SKIP onder
            <input type="number" value={margeMin} onChange={(e) => setMargeMin(parseFloat(e.target.value) || 0)} style={drempelInput} />%
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            DOEN vanaf
            <input type="number" value={margeGoed} onChange={(e) => setMargeGoed(parseFloat(e.target.value) || 0)} style={drempelInput} />%
          </span>
        </div>

        {/* Nieuwe deal */}
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: C.dim, letterSpacing: "0.08em", marginBottom: 10 }}>NIEUWE DEAL CHECKEN</div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 8 }}>
            <input placeholder="Toestel (bv. iPhone 13 Pro)" value={form.toestel}
              onChange={(e) => setForm({ ...form, toestel: e.target.value })} style={inputStyle} />
            <input placeholder="Inkoop €" type="number" value={form.inkoop}
              onChange={(e) => setForm({ ...form, inkoop: e.target.value })} style={inputStyle} />
            <input placeholder="Reparatie €" type="number" value={form.reparatie}
              onChange={(e) => setForm({ ...form, reparatie: e.target.value })} style={inputStyle} />
            <input placeholder="Verkoop €" type="number" value={form.verkoop}
              onChange={(e) => setForm({ ...form, verkoop: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && voegToe()} style={inputStyle} />
            <button onClick={voegToe}
              style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
              Bereken
            </button>
          </div>
        </div>

        {/* Deals */}
        {berekend.map((d, i) => (
          <div key={d.id}
            style={{
              background: i === 0 ? C.cardHi : C.card,
              border: `1px solid ${i === 0 ? d.kleur + "55" : C.line}`,
              borderRadius: 12, padding: "13px 14px", marginBottom: 8,
              display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
            }}>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>
                {i === 0 ? "🏆 " : ""}{d.toestel}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 12, color: C.dim }}>
                kosten {eur(d.kosten)} → verkoop {eur(d.verkoop)}
              </div>
            </div>
            <Batterij marge={d.marge} kleur={d.kleur} />
            <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: d.winst >= 0 ? C.text : C.red, width: 92, textAlign: "right" }}>
              {eur(d.winst)}
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
              color: d.kleur, border: `1px solid ${d.kleur}66`,
              background: d.kleur + "1A", borderRadius: 999, padding: "4px 10px", width: 62, textAlign: "center",
            }}>
              {d.advies}
            </span>
            <button onClick={() => verwijder(d.id)} aria-label={`Verwijder ${d.toestel}`}
              style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 16, padding: 4 }}>
              ✕
            </button>
          </div>
        ))}

        <p style={{ fontSize: 12, color: C.dim, marginTop: 14 }}>
          Batterijmeter = je marge (40%+ is vol). Zelfde berekening als deal_vergelijker.py in je lchain-tools repo.
        </p>
      </div>
    </div>
  );
}
