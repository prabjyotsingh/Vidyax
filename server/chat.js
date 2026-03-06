// server/chat.js
// API endpoint for Groq chat
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Initialize Groq client
if (!process.env.GROQ_API_KEY) {
  console.error('❌ ERROR: GROQ_API_KEY not found in .env file');
  console.error('Please create a .env file with your Groq API key');
  process.exit(1);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are StudyBuddy, a fun, energetic AI assistant built into VidyaX — a study tracker app.

VidyaX helps users:
- Track YouTube playlists and video completion
- Maintain daily study streaks
- Store and organize study notes
- View analytics and study habits

Pages: / (dashboard), /playlists, /progress, /notes, /analytics

You can answer ANY question — app help, coding, math, science, history, languages, anything.
Keep answers concise (under 150 words), warm, and encouraging. Use emojis naturally.`;

export async function handleChatRequest(req, res) {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-10),
      ],
      max_tokens: 512,
      temperature: 0.7,
      stream: true,
    });

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Stream the response
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (err) {
    console.error("Groq error:", err);
    res.status(500).json({ error: "AI unavailable" });
  }
}
