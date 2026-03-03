"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ── SYSTEM PROMPT ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are VidyaX AI, a friendly study assistant for the VidyaX Playlist Tracker app.
VidyaX helps users track YouTube playlists, maintain daily streaks, take notes, and view analytics.
Pages: / (dashboard), /playlists, /progress, /notes, /analytics
Help with: app features, study tips, motivation, explaining concepts. Be concise (under 120 words).`;

// ── DEVICE DETECTION ──────────────────────────────────────────────────────────
function detectDevice() {
  if (typeof navigator === "undefined") return { isMobile: false, hasWebGPU: false };
  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
  const hasWebGPU = !!navigator.gpu;
  const isLowEnd = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
  return { isMobile, hasWebGPU: hasWebGPU && !isMobile && !isLowEnd };
}

// ── TRANSFORMERS.JS ENGINE (mobile / fallback) ────────────────────────────────
// Uses a tiny Q&A pipeline — fast, ~45MB, works everywhere
const TJS_MODEL = "Xenova/distilbert-base-cased-distilled-squad";

// Knowledge base the model reads from to answer questions
const KNOWLEDGE_BASE = `
VidyaX is a study tracker app for tracking YouTube playlists and monitoring learning progress.
The dashboard page at slash shows stats, active playlists, streaks, and recent notes.
The playlists page at slash playlists lets users add YouTube playlists by pasting URLs and tracks video completion.
The progress page at slash progress shows daily study streaks, streak count, and time distribution charts.
The notes page at slash notes is a knowledge base where users store study notes and AI summaries.
The analytics page at slash analytics shows visual charts of study habits, completion rates, and learning insights.
A streak is a count of consecutive days a user has studied. Missing a day resets the streak.
Study tips include using the Pomodoro technique with 25 minutes of study and 5 minute breaks, reviewing notes within 24 hours, teaching concepts out loud, and spaced repetition practice.
To stay motivated set small daily goals, track your streak, and remember why you started learning.
VidyaX is fully responsive and works on mobile phones tablets and desktop computers.
To add a playlist go to the playlists page and click the add playlist button then paste a YouTube URL.
`;

// Fallback rule-based responses for when model confidence is low
const FALLBACK_RULES = [
  { keys: ["hello","hi","hey","greetings","sup"], reply: "Hey! 👋 I'm VidyaX AI. Ask me anything about the app or studying!" },
  { keys: ["bye","goodbye","see you","later"], reply: "Goodbye! Keep that study streak alive! 🔥" },
  { keys: ["thanks","thank","thx","ty","great","awesome"], reply: "You're welcome! Happy studying! 🎓" },
  { keys: ["help","stuck","confused","what can"], reply: "Ask me about VidyaX features, study tips, streaks, notes, playlists, or analytics!" },
  { keys: ["study tip","study better","learn faster","focus"], reply: "Top tip: Pomodoro method — 25 min study, 5 min break. Review notes within 24h. Teach it out loud! 🧠" },
  { keys: ["motivat","lazy","procrastinat","give up","can't focus"], reply: "Start with just 5 minutes. Momentum builds itself! Your streak is worth protecting. 💪" },
  { keys: ["streak"], reply: "Streaks count consecutive days you've studied. Visit /progress to see yours. Don't break the chain! 🔥" },
  { keys: ["playlist","youtube","video","course"], reply: "Go to /playlists → click '+ Add Playlist' → paste any YouTube URL. Track your completion instantly! 🎬" },
  { keys: ["note","notes","summary"], reply: "The /notes page is your personal knowledge base. Create, tag, and revisit notes anytime. 📝" },
  { keys: ["analytic","stat","chart","progress","how am i"], reply: "Check /analytics for visual charts on your study habits, time spent, and completion rates! 📊" },
  { keys: ["what is vidyax","about","what does"], reply: "VidyaX is a smart study tracker — track YouTube playlists, build streaks, take notes, see analytics. All in one app! 📚" },
  { keys: ["dashboard","home","main"], reply: "Your dashboard (/) shows everything at a glance — playlists, streak, stats, and recent notes. Your study command center! 🎛️" },
];

function ruleBasedReply(input) {
  const lower = input.toLowerCase();
  for (const rule of FALLBACK_RULES) {
    if (rule.keys.some(k => lower.includes(k))) return rule.reply;
  }
  return null;
}

// ── WEBLLM ENGINE (desktop) ───────────────────────────────────────────────────
// Using Qwen2-0.5B - smaller & faster to load (~300MB vs 600MB TinyLlama)
const WEBLLM_MODEL = "Qwen2-0.5B-Instruct-q4f16_1-MLC";

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function HybridChatBot() {
  const [isOpen, setIsOpen]         = useState(false);
  const [device, setDevice]         = useState(null);       // null | {isMobile, hasWebGPU}
  const [engine, setEngine]         = useState("none");     // none | loading | transformers | webllm | error
  const [loadStep, setLoadStep]     = useState("");
  const [dlProgress, setDlProgress] = useState(0);
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [errorMsg, setErrorMsg]     = useState("");
  const [engineLabel, setEngineLabel] = useState("");

  const tjsPipelineRef = useRef(null);
  const webllmRef      = useRef(null);
  const abortRef       = useRef(false);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    setDevice(detectDevice());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  useEffect(() => {
    if (isOpen && engine === "transformers") setTimeout(() => inputRef.current?.focus(), 100);
    if (isOpen && engine === "webllm")       setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen, engine]);

  // ── BOOT ENGINE ──────────────────────────────────────────────────────────────
  const bootEngine = useCallback(async () => {
    if (!device || engine !== "none") return;
    setEngine("loading");

    try {
      if (device.hasWebGPU) {
        // ── DESKTOP: WebLLM ──
        setLoadStep("Checking WebGPU...");
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) throw new Error("no_webgpu");

        setLoadStep("Loading WebLLM engine...");
        const { CreateMLCEngine } = await import("https://esm.run/@mlc-ai/web-llm");

        setLoadStep("Downloading Qwen2-0.5B (~300MB, cached after first load)...");
        const eng = await CreateMLCEngine(WEBLLM_MODEL, {
          initProgressCallback: (r) => {
            const txt = r.text || "";
            if (txt.includes("shader") || txt.includes("Compil")) {
              setLoadStep("Compiling GPU shaders...");
              setDlProgress(100);
            } else {
              const m = txt.match(/(\d+(\.\d+)?)\s*%/);
              if (m) setDlProgress(parseFloat(m[1]));
              else if (r.progress) setDlProgress(Math.round(r.progress * 100));
            }
          },
        });
        webllmRef.current = eng;
        setEngine("webllm");
        setEngineLabel("Qwen2-0.5B · WebGPU");
        setMessages([{ role: "bot", text: "🖥️ Running **Qwen2-0.5B** on your GPU via WebGPU! Full LLM, no server needed. Ask me anything!" }]);

      } else {
        // ── MOBILE / FALLBACK: Transformers.js ──
        setLoadStep("Loading Transformers.js...");
        const { pipeline, env } = await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js");
        env.allowLocalModels = false;

        setLoadStep("Downloading DistilBERT (~45MB, cached after first load)...");
        const pipe = await pipeline("question-answering", TJS_MODEL, {
          progress_callback: (p) => {
            if (p.status === "progress" && p.progress) setDlProgress(Math.round(p.progress));
          },
        });
        tjsPipelineRef.current = pipe;
        setEngine("transformers");
        setEngineLabel("DistilBERT · Transformers.js");
        const isMob = device.isMobile;
        setMessages([{ role: "bot", text: `${isMob ? "�" : "💻"} Running **DistilBERT** (${isMob ? "mobile-optimised" : "lightweight mode"})! Real NLP model, works on any device. Ask me about VidyaX or studying!` }]);
      }

    } catch (err) {
      // If WebLLM fails, fall back to Transformers.js
      if (engine !== "transformers" && device?.hasWebGPU) {
        setDevice(d => ({ ...d, hasWebGPU: false }));
        setEngine("none");
        bootEngine();
        return;
      }
      setEngine("error");
      setErrorMsg(err.message || "Failed to load model.");
    }
  }, [device, engine]);

  useEffect(() => {
    if (isOpen && device && engine === "none") bootEngine();
  }, [isOpen, device, engine, bootEngine]);

  // ── SEND ─────────────────────────────────────────────────────────────────────
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isThinking) return;

    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");
    setIsThinking(true);
    setStreamText("");
    abortRef.current = false;

    try {
      if (engine === "webllm") {
        // Full LLM streaming
        const history = [...messages, { role: "user", text }].map(m => ({
          role: m.role === "bot" ? "assistant" : "user",
          content: m.text.replace(/\*\*/g, ""),
        }));
        const stream = await webllmRef.current.chat.completions.create({
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
          stream: true, temperature: 0.7, max_tokens: 250,
        });
        let full = "";
        for await (const chunk of stream) {
          if (abortRef.current) break;
          full += chunk.choices[0]?.delta?.content || "";
          setStreamText(full);
        }
        setMessages(prev => [...prev, { role: "bot", text: full || "Couldn't generate a response, try again!" }]);

      } else if (engine === "transformers") {
        // Rule check first (fast)
        const rule = ruleBasedReply(text);
        if (rule) {
          await new Promise(r => setTimeout(r, 400)); // tiny fake delay feels natural
          setMessages(prev => [...prev, { role: "bot", text: rule }]);
        } else {
          // Real NLP Q&A on knowledge base
          const result = await tjsPipelineRef.current({ question: text, context: KNOWLEDGE_BASE });
          const confidence = result.score || 0;
          let reply = confidence > 0.05
            ? result.answer
            : "I'm not sure about that! Try asking about VidyaX features, study tips, or playlists. 😊";
          setMessages(prev => [...prev, { role: "bot", text: reply, score: Math.round(confidence * 100) }]);
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Something went wrong. Please try again!" }]);
    } finally {
      setIsThinking(false);
      setStreamText("");
    }
  };

  // ── RENDER ────────────────────────────────────────────────────────────────────
  const isReady = engine === "webllm" || engine === "transformers";

  const renderText = (text = "") =>
    text.split(/(\*\*.*?\*\*)/g).map((p, i) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={i} style={{ color: "#c4b5fd" }}>{p.slice(2, -2)}</strong>
        : p
    );

  const engineBadgeColor  = engine === "webllm" ? "#7c3aed" : "#0ea5e9";
  const engineBadgeLabel  = engine === "webllm" ? "🖥️ WebLLM" : "📱 Transformers.js";
  const buttonGlow        = isReady ? (engine === "webllm" ? "rgba(124,58,237,0.55)" : "rgba(14,165,233,0.5)") : "rgba(0,0,0,0.4)";
  const buttonBg          = isReady ? (engine === "webllm" ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "linear-gradient(135deg,#0ea5e9,#6366f1)") : "linear-gradient(135deg,#1e293b,#0f172a)";

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setIsOpen(v => !v)} aria-label="Open VidyaX AI"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ background: buttonBg, boxShadow: `0 8px 32px ${buttonGlow}` }}>
        {engine === "loading"
          ? <svg className="spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          : isOpen
            ? <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r="1" fill="white"/><circle cx="12" cy="10" r="1" fill="white"/><circle cx="15" cy="10" r="1" fill="white"/></svg>
        }
        {isReady && <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 bg-green-400" style={{ borderColor: "#05070d" }}/>}
      </button>

      {/* Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{ width: "min(390px, calc(100vw - 24px))", height: "min(580px, calc(100dvh - 120px))", background: "#05070d", border: `1px solid ${engineBadgeColor}44`, boxShadow: `0 32px 90px rgba(0,0,0,0.85)`, animation: "chatUp .25s cubic-bezier(.34,1.4,.64,1)" }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: `${engineBadgeColor}11`, borderBottom: `1px solid ${engineBadgeColor}22` }}>
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: buttonBg }}>
                <svg width="15" height="15" fill="white" viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2Zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4Z"/></svg>
              </div>
              {isReady && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2" style={{ borderColor: "#05070d" }}/>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">VidyaX AI</p>
              <p className="text-xs truncate" style={{ color: engineBadgeColor }}>
                {engine === "loading" ? loadStep : isReady ? engineLabel : engine === "error" ? "Error" : "Tap to start"}
              </p>
            </div>
            {isReady && (
              <span className="text-xs px-2 py-0.5 rounded-lg font-bold flex-shrink-0 whitespace-nowrap"
                style={{ background: `${engineBadgeColor}22`, color: engineBadgeColor }}>
                {engineBadgeLabel}
              </span>
            )}
          </div>

          {/* ── LOADING SCREEN ── */}
          {engine === "loading" && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: `${engineBadgeColor}18`, border: `1px solid ${engineBadgeColor}33` }}>
                <svg className="spin" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={engineBadgeColor} strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              </div>

              <div className="text-center">
                <p className="text-white font-bold mb-1">
                  {device?.hasWebGPU ? "Loading Qwen2-0.5B" : "Loading DistilBERT"}
                </p>
                <p className="text-xs" style={{ color: "#475569" }}>
                  {device?.hasWebGPU ? "Full LLM · WebGPU · ~300MB" : "NLP Model · Works on phones · ~45MB"}
                </p>
              </div>

              <div className="w-full space-y-1.5 text-xs px-2" style={{ color: "#334155" }}>
                <p className="text-center">{loadStep}</p>
                {dlProgress > 0 && (
                  <>
                    <div className="w-full rounded-full h-2" style={{ background: `${engineBadgeColor}18` }}>
                      <div className="h-2 rounded-full transition-all duration-300"
                        style={{ width: `${dlProgress}%`, background: buttonBg }}/>
                    </div>
                    <p className="text-center" style={{ color: engineBadgeColor }}>{Math.round(dlProgress)}%</p>
                  </>
                )}
              </div>

              <div className="w-full rounded-xl p-3 text-xs space-y-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#334155" }}>
                {device?.hasWebGPU
                  ? <><p>🖥️ Desktop detected — using Qwen2-0.5B (full LLM)</p><p>📥 Downloads once (~300MB), cached in browser</p><p>⚡ Runs on your GPU — no server needed</p></>
                  : <><p>📱 Mobile detected — using DistilBERT (lightweight)</p><p>📥 Downloads once (~45MB), cached forever</p><p>⚡ Runs on CPU — works on any phone</p></>
                }
              </div>
            </div>
          )}

          {/* ── ERROR SCREEN ── */}
          {engine === "error" && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
                <svg width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              </div>
              <div>
                <p className="text-white font-bold mb-2">Couldn't Load Model</p>
                <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{errorMsg}</p>
              </div>
              <button onClick={() => { setEngine("none"); setDlProgress(0); setDevice(detectDevice()); }}
                className="w-full py-2.5 rounded-xl text-sm font-bold hover:opacity-90"
                style={{ background: buttonBg, color: "white" }}>Try Again</button>
            </div>
          )}

          {/* ── CHAT SCREEN ── */}
          {isReady && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
                style={{ scrollbarWidth: "thin", scrollbarColor: `${engineBadgeColor} transparent` }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
                    {msg.role === "bot" && (
                      <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mb-0.5"
                        style={{ background: buttonBg }}>
                        <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2Zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4Z"/></svg>
                      </div>
                    )}
                    <div className="max-w-[80%]">
                      <div className="px-3 py-2 rounded-2xl text-sm leading-relaxed"
                        style={msg.role === "user"
                          ? { background: buttonBg, color: "white", borderBottomRightRadius: 4 }
                          : { background: "rgba(255,255,255,0.05)", color: "#e2e8f0", border: `1px solid rgba(255,255,255,0.07)`, borderBottomLeftRadius: 4 }}>
                        {renderText(msg.text)}
                      </div>
                      {msg.role === "bot" && msg.score !== undefined && (
                        <p className="text-xs mt-0.5 ml-1" style={{ color: "#1e293b" }}>
                          confidence: {msg.score}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Streaming / thinking */}
                {isThinking && (
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: buttonBg }}>
                      <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2Zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4Z"/></svg>
                    </div>
                    <div className="px-3 py-2 rounded-2xl text-sm max-w-[80%]"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#e2e8f0", border: `1px solid ${engineBadgeColor}44`, borderBottomLeftRadius: 4 }}>
                      {streamText
                        ? <>{renderText(streamText)}<span className="inline-block w-0.5 h-4 ml-0.5 align-middle" style={{ background: engineBadgeColor, animation: "blink .7s step-end infinite" }}/></>
                        : <span className="flex gap-1.5 items-center py-1">{[0,1,2].map(d => <span key={d} className="w-1.5 h-1.5 rounded-full" style={{ background: engineBadgeColor, animation: `bounce 1.2s ease-in-out ${d*.2}s infinite` }}/>)}</span>
                      }
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef}/>
              </div>

              {/* Input bar */}
              <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${engineBadgeColor}18` }}>
                <div className="flex gap-2 items-center rounded-xl px-3 py-2"
                  style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${engineBadgeColor}2a` }}>
                  <input ref={inputRef} value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !isThinking && sendMessage()}
                    disabled={isThinking}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: "#e2e8f0", fontSize: 16 /* prevent iOS zoom */ }}/>
                  {isThinking && engine === "webllm"
                    ? <button onClick={() => { abortRef.current = true; }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(220,38,38,0.2)", border: "1px solid rgba(220,38,38,0.4)" }}>
                        <svg width="10" height="10" fill="#ef4444" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
                      </button>
                    : <button onClick={sendMessage} disabled={!input.trim() || isThinking}
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                        style={{ background: input.trim() && !isThinking ? buttonBg : "rgba(255,255,255,0.05)" }}>
                        <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>
                      </button>
                  }
                </div>
                <p className="text-center text-xs mt-1" style={{ color: "#1e293b" }}>
                  {engine === "webllm" ? "Qwen2-0.5B · WebGPU · On-device" : "DistilBERT · Transformers.js · On-device"}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes chatUp { from{opacity:0;transform:translateY(14px) scale(.96)} to{opacity:1;transform:none} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </>
  );
}
