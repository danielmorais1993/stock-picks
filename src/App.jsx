// import React, { useEffect, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// // Responsive React dashboard with two features:
// // 1) Top-picks grid (calls /top-picks?n=...)
// // 2) "Check Ticker" single-ticker lookup (calls /predict?ticker=...)
// //
// // Usage: put this file at src/App.jsx in your Vite project. Make sure window.__env.VITE_API_BASE
// // is set in index.html (runtime) or edit the resolveApiBase() fallback.

// function resolveApiBase() {
//   try {
//     if (typeof window !== "undefined" && window.__env && typeof window.__env.VITE_API_BASE === "string" && window.__env.VITE_API_BASE.length > 0) {
//       return window.__env.VITE_API_BASE;
//     }
//   } catch (e) {}
//   try {
//     if (typeof process !== "undefined" && process && process.env && typeof process.env.REACT_APP_API_BASE === "string" && process.env.REACT_APP_API_BASE.length > 0) {
//       return process.env.REACT_APP_API_BASE;
//     }
//   } catch (e) {}
//   return "http://127.0.0.1:8000";
// }

// export default function App() {
//   const API_BASE = resolveApiBase();

//   // top picks
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [n, setN] = useState(20);

//   // filters
//   const [query, setQuery] = useState("");
//   const [minProb, setMinProb] = useState(0.0);

//   // check single ticker
//   const [tickerInput, setTickerInput] = useState("");
//   const [singleResult, setSingleResult] = useState(null);
//   const [singleLoading, setSingleLoading] = useState(false);
//   const [singleError, setSingleError] = useState(null);

//   const fetchPicks = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const url = `${API_BASE.replace(/\/$/, "")}/top-picks?n=${encodeURIComponent(n)}`;
//       const res = await fetch(url);
//       if (!res.ok) throw new Error(await res.text());
//       const payload = await res.json();
//       setResults(payload.results || []);
//     } catch (err) {
//       console.error(err);
//       setError(String(err));
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE, n]);

//   useEffect(() => {
//     fetchPicks();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const predictTicker = useCallback(
//     async (ticker) => {
//       if (!ticker) return;
//       setSingleLoading(true);
//       setSingleError(null);
//       setSingleResult(null);
//       try {
//         const url = `${API_BASE.replace(/\/$/, "")}/predict?ticker=${encodeURIComponent(ticker)}`;
//         const res = await fetch(url);
//         if (!res.ok) {
//           const txt = await res.text().catch(() => null);
//           throw new Error(txt || `${res.status} ${res.statusText}`);
//         }
//         const payload = await res.json();
//         setSingleResult(payload);
//       } catch (err) {
//         console.error(err);
//         setSingleError(String(err));
//       } finally {
//         setSingleLoading(false);
//       }
//     },
//     [API_BASE]
//   );

//   const filtered = results
//     .filter((r) => (typeof r.prob === "number" ? r.prob >= minProb : true))
//     .filter((r) => (query ? (r.ticker || "").toLowerCase().includes(query.toLowerCase()) : true));

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 p-4">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-extrabold tracking-tight">Stock Picks — Buy Signals</h1>
//             <p className="text-sm text-gray-600 mt-1">Model picks with probability and decision. Use for research — not financial advice.</p>
//           </div>

//           <div className="w-full md:w-auto flex items-center gap-3">
//             <input
//               aria-label="search ticker"
//               placeholder="Filter by ticker"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               className="px-3 py-2 border rounded-md shadow-sm w-36 sm:w-44"
//             />

//             <div className="flex items-center gap-2">
//               <label className="text-sm text-gray-600">Min prob</label>
//               <input
//                 type="range"
//                 min={0}
//                 max={1}
//                 step={0.01}
//                 value={minProb}
//                 onChange={(e) => setMinProb(Number(e.target.value))}
//                 className="w-28"
//               />
//               <span className="w-12 text-right font-mono">{(minProb * 100).toFixed(0)}%</span>
//             </div>

//             <button
//               onClick={fetchPicks}
//               className="ml-2 inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md shadow hover:bg-blue-700"
//             >
//               Refresh
//             </button>
//           </div>
//         </header>

