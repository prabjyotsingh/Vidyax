"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// WebLLM loads TinyLlama-1.1B — a real transformer model running via WebGPU in browser
// Model size: ~600MB, downloads once and caches in IndexedDB
const MODEL_ID = "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC";

const SYSTEM_PROMPT = `You are VidyaX AI, a smart and friendly study assistant built into the VidyaX Playlist Tracker app.

VidyaX helps users track YouTube playlists, monitor study progress, maintain daily streaks, and organize notes.
Pages: / (dashboard), /playlists, /progress, /notes, /analytics

You help with:
- Explaining how to use VidyaX features
- Study tips, learning strategies, motivation
- Answering questions about any subject the user is studying
- Summarizing topics and concepts clearly

Be concise, warm, and encouraging. Use bullet points when listing things. Keep answers under 150 words.`;

// ── STATUS STEPS ────────────────────────────────────────────────────────────
const STEPS = [
  { id: "check",    label: "Checking WebGPU support"     },
  { id: "load",     label: "Loading WebLLM engine"       },
  { id: "download", label: "Downloading TinyLlama 1.1B"  },
  { id: "compile",  label: "Compiling shaders on GPU"    },
  { id: "ready",    label: "Model ready!"                },
];

export default function WebLLMChatBot() {
  const [isOpen, setIsOpen]           = useState(false);
  const [phase, setPhase]             = useState("idle");   // idle|loading|ready|error
  const [currentStep, setCurrentStep] = useState(0);
  const [dlProgress, setDlProgress]   = useState(0);        // 0-100
  const [dlText, setDlText]           = useState("");
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamText, setStreamText]   = useState("");
  const [errorMsg, setErrorMsg]       = useState("");
  const [gpuInfo, setGpuInfo]         = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  const engineRef      = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const abortRef       = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  useEffect(() => {
    if (isOpen && phase === "ready") setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen, phase]);

  // ── LOAD MODEL ─────────────────────────────────────────────────────────────
  const loadModel = useCallback(async () => {
    if (modelLoaded || phase === "loading") return;
    setPhase("loading");
    setCurrentStep(0);
    setDlProgress(0);

    try {
      // Step 1 — WebGPU check
      setCurrentStep(0);
      if (!navigator.gpu) throw new Error("WebGPU is not supported in this browser.\n\nPlease use Chrome 113+ or Edge 113+ on a desktop with a dedicated GPU.");
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) throw new Error("No WebGPU adapter found. Make sure your GPU drivers are up to date.");
      const info = await adapter.requestAdapterInfo?.().catch(() => null);
      setGpuInfo(info?.description || info?.vendor || "WebGPU adapter found ✓");

      // Step 2 — Load WebLLM
      setCurrentStep(1);
      const { CreateMLCEngine } = await import("https://esm.run/@mlc-ai/web-llm");

      // Step 3 — Download + Step 4 — Compile (via progress callback)
      setCurrentStep(2);
      const engine = await CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (report) => {
          const text = report.text || "";
          setDlText(text);

          if (text.includes("Fetching") || text.includes("Loading") || text.includes("fetch")) {
            setCurrentStep(2);
            const match = text.match(/(\d+(\.\d+)?)\s*%/);
            if (match) setDlProgress(parseFloat(match[1]));
            else if (report.progress) setDlProgress(Math.round(report.progress * 100));
          } else if (text.includes("shader") || text.includes("Compil")) {
            setCurrentStep(3);
            setDlProgress(100);
          }
        },
      });

      engineRef.current = engine;
      setCurrentStep(4);
      setModelLoaded(true);
      setPhase("ready");
      setMessages([{
        role: "assistant",
        text: "Hey! 🚀 I'm powered by **TinyLlama 1.1B**. Ask me anything about VidyaX or your studies!",
      }]);
    } catch (err) {
      setPhase("error");
      setErrorMsg(err.message || "Failed to load the model.");
    }
  }, [modelLoaded, phase]);

  // ── SEND MESSAGE ───────────────────────────────────────────────────────────
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isGenerating || phase !== "ready") return;

    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setIsGenerating(true);
    setStreamText("");
    abortRef.current = false;

    try {
      const history = newMessages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text.replace(/\*\*/g, ""),
      }));

      const stream = await engineRef.current.chat.completions.create({
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
        stream: true,
        temperature: 0.7,
        max_tokens: 300,
      });

      let full = "";
      for await (const chunk of stream) {
        if (abortRef.current) break;
        const delta = chunk.choices[0]?.delta?.content || "";
        full += delta;
        setStreamText(full);
      }

      setMessages(prev => [...prev, { role: "assistant", text: full || "Sorry, I couldn't generate a response." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: "Something went wrong generating a response. Try again!" }]);
    } finally {
      setIsGenerating(false);
      setStreamText("");
    }
  };

  const stopGeneration = () => { abortRef.current = true; };

  // ── RENDER HELPERS ─────────────────────────────────────────────────────────
  const renderText = (text) =>
    text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : part
    );

  const stepColor = (i) => {
    if (i < currentStep) return "#22c55e";
    if (i === currentStep) return "#a78bfa";
    return "#1e293b";
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setIsOpen(v => !v); if (phase === "idle") loadModel(); }}
        aria-label="Open VidyaX LLM Chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: phase === "ready"
            ? "linear-gradient(135deg,#7c3aed,#2563eb)"
            : phase === "error"
              ? "linear-gradient(135deg,#dc2626,#9a3412)"
              : "linear-gradient(135deg,#374151,#1e293b)",
          boxShadow: phase === "ready" ? "0 8px 32px rgba(124,58,237,0.55)" : "0 4px 16px rgba(0,0,0,0.5)",
        }}
      >
        {phase === "loading"
          ? <svg className="spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          : isOpen
            ? <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><circle cx="8.5" cy="10" r="1.2" fill="white"/><circle cx="12" cy="10" r="1.2" fill="white"/><circle cx="15.5" cy="10" r="1.2" fill="white"/></svg>
        }
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{ width: 390, height: 590, background: "#05070d", border: "1px solid rgba(124,58,237,0.28)", boxShadow: "0 32px 90px rgba(0,0,0,0.85)", animation: "chatUp .25s cubic-bezier(.34,1.4,.64,1)" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: "rgba(124,58,237,0.09)", borderBottom: "1px solid rgba(124,58,237,0.18)" }}>
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}>
                <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2Zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4Z"/></svg>
              </div>
              {phase === "ready" && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2" style={{ borderColor: "#05070d" }}/>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm tracking-tight">VidyaX LLM</p>
            </div>
            {phase === "ready" && (
              <span className="text-xs px-2 py-1 rounded-lg font-bold flex-shrink-0"
                style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa" }}>LIVE</span>
            )}
          </div>

          {/* ── LOADING SCREEN ── */}
          {(phase === "idle" || phase === "loading") && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg,#7c3aed22,#2563eb22)", border: "1px solid rgba(124,58,237,0.3)" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                    <circle cx="7" cy="10" r="1.5" fill="#a78bfa"/>
                    <circle cx="12" cy="10" r="1.5" fill="#a78bfa"/>
                    <circle cx="17" cy="10" r="1.5" fill="#a78bfa"/>
                  </svg>
                </div>
                <p className="text-white font-bold text-base mb-1">TinyLlama 1.1B</p>
                <p className="text-xs" style={{ color: "#475569" }}>Real transformer · 1.1 billion params · Runs on your GPU</p>
              </div>

              {/* Steps */}
              <div className="w-full space-y-2">
                {STEPS.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all"
                    style={{ background: i === currentStep && phase === "loading" ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${i === currentStep && phase === "loading" ? "rgba(124,58,237,0.3)" : "transparent"}` }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: stepColor(i) + "22", border: `1.5px solid ${stepColor(i)}` }}>
                      {i < currentStep
                        ? <svg width="10" height="10" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
                        : i === currentStep && phase === "loading"
                          ? <span className="w-2 h-2 rounded-full" style={{ background: "#a78bfa", animation: "pulse 1s ease-in-out infinite" }}/>
                          : <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#1e293b" }}/>
                      }
                    </div>
                    <span className="text-xs flex-1" style={{ color: i <= currentStep && phase === "loading" ? "#e2e8f0" : "#334155" }}>{step.label}</span>
                    {i === currentStep && phase === "loading" && currentStep === 2 && dlProgress > 0 && (
                      <span className="text-xs font-bold" style={{ color: "#a78bfa" }}>{Math.round(dlProgress)}%</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Download bar */}
              {phase === "loading" && currentStep === 2 && dlProgress > 0 && (
                <div className="w-full">
                  <div className="w-full rounded-full h-1.5" style={{ background: "rgba(124,58,237,0.15)" }}>
                    <div className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${dlProgress}%`, background: "linear-gradient(90deg,#7c3aed,#2563eb)" }}/>
                  </div>
                  <p className="text-xs mt-1.5 text-center" style={{ color: "#334155" }}>
                    Downloading once · cached in browser after this
                  </p>
                </div>
              )}

              {phase === "idle" && (
                <button onClick={loadModel}
                  className="w-full py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "white", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>
                  🚀 Load TinyLlama (~600MB)
                </button>
              )}

              <p className="text-xs text-center px-4" style={{ color: "#1e293b" }}>
                Requires Chrome/Edge 113+ · WebGPU · ~4GB RAM · Downloaded once, cached forever
              </p>
            </div>
          )}

          {/* ── ERROR SCREEN ── */}
          {phase === "error" && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
                <svg width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              </div>
              <div>
                <p className="text-white font-bold mb-2">Failed to Load Model</p>
                <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: "#64748b" }}>{errorMsg}</p>
              </div>
              <div className="w-full rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-xs font-bold mb-1" style={{ color: "#a78bfa" }}>Requirements</p>
                <p className="text-xs" style={{ color: "#475569" }}>✅ Chrome 113+ or Edge 113+{"\n"}✅ Desktop or laptop (not mobile){"\n"}✅ Dedicated or integrated GPU{"\n"}✅ ~4GB free RAM{"\n"}✅ WebGPU enabled (default in modern Chrome)</p>
              </div>
              <button onClick={() => { setPhase("idle"); setCurrentStep(0); setModelLoaded(false); }}
                className="w-full py-2.5 rounded-xl text-sm font-bold hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "white" }}>
                Try Again
              </button>
            </div>
          )}

          {/* ── CHAT SCREEN ── */}
          {phase === "ready" && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#3b0764 transparent" }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)", flexShrink: 0 }}>
                        <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2Zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4Z"/></svg>
                      </div>
                    )}
                    <div className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                      style={msg.role === "user"
                        ? { background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "white", borderBottomRightRadius: 4 }
                        : { background: "rgba(255,255,255,0.05)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.07)", borderBottomLeftRadius: 4 }}>
                      {renderText(msg.text)}
                    </div>
                  </div>
                ))}

                {/* Streaming response */}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}>
                      <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2Zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4Z"/></svg>
                    </div>
                    <div className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#e2e8f0", border: "1px solid rgba(124,58,237,0.3)", borderBottomLeftRadius: 4 }}>
                      {streamText
                        ? <>{renderText(streamText)}<span className="inline-block w-0.5 h-4 ml-0.5 align-middle" style={{ background: "#a78bfa", animation: "blink 0.7s step-end infinite" }}/></>
                        : <span className="flex gap-1.5 items-center py-1">
                            {[0,1,2].map(d => <span key={d} className="w-1.5 h-1.5 rounded-full" style={{ background: "#7c3aed", animation: `bounce 1.2s ease-in-out ${d*0.2}s infinite` }}/>)}
                          </span>
                      }
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef}/>
              </div>

              {/* Input */}
              <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}>
                <div className="flex gap-2 items-center rounded-xl px-3 py-2"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.22)" }}>
                  <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !isGenerating && sendMessage()}
                    disabled={isGenerating}
                    placeholder="Ask TinyLlama anything..."
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: "#e2e8f0" }}/>
                  {isGenerating
                    ? <button onClick={stopGeneration}
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(220,38,38,0.2)", border: "1px solid rgba(220,38,38,0.4)" }}>
                        <svg width="10" height="10" fill="#ef4444" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
                      </button>
                    : <button onClick={sendMessage} disabled={!input.trim()}
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                        style={{ background: input.trim() ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "rgba(255,255,255,0.05)" }}>
                        <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>
                      </button>
                  }
                </div>
                <p className="text-center text-xs mt-1.5" style={{ color: "#1e293b" }}>
                  Powered by TinyLlama 1.1B · Running on your GPU
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes chatUp  { from{opacity:0;transform:translateY(16px) scale(.96)} to{opacity:1;transform:none} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes pulse   { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bounce  { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </>
  );
}
