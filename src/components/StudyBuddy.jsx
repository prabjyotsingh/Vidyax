"use client";
import { useState, useRef, useEffect } from "react";

export default function StudyBuddy() {
  const [isOpen,     setIsOpen]     = useState(false);
  const [messages,   setMessages]   = useState([{
    role: "bot",
    text: "🔥💥 YO YO YO — **StudyBuddy is LIVE!!**\n\I woke up today and chose VIOLENCE against ignorance. 😤📚\nAsk me ANYTHING — VidyaX help, coding, math, science, study tips. I handle it ALL. Let's GET IT! 🚀",
  }]);
  const [input,      setInput]      = useState("");
  const [thinking,   setThinking]   = useState(false);
  const [streamText, setStreamText] = useState("");

  const abortRef       = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || thinking) return;

    const updated = [...messages, { role: "user", text }];
    setMessages(updated);
    setInput("");
    setThinking(true);
    setStreamText("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({
            role: m.role === "bot" ? "assistant" : "user",
            content: m.text.replace(/\*\*/g, ""),
          })),
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const d = line.slice(6);
          if (d === "[DONE]") break;
          try { full += JSON.parse(d).text; setStreamText(full); } catch {}
        }
      }

      setMessages((p) => [...p, { role: "bot", text: full || "Couldn't get a response, try again!" }]);
    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages((p) => [...p, { role: "bot", text: "⚠️ Couldn't reach StudyBuddy. Check your connection and try again." }]);
      }
    } finally {
      setThinking(false);
      setStreamText("");
      abortRef.current = null;
    }
  };

  const renderText = (text = "") =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={j} style={{ color: "#fb923c" }}>{p.slice(2, -2)}</strong>
            : p
        )}
        {i < arr.length - 1 && <br />}
      </span>
    ));

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open StudyBuddy"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: "50%", border: "none",
          background: "linear-gradient(135deg,#f97316,#ec4899)",
          boxShadow: "0 8px 32px rgba(249,115,22,0.5)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform .15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {isOpen
          ? <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          : <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r="1.2" fill="#f97316"/><circle cx="12" cy="10" r="1.2" fill="#f97316"/><circle cx="15" cy="10" r="1.2" fill="#f97316"/></svg>
        }
        <span style={{ position:"absolute", top:2, right:2, width:13, height:13, borderRadius:"50%", background:"#22c55e", border:"2px solid #05070d" }}/>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, zIndex: 9998,
          width: "min(390px, calc(100vw - 24px))",
          height: "min(580px, calc(100dvh - 120px))",
          background: "#05070d",
          border: "1px solid rgba(249,115,22,0.3)",
          borderRadius: 20,
          boxShadow: "0 32px 80px rgba(0,0,0,0.85)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "sbUp .22s cubic-bezier(.34,1.4,.64,1)",
        }}>

          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", flexShrink:0, background:"rgba(249,115,22,0.08)", borderBottom:"1px solid rgba(249,115,22,0.15)" }}>
            <div style={{ width:36, height:36, borderRadius:12, flexShrink:0, background:"linear-gradient(135deg,#f97316,#ec4899)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2Zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4Z"/></svg>
              <span style={{ position:"absolute", top:-2, right:-2, width:10, height:10, borderRadius:"50%", background:"#22c55e", border:"2px solid #05070d" }}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ color:"white", fontWeight:700, fontSize:14, margin:0 }}>StudyBuddy</p>
              <p style={{ color:"#fb923c", fontSize:11, margin:0 }}>Your AI study assistant 🟢</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:10, scrollbarWidth:"thin", scrollbarColor:"rgba(249,115,22,0.3) transparent" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display:"flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems:"flex-end", gap:8 }}>
                {msg.role === "bot" && (
                  <div style={{ width:24, height:24, borderRadius:8, flexShrink:0, background:"linear-gradient(135deg,#f97316,#ec4899)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2Zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4Z"/></svg>
                  </div>
                )}
                <div style={{
                  maxWidth:"80%", padding:"10px 13px", fontSize:14, lineHeight:1.6,
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  ...(msg.role === "user"
                    ? { background:"linear-gradient(135deg,#f97316,#ec4899)", color:"white" }
                    : { background:"rgba(255,255,255,0.055)", color:"#e2e8f0", border:"1px solid rgba(255,255,255,0.07)" }
                  ),
                }}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}

            {/* Streaming bubble */}
            {thinking && (
              <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
                <div style={{ width:24, height:24, borderRadius:8, flexShrink:0, background:"linear-gradient(135deg,#f97316,#ec4899)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2Zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4Z"/></svg>
                </div>
                <div style={{ maxWidth:"80%", padding:"10px 13px", fontSize:14, lineHeight:1.6, borderRadius:"18px 18px 18px 4px", background:"rgba(255,255,255,0.055)", color:"#e2e8f0", border:"1px solid rgba(249,115,22,0.3)" }}>
                  {streamText
                    ? <>{renderText(streamText)}<span style={{ display:"inline-block", width:2, height:16, marginLeft:2, verticalAlign:"middle", background:"#f97316", animation:"sbBlink .7s step-end infinite" }}/></>
                    : <span style={{ display:"flex", gap:5, alignItems:"center", padding:"3px 0" }}>
                        {[0,1,2].map(d => <span key={d} style={{ width:6, height:6, borderRadius:"50%", background:"#f97316", animation:`sbBounce 1.2s ease-in-out ${d*.2}s infinite` }}/>)}
                      </span>
                  }
                </div>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          {/* Input */}
          <div style={{ padding:"10px 12px", flexShrink:0, borderTop:"1px solid rgba(249,115,22,0.12)" }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(249,115,22,0.22)", borderRadius:14, padding:"8px 12px" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !thinking && sendMessage()}
                disabled={thinking}
                placeholder="Ask me anything..."
                style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#e2e8f0", fontSize:16 }}
              />
              {thinking
                ? <button onClick={() => abortRef.current?.abort()} style={{ width:32, height:32, borderRadius:10, border:"1px solid rgba(220,38,38,0.4)", background:"rgba(220,38,38,0.2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="10" height="10" fill="#ef4444" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
                  </button>
                : <button onClick={sendMessage} disabled={!input.trim()} style={{ width:32, height:32, borderRadius:10, border:"none", cursor: input.trim() ? "pointer" : "not-allowed", background: input.trim() ? "linear-gradient(135deg,#f97316,#ec4899)" : "rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background .15s" }}>
                    <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>
                  </button>
              }
            </div>
            <p style={{ textAlign:"center", fontSize:11, marginTop:5, color:"#1e293b" }}>StudyBuddy · Your AI assistant</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sbUp     { from{opacity:0;transform:translateY(14px) scale(.96)} to{opacity:1;transform:none} }
        @keyframes sbBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes sbBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
      `}</style>
    </>
  );
}