//         <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left: Check single ticker */}
//           <section className="bg-white rounded-2xl shadow p-4">
//             <h2 className="text-xl font-semibold mb-3">Check a Ticker</h2>
//             <div className="flex gap-2">
//               <input
//                 placeholder="Enter ticker (e.g. AAPL)"
//                 value={tickerInput}
//                 onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
//                 className="flex-1 px-3 py-2 border rounded-md"
//               />
//               <button
//                 onClick={() => predictTicker(tickerInput)}
//                 className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
//                 disabled={singleLoading || !tickerInput}
//               >
//                 {singleLoading ? "Checking..." : "Check"}
//               </button>
//             </div>

//             <div className="mt-4">
//               {singleError && <div className="text-sm text-red-600">Error: {singleError}</div>}
//               {singleResult && (
//                 <div className="mt-2 p-3 bg-gray-50 rounded">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="text-lg font-bold">{singleResult.ticker}</div>
//                       <div className="text-sm text-gray-600">{singleResult.date}</div>
//                     </div>
//                     <DecisionBadge decision={singleResult.decision} />
//                   </div>

//                   <div className="mt-3">
//                     <div className="text-sm text-gray-600">Probability</div>
//                     <div className="mt-1"><ProbBar value={singleResult.probability ?? singleResult.prob ?? 0} /></div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* Middle + Right: top picks grid */}
//           <section className="lg:col-span-2">
//             <div className="flex items-center justify-between mb-3">
//               <h2 className="text-xl font-semibold">Top Picks</h2>
//               <div className="flex items-center gap-2">
//                 <label className="text-sm text-gray-600 mr-1">Top</label>
//                 <select value={n} onChange={(e) => setN(Number(e.target.value))} className="px-2 py-1 border rounded">
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                   <option value={50}>50</option>
//                   <option value={100}>100</option>
//                 </select>
//               </div>
//             </div>

//             {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">Error: {error}</div>}

//             <AnimatePresence>
//               {loading ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {Array.from({ length: 6 }).map((_, i) => (
//                     <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-white rounded-lg shadow">
//                       <div className="h-4 bg-gray-100 rounded w-32 mb-3" />
//                       <div className="h-3 bg-gray-100 rounded w-20 mb-2" />
//                       <div className="h-3 bg-gray-100 rounded w-24" />
//                     </motion.div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {filtered.map((r) => (
//                     <motion.article key={r.ticker} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-4 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow">
//                       <div className="flex items-center justify-between gap-4">
//                         <div>
//                           <div className="flex items-baseline gap-3">
//                             <h3 className="text-lg font-semibold">{r.ticker}</h3>
//                             <span className="text-xs text-gray-500">{r.date}</span>
//                           </div>
//                           <p className="text-sm text-gray-600 mt-1">Probability: <span className="font-mono">{(r.prob*100).toFixed(1)}%</span></p>
//                         </div>

//                         <div className="text-right">
//                           <DecisionBadge decision={r.decision} />
//                         </div>
//                       </div>

//                       <div className="mt-3"><ProbBar value={r.prob} /></div>

//                       <div className="mt-4 flex items-center gap-2">
//                         <button className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm" onClick={() => { navigator.clipboard.writeText(r.ticker); }}>
//                           Copy
//                         </button>
//                         <button className="ml-auto text-sm text-blue-600 hover:underline" onClick={() => predictTicker(r.ticker)}>
//                           Check
//                         </button>
//                       </div>
//                     </motion.article>
//                   ))}
//                 </div>
//               )}
//             </AnimatePresence>

//             {!loading && results.length === 0 && <div className="mt-6 text-center text-gray-600">No picks available. Try refresh or check backend.</div>}
//           </section>
//         </main>

//         <footer className="mt-8 text-center text-xs text-gray-500">Disclaimer: For educational use only. Not financial advice.</footer>
//       </div>
//     </div>
//   );
// }

// function DecisionBadge({ decision }) {
//   const color = decision === "Strong Buy" ? "bg-green-100 text-green-800" : decision === "Buy" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700";
//   return <div className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>{decision}</div>;
// }

