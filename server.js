import { WebSocketServer } from "ws";

const PORT = 3005;

const wss = new WebSocketServer({ port: PORT });

console.log(`🚀 Assistant Server running on ws://0.0.0.0:${PORT}`);

wss.on("connection", (ws) => {

  console.log("🔥 Client connected");

  ws.on("message", (msg) => {

    const text = msg.toString().toLowerCase().trim();

    console.log("📩 Received:", text);

    let reply = "";

    if (text.includes("hello") || text.includes("hi")) {
      reply = "Hello 👋 How are you doing today?";
    }

    else if (text.includes("fine")) {
      reply = "That's nice to hear 😊";
    }

    else if (text.includes("tired")) {
      reply = "You should take some rest.";
    }

    else {
      reply = "Interesting... tell me more.";
    }

    console.log("🤖 Reply:", reply);

    ws.send(reply);
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});