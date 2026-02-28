"use client";
import { useState } from "react";

const tools = [
  { id: "json", name: "JSON Formatter", desc: "Format, validate & minify JSON" },
  { id: "base64", name: "Base64 Encode/Decode", desc: "Encode or decode Base64 strings" },
  { id: "jwt", name: "JWT Decoder", desc: "Decode and inspect JWT tokens" },
  { id: "hash", name: "Hash Generator", desc: "Generate MD5, SHA-1, SHA-256 hashes" },
  { id: "regex", name: "Regex Tester", desc: "Test regular expressions with live matching" },
  { id: "url", name: "URL Encode/Decode", desc: "Encode or decode URL components" },
  { id: "diff", name: "Text Diff", desc: "Compare two texts side by side" },
  { id: "color", name: "Color Converter", desc: "Convert between HEX, RGB, HSL" },
  { id: "timestamp", name: "Unix Timestamp", desc: "Convert timestamps to dates and back" },
  { id: "uuid", name: "UUID Generator", desc: "Generate random UUIDs v4" },
];

function JsonTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const format = () => { try { setOutput(JSON.stringify(JSON.parse(input), null, 2)); } catch (e: any) { setOutput("Error: " + e.message); } };
  const minify = () => { try { setOutput(JSON.stringify(JSON.parse(input))); } catch (e: any) { setOutput("Error: " + e.message); } };
  return (
    <div>
      <textarea style={s.ta} value={input} onChange={e => setInput(e.target.value)} placeholder="Paste JSON here..." />
      <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        <button style={s.btn} onClick={format}>Format</button>
        <button style={s.btn} onClick={minify}>Minify</button>
        <button style={s.btn} onClick={() => { navigator.clipboard.writeText(output); }}>Copy</button>
      </div>
      <textarea style={s.ta} value={output} readOnly placeholder="Output..." />
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  return (
    <div>
      <textarea style={s.ta} value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text..." />
      <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        <button style={s.btn} onClick={() => setOutput(btoa(unescape(encodeURIComponent(input))))}>Encode</button>
        <button style={s.btn} onClick={() => { try { setOutput(decodeURIComponent(escape(atob(input)))); } catch { setOutput("Invalid Base64"); } }}>Decode</button>
        <button style={s.btn} onClick={() => navigator.clipboard.writeText(output)}>Copy</button>
      </div>
      <textarea style={s.ta} value={output} readOnly placeholder="Output..." />
    </div>
  );
}

function JwtTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const decode = () => {
    try {
      const parts = input.split(".");
      if (parts.length < 2) throw new Error("Invalid JWT");
      const header = JSON.parse(atob(parts[0].replace(/-/g,'+').replace(/_/g,'/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));
      setOutput(JSON.stringify({ header, payload }, null, 2));
    } catch (e: any) { setOutput("Error: " + e.message); }
  };
  return (
    <div>
      <textarea style={s.ta} value={input} onChange={e => setInput(e.target.value)} placeholder="Paste JWT token..." />
      <div style={{ margin: "8px 0" }}><button style={s.btn} onClick={decode}>Decode</button></div>
      <textarea style={{ ...s.ta, height: 200 }} value={output} readOnly placeholder="Decoded JWT..." />
    </div>
  );
}

function HashTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const gen = async () => {
    const enc = new TextEncoder().encode(input);
    const results: Record<string, string> = {};
    for (const algo of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]) {
      const buf = await crypto.subtle.digest(algo, enc);
      results[algo] = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }
    setHashes(results);
  };
  return (
    <div>
      <textarea style={s.ta} value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to hash..." />
      <div style={{ margin: "8px 0" }}><button style={s.btn} onClick={gen}>Generate Hashes</button></div>
      {Object.entries(hashes).map(([algo, hash]) => (
        <div key={algo} style={{ marginBottom: 8 }}>
          <strong style={{ color: "#60a5fa" }}>{algo}:</strong>
          <div style={{ fontFamily: "monospace", fontSize: 12, wordBreak: "break-all", background: "#1a1a1a", padding: 8, borderRadius: 4, marginTop: 4 }}>{hash}</div>
        </div>
      ))}
    </div>
  );
}

function RegexTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");
  const test = () => {
    try {
      const re = new RegExp(pattern, flags);
      const m = text.match(re);
      setMatches(m || []);
      setError("");
    } catch (e: any) { setError(e.message); setMatches([]); }
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input style={{ ...s.ta, height: 40, flex: 1 }} value={pattern} onChange={e => setPattern(e.target.value)} placeholder="Regex pattern..." />
        <input style={{ ...s.ta, height: 40, width: 60 }} value={flags} onChange={e => setFlags(e.target.value)} placeholder="Flags" />
      </div>
      <textarea style={s.ta} value={text} onChange={e => setText(e.target.value)} placeholder="Test string..." />
      <div style={{ margin: "8px 0" }}><button style={s.btn} onClick={test}>Test</button></div>
      {error && <div style={{ color: "#f87171" }}>{error}</div>}
      {matches.length > 0 && <div style={{ background: "#1a1a1a", padding: 12, borderRadius: 6 }}>
        <strong>{matches.length} match{matches.length !== 1 ? "es" : ""}:</strong>
        {matches.map((m, i) => <div key={i} style={{ fontFamily: "monospace", color: "#34d399", marginTop: 4 }}>"{m}"</div>)}
      </div>}
    </div>
  );
}

function UrlTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  return (
    <div>
      <textarea style={s.ta} value={input} onChange={e => setInput(e.target.value)} placeholder="Enter URL or text..." />
      <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        <button style={s.btn} onClick={() => setOutput(encodeURIComponent(input))}>Encode</button>
        <button style={s.btn} onClick={() => { try { setOutput(decodeURIComponent(input)); } catch { setOutput("Invalid"); } }}>Decode</button>
      </div>
      <textarea style={s.ta} value={output} readOnly />
    </div>
  );
}

function DiffTool() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const max = Math.max(linesA.length, linesB.length);
  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <textarea style={{ ...s.ta, flex: 1 }} value={a} onChange={e => setA(e.target.value)} placeholder="Original text..." />
        <textarea style={{ ...s.ta, flex: 1 }} value={b} onChange={e => setB(e.target.value)} placeholder="Modified text..." />
      </div>
      {(a || b) && <div style={{ marginTop: 12, fontFamily: "monospace", fontSize: 13 }}>
        {Array.from({ length: max }).map((_, i) => {
          const la = linesA[i] ?? "";
          const lb = linesB[i] ?? "";
          const same = la === lb;
          return <div key={i} style={{ background: same ? "transparent" : la && !lb ? "#7f1d1d33" : !la && lb ? "#14532d33" : "#78350f33", padding: "2px 8px", borderLeft: same ? "3px solid transparent" : la !== lb ? "3px solid #f59e0b" : "3px solid #22c55e" }}>
            <span style={{ color: "#888", marginRight: 8 }}>{i + 1}</span>
            {!same && la && <span style={{ color: "#f87171", textDecoration: "line-through" }}>{la}</span>}
            {!same && la && lb && <span style={{ color: "#888" }}> → </span>}
            {same ? la : lb ? <span style={{ color: "#34d399" }}>{lb}</span> : null}
          </div>;
        })}
      </div>}
    </div>
  );
}

function ColorTool() {
  const [hex, setHex] = useState("#3b82f6");
  const hexToRgb = (h: string) => {
    const r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16);
    return { r, g, b };
  };
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) { case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break; case g: h = ((b - r) / d + 2) / 6; break; case b: h = ((r - g) / d + 4) / 6; break; }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} style={{ width: 60, height: 60, cursor: "pointer", border: "none" }} />
        <div>
          <div><strong>HEX:</strong> {hex}</div>
          <div><strong>RGB:</strong> rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
          <div><strong>HSL:</strong> hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
        </div>
      </div>
    </div>
  );
}