// function ProbBar({ value = 0 }) {
//   const  pct = Math.round((Number(value) || 0) * 100);
//   const color = value >= 0.85 ? "bg-green-600" : value >= 0.65 ? "bg-amber-500" : "bg-gray-300";
//   return (
//     <div>
//       <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
//         <div className={`${color} h-3`} style={{ width: `${pct}%` }} />
//       </div>
//       <div className="text-xs text-gray-500 mt-1">{pct}% confidence</div>
//     </div>
//   );
// }
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Professional Stock Picks UI (single-file)
 * Drop into src/App.jsx (Vite + Tailwind + framer-motion)
 *
 * - Shows top picks grid
 * - Per-card details (on-demand) via /predict?ticker=...
 * - More info: last price, fair value, market cap, sector, RSI, Bollinger, sentiment, DL pred
 * - Journalistic / capital professional visual style
 */

/* ---------------------- runtime API resolver ---------------------- */
function resolveApiBase() {
  try {
    if (typeof window !== "undefined" && window.__env && typeof window.__env.VITE_API_BASE === "string" && window.__env.VITE_API_BASE.length > 0) {
      return window.__env.VITE_API_BASE;
    }
  } catch (e) {}
  try {
    if (typeof process !== "undefined" && process && process.env && typeof process.env.REACT_APP_API_BASE === "string" && process.env.REACT_APP_API_BASE.length > 0) {
      return process.env.REACT_APP_API_BASE;
    }
  } catch (e) {}
  return "http://127.0.0.1:8000";
}

