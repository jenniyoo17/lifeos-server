import { createServer } from "http";
import Groq from "groq-sdk";
import "dotenv/config";

const PORT = process.env.PORT || 3005;
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// HTTP server (required for Railway health check)
const server = createServer((req, res) => {
  res.writeHead(200);
  res.end("LifeOS AI Server is running");
});

const wss = new WebSocketServer({ server });

server.listen(PORT, () => {
  console.log(`🚀 LifeOS AI Server running on port ${PORT}`);
});

wss.on("connection", (ws) => {
  console.log("🔥 Client connected");

  const history = [];

  ws.on("message", async (msg) => {
    const text = msg.toString().trim();
    console.log("📩 Received:", text);

    history.push({ role: "user", content: text });

    try {
      const response = await client.chat.completions.create({
        model: "llama3-8b-8192",
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: `You are LifeOS, a smart personal assistant inside an Android app.
You help users manage tasks, memories, and daily productivity.
Keep responses short, friendly, and under 3 sentences.
If asked about tasks or notes, remind the user to check their Diary section.`
          },
          ...history
        ]
      });

      const reply = response.choices[0].message.content;
      history.push({ role: "assistant", content: reply });
      if (history.length > 10) history.splice(0, 2);

      console.log("🤖 Reply:", reply);
      ws.send(reply);

    } catch (error) {
      console.error("Groq API error:", error);
      ws.send("Sorry, I'm having trouble thinking right now. Try again!");
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});
