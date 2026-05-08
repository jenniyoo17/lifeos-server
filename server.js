import { createServer } from "http";
import Groq from "groq-sdk";

const PORT = process.env.PORT || 3005;
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const server = createServer(async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "GET") {
    res.writeHead(200);
    res.end("LifeOS AI Server is running");
    return;
  }

  if (req.method === "POST" && req.url === "/chat") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { message } = JSON.parse(body);
        const response = await client.chat.completions.create({
          model: "llama3-8b-8192",
          max_tokens: 300,
          messages: [
            {
              role: "system",
              content: `You are LifeOS, a smart personal assistant inside an Android app. Keep responses short, friendly, and under 3 sentences.`
            },
            { role: "user", content: message }
          ]
        });
        const reply = response.choices[0].message.content;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ reply }));
      } catch (error) {
        console.error("Error:", error);
        res.writeHead(500);
        res.end(JSON.stringify({ reply: "Sorry, try again!" }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`🚀 LifeOS AI Server running on port ${PORT}`);
});