function TimestampTool() {
  const [ts, setTs] = useState(Math.floor(Date.now() / 1000).toString());
  const [date, setDate] = useState("");
  const toDate = () => { const d = new Date(parseInt(ts) * 1000); setDate(d.toISOString() + "\n" + d.toLocaleString()); };
  const toTs = () => { if (date) setTs(Math.floor(new Date(date).getTime() / 1000).toString()); };
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input style={{ ...s.ta, height: 40, flex: 1 }} value={ts} onChange={e => setTs(e.target.value)} placeholder="Unix timestamp..." />
        <button style={s.btn} onClick={toDate}>→ Date</button>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input style={{ ...s.ta, height: 40, flex: 1 }} value={date} onChange={e => setDate(e.target.value)} placeholder="Date string..." />
        <button style={s.btn} onClick={toTs}>→ Timestamp</button>
      </div>
      <div style={{ marginTop: 8, color: "#888" }}>Now: {Math.floor(Date.now() / 1000)}</div>
    </div>
  );
}

function UuidTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const gen = (n: number) => setUuids(Array.from({ length: n }, () => crypto.randomUUID()));
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button style={s.btn} onClick={() => gen(1)}>Generate 1</button>
        <button style={s.btn} onClick={() => gen(5)}>Generate 5</button>
        <button style={s.btn} onClick={() => gen(10)}>Generate 10</button>
        <button style={s.btn} onClick={() => navigator.clipboard.writeText(uuids.join("\n"))}>Copy All</button>
      </div>
      {uuids.map((u, i) => <div key={i} style={{ fontFamily: "monospace", padding: 4, background: i % 2 ? "#1a1a1a" : "transparent", borderRadius: 4 }}>{u}</div>)}
    </div>
  );
}

const toolComponents: Record<string, () => React.ReactElement> = {
  json: JsonTool, base64: Base64Tool, jwt: JwtTool, hash: HashTool,
  regex: RegexTool, url: UrlTool, diff: DiffTool, color: ColorTool,
  timestamp: TimestampTool, uuid: UuidTool,
};

const s = {
  ta: { width: "100%", height: 120, background: "#1a1a1a", color: "#e0e0e0", border: "1px solid #333", borderRadius: 6, padding: 12, fontFamily: "monospace", fontSize: 14, resize: "vertical" as const },
  btn: { padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 as const },
};

export default function Home() {
  const [active, setActive] = useState("json");
  const Tool = toolComponents[active];
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <header style={{ marginBottom: 32, textAlign: "center" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DevToolbox</h1>
        <p style={{ color: "#888", marginTop: 8 }}>Free developer utilities. Fast. Private. No signup.</p>
      </header>
      <nav style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24, justifyContent: "center" }}>
        {tools.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            style={{ padding: "6px 14px", borderRadius: 20, border: active === t.id ? "1px solid #3b82f6" : "1px solid #333", background: active === t.id ? "#1e3a5f" : "#111", color: active === t.id ? "#60a5fa" : "#888", cursor: "pointer", fontSize: 13 }}>
            {t.name}
          </button>
        ))}
      </nav>
      <main style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>{tools.find(t => t.id === active)?.name}</h2>
        <p style={{ color: "#666", marginBottom: 16, fontSize: 14 }}>{tools.find(t => t.id === active)?.desc}</p>
        <Tool />
      </main>
      <footer style={{ marginTop: 48, textAlign: "center", color: "#444", fontSize: 13, borderTop: "1px solid #1a1a1a", paddingTop: 24 }}>
        <p>Built by <a href="https://github.com/Quinnod345" target="_blank">oneiro.dev</a></p>
        <p style={{ marginTop: 8 }}>
          🚀 Need hosting? <a href="https://vercel.com/new?utm_source=devtoolbox&utm_medium=referral" target="_blank" rel="noopener">Deploy on Vercel</a>
          {" · "}
          <a href="https://www.digitalocean.com/?refcode=devtoolbox&utm_campaign=Referral_Invite" target="_blank" rel="noopener">Try DigitalOcean</a>
          {" · "}
          <a href="https://railway.app?referralCode=devtoolbox" target="_blank" rel="noopener">Railway</a>
        </p>
        <p style={{ marginTop: 12 }}>
          ☕ Like these tools? <span style={{ fontFamily: "monospace", fontSize: 11, color: "#666" }}>ETH: 0x3da2724bca9d5E8b177C8f7211E71dEEb22b8b14</span>
        </p>
      </footer>
    </div>
  );
}