/* ---------------------- small formatters ---------------------- */
const fmtNum = (n) => {
  if (n === null || n === undefined) return "-";
  if (Math.abs(n) >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(2)}k`;
  return Number(n).toFixed(2);
};
const fmtCurrency = (n) => (n == null ? "-" : `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
const sentimentLabel = (v) => {
  if (v == null) return "—";
  if (v >= 0.05) return "Positive";
  if (v <= -0.05) return "Negative";
  return "Neutral";
};

/* ---------------------- small UI atoms ---------------------- */
function DecisionBadge({ decision }) {
  const cls =
    decision === "Strong Buy"
      ? "bg-green-50 text-green-800 border border-green-100"
      : decision === "Buy"
      ? "bg-amber-50 text-amber-800 border border-amber-100"
      : "bg-gray-50 text-gray-700 border border-gray-100";
  return <div className={`px-3 py-1 rounded-full text-sm font-semibold ${cls}`}>{decision}</div>;
}

function ProbBar({ value = 0 }) {
  const pct = Math.round((Number(value) || 0) * 100);
  const color = value >= 0.85 ? "bg-green-600" : value >= 0.65 ? "bg-amber-500" : "bg-gray-300";
  return (
    <div className="mt-2">
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-50">
        <div className={`${color} h-3`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-gray-500 mt-1">{pct}% confidence</div>
    </div>
  );
}

/* ---------------------- Main App ---------------------- */
export default function App() {
  const API_BASE = resolveApiBase();

  // top picks
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [n, setN] = useState(20);

  // filters
  const [query, setQuery] = useState("");
  const [minProb, setMinProb] = useState(0.0);

  // check single ticker (left panel)
  const [tickerInput, setTickerInput] = useState("");
  const [singleResult, setSingleResult] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState(null);

  // per-card details cache: { TICKER: { loading, error, data } }
  const [details, setDetails] = useState({});

  const fetchPicks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE.replace(/\/$/, "")}/top-picks?n=${encodeURIComponent(n)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text());
      const payload = await res.json();
      setResults(payload.results || []);
    } catch (err) {
      console.error(err);
      setError(String(err));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, n]);

  useEffect(() => {
    fetchPicks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const predictTicker = useCallback(
    async (ticker, options = { cacheKey: null }) => {
      if (!ticker) return;
      // allow caller to track per-card loading if cacheKey supplied
      const cacheKey = options.cacheKey || ticker;
      if (cacheKey) setDetails((s) => ({ ...s, [cacheKey]: { ...(s[cacheKey] || {}), loading: true, error: null } }));
      setSingleLoading(true);
      setSingleError(null);
      setSingleResult(null);
      try {
        const url = `${API_BASE.replace(/\/$/, "")}/predict?ticker=${encodeURIComponent(ticker)}`;
        const res = await fetch(url);
        if (!res.ok) {
          const txt = await res.text().catch(() => null);
          throw new Error(txt || `${res.status} ${res.statusText}`);
        }
        const payload = await res.json();
        // cache per-card if requested
        if (cacheKey) setDetails((s) => ({ ...s, [cacheKey]: { loading: false, error: null, data: payload } }));
        setSingleResult(payload);
      } catch (err) {
        console.error(err);
        if (cacheKey) setDetails((s) => ({ ...s, [cacheKey]: { loading: false, error: String(err), data: null } }));
        setSingleError(String(err));
      } finally {
        setSingleLoading(false);
      }
    },
    [API_BASE]
  );

  const toggleExpand = (ticker) => {
    const state = details[ticker];
    if (state && state.data) {
      // already loaded - just toggle a 'open' flag
      setDetails((s) => ({ ...s, [ticker]: { ...s[ticker], open: !s[ticker].open } }));
      return;
    }
    // not loaded - fetch and open
    setDetails((s) => ({ ...s, [ticker]: { ...(s[ticker] || {}), loading: true, open: true } }));
    predictTicker(ticker, { cacheKey: ticker });
  };

  const filtered = results
    .filter((r) => (typeof r.prob === "number" ? r.prob >= minProb : true))
    .filter((r) => (query ? (r.ticker || "").toLowerCase().includes(query.toLowerCase()) : true));

  /* ---------------------- Page layout ---------------------- */
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f5f3,white)] text-gray-900 p-6" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Georgia', serif" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="rounded-lg overflow-hidden shadow-md mb-6">
          <div className="bg-[#0b2545] text-white py-6 px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold tracking-tight">Capital Signals</h1>
              <p className="text-sm opacity-75 mt-1">Curated buy signals — model probabilities, fundamentals, indicators and sentiment.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-white/80 mr-2">Live API:</div>
              <div className="bg-white/5 px-3 py-2 rounded text-sm text-white/90 font-mono">{API_BASE.replace(/https?:\/\//, "")}</div>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Single ticker check */}
          <aside className="col-span-1 bg-white rounded-2xl shadow p-5 border border-gray-100">
            <h2 className="text-xl font-semibold mb-3">Check a Ticker</h2>

            <div className="flex gap-2">
              <input
                placeholder="Enter ticker (e.g. AAPL)"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button
                onClick={() => predictTicker(tickerInput)}
                className="px-3 py-2 rounded-md bg-[#003b82] text-white hover:bg-[#012a57]"
                disabled={singleLoading || !tickerInput}
              >
                {singleLoading ? "Checking..." : "Check"}
              </button>
            </div>

            <div className="mt-4">
              {singleError && <div className="text-sm text-red-600">Error: {singleError}</div>}
              {singleResult && (
                <article className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-bold">{singleResult.ticker}</div>
                      <div className="text-xs text-gray-500">{singleResult.date}</div>
                    </div>
                    <div className="text-right">
                      <DecisionBadge decision={singleResult.decision} />
                      <div className="text-xs text-gray-500 mt-2">{singleResult.dl_prediction ? `DL: ${Number(singleResult.dl_prediction).toFixed(2)}` : ""}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-baseline gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Last price</div>
                        <div className="text-lg font-medium">{fmtCurrency(singleResult.indicators?.last_price)}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Fair value</div>
                        <div className="text-lg font-medium">{fmtCurrency(singleResult.fair_value?.fair_value)}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Sentiment</div>
                        {singleResult.finbert_sentiment?.avg_scores && (
  <div className="mt-2 text-xs text-gray-600">
    <div>FinBERT avg:</div>
    <div className="flex gap-2 mt-1">
      {Object.entries(singleResult.finbert_sentiment.avg_scores).map(([k,v]) => (
        <div key={k} className="text-xs">
          <strong>{k}</strong>: {(v*100).toFixed(0)}%
        </div>
      ))}
    </div>
  </div>
)}
                      </div>
                    </div>

                    <ProbBar value={singleResult.probability ?? singleResult.prob ?? 0} />
                  </div>

                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <div>Sector: {singleResult.fundamentals?.sector ?? "-"}</div>
                    <div>Market cap: {fmtNum(singleResult.fundamentals?.marketCap)}</div>
                    <div>RSI: {singleResult.indicators?.rsi_14 ? Number(singleResult.indicators.rsi_14).toFixed(1) : "-"}</div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button className="px-3 py-2 rounded-md bg-gray-100 text-sm" onClick={() => navigator.clipboard.writeText(singleResult.ticker)}>Copy</button>
                    <a className="ml-auto text-sm text-[#003b82] hover:underline" target="_blank" rel="noreferrer" href={`https://finance.yahoo.com/quote/${singleResult.ticker}`}>Open Yahoo</a>
                  </div>
                </article>
              )}
            </div>
          </aside>

          {/* Right area: Top picks grid (spans 2 columns) */}
          <section className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Top Picks</h2>
                <div className="text-sm text-gray-500">Use filters to refine the set.</div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  aria-label="search ticker"
                  placeholder="Filter by ticker"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="px-3 py-2 border rounded-md shadow-sm w-40"
                />
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Min prob</label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={minProb}
                    onChange={(e) => setMinProb(Number(e.target.value))}
                    className="w-28"
                  />
                  <span className="w-12 text-right font-mono">{(minProb * 100).toFixed(0)}%</span>
                </div>

                <select value={n} onChange={(e) => setN(Number(e.target.value))} className="px-2 py-1 border rounded">
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>

                <button onClick={fetchPicks} className="px-3 py-2 rounded-md bg-[#003b82] text-white">Refresh</button>
              </div>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">Error: {error}</div>}

            <AnimatePresence>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-white rounded-lg shadow">
                      <div className="h-4 bg-gray-100 rounded w-32 mb-3" />
                      <div className="h-3 bg-gray-100 rounded w-20 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-24" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.map((r) => {
                    const d = details[r.ticker];
                    const loaded = d && d.data;
                    const open = d && d.open;
                    const sentimentAvg = loaded ? d.data.sentiment?.avg_compound : undefined;
                    return (
                      <motion.article key={r.ticker} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-4 bg-white rounded-2xl shadow border border-gray-50">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-baseline gap-3">
                              <h3 className="text-lg font-semibold">{r.ticker}</h3>
                              <span className="text-xs text-gray-500">{r.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Probability: <span className="font-mono">{(r.prob * 100).toFixed(1)}%</span></p>
                          </div>

                          <div className="text-right">
                            <DecisionBadge decision={r.decision} />
                            <div className="text-xs text-gray-500 mt-2">{r.rank ?? ""}</div>
                          </div>
                        </div>

                        <ProbBar value={r.prob} />

                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <div className="text-xs text-gray-500">Last</div>
                            <div className="font-medium">{loaded ? fmtCurrency(d.data.indicators?.last_price) : "—"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Fair</div>
                            <div className="font-medium">{loaded ? fmtCurrency(d.data.fair_value?.fair_value) : "—"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Sector</div>
                            <div className="font-medium">{loaded ? d.data.fundamentals?.sector ?? "-" : "-"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Mkt cap</div>
                            <div className="font-medium">{loaded ? fmtNum(d.data.fundamentals?.marketCap) : "-"}</div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button className="px-3 py-2 rounded-md bg-gray-100 text-sm" onClick={() => navigator.clipboard.writeText(r.ticker)}>Copy</button>
                          <a className="text-sm text-[#003b82] hover:underline" target="_blank" rel="noreferrer" href={`https://finance.yahoo.com/quote/${r.ticker}`}>Open Yahoo</a>

                          <button className="ml-auto px-3 py-2 rounded-md bg-white text-sm border border-gray-100" onClick={() => predictTicker(r.ticker, { cacheKey: r.ticker })}>Check</button>

                          <button className="px-3 py-2 rounded-md bg-[#f3f4f6] text-sm border border-gray-100" onClick={() => toggleExpand(r.ticker)}>
                            {open ? "Close" : "Expand"}
                          </button>
                        </div>

                        {/* Expand panel */}
                        <AnimatePresence>
                          {open && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                              <div className="p-3 bg-gray-50 rounded border border-gray-50 text-sm text-gray-700 space-y-2">
                                {d && d.loading && <div className="text-sm text-gray-500">Loading details...</div>}
                                {d && d.error && <div className="text-sm text-red-600">Error: {d.error}</div>}
                                {d && d.data && (
                                  <>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <div className="text-xs text-gray-500">RSI (14)</div>
                                        <div className="font-medium">{d.data.indicators?.rsi_14 ? Number(d.data.indicators.rsi_14).toFixed(1) : "-"}</div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-gray-500">Bollinger</div>
                                        <div className="font-medium">{d.data.indicators?.bb_h ? `${fmtCurrency(d.data.indicators.bb_h)} / ${fmtCurrency(d.data.indicators.bb_l)}` : "-"}</div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-gray-500">MACD</div>
                                        <div className="font-medium">{d.data.indicators?.macd ? Number(d.data.indicators.macd).toFixed(3) : "-"}</div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-gray-500">ATR(14)</div>
                                        <div className="font-medium">{d.data.indicators?.atr_14 ? Number(d.data.indicators.atr_14).toFixed(3) : "-"}</div>
                                      </div>
                                    </div>

                                    <div className="mt-2">
                                      <div className="text-xs text-gray-500">Fibonacci (high → low)</div>
                                      <div className="font-mono text-sm">{d.data.fibonacci ? `${fmtCurrency(d.data.fibonacci.high)} → ${fmtCurrency(d.data.fibonacci.low)}` : "-"}</div>
                                    </div>

                                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                                      <div>PE (trailing): {d.data.fundamentals?.trailingPE ?? "-"}</div>
                                      <div>EPS: {d.data.fundamentals?.epsTrailingTwelveMonths ?? "-"}</div>
                                      <div>Price/Book: {d.data.fundamentals?.priceToBook ?? "-"}</div>
                                      <div>Beta: {d.data.fundamentals?.beta ?? "-"}</div>
                                    </div>

                                    <div className="mt-2">
                                      <div className="text-xs text-gray-500">Sentiment</div>
                                      <div className="flex items-center gap-2">
                                        <div className="text-sm font-medium">{sentimentLabel(d.data.sentiment?.avg_compound)}</div>
                                        <div className="text-xs text-gray-400">({d.data.sentiment?.avg_compound?.toFixed?.(2) ?? "-"})</div>
                                      </div>
                                    </div>

                                    <div className="mt-2">
                                      <div className="text-xs text-gray-500">Model outputs</div>
                                      <div className="flex items-center gap-3 mt-1 text-sm">
                                        <div>RF prob: <span className="font-mono">{d.data.prob ? (d.data.prob * 100).toFixed(1) + "%" : "-"}</span></div>
                                        <div>Decision: <strong>{d.data.decision}</strong></div>
                                        <div>DL pred: {d.data.dl_prediction ? Number(d.data.dl_prediction).toFixed(3) : "-"}</div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>

            {!loading && results.length === 0 && <div className="mt-6 text-center text-gray-600">No picks available. Try refresh or check backend.</div>}
          </section>
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500">© Capital Signals — For educational use only. Not financial advice.</footer>
      </div>
    </div>
  );
}

/* ---------------------- helpers exported to UI ---------------------- */
// function fmtNum(n) {
//   if (n === null || n === undefined) return "-";
//   if (Math.abs(n) >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
//   if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
//   if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
//   if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(2)}k`;
//   return Number(n).toFixed(2);
// }
// function fmtCurrency(n) {
//   return n == null ? "-" : `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
// }
// function sentimentLabel(v) {
//   if (v == null) return "—";
//   if (v >= 0.05) return "Positive";
//   if (v <= -0.05) return "Negative";
//   return "Neutral";
// }
