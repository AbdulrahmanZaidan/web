import express from "express";
import cors from "cors";
import eventRoutes from "./routes/event-routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    student: "2321032807",
  });
});

app.use("/events", eventRoutes);

app.use((req, res) => {
  res.status(404).json({ error: { message: "Route not found" } });
});

// Hata yakalayıcı (4 parametre). next(err) ile gelen hatalar burada biter, sunucu çökmez.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  // Bozuk JSON gövdesi istemci hatasıdır: 400.
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: { message: "Invalid JSON body" } });
  }
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: { message: "Invalid request" } });
  }
  // Ayrıntı sadece terminalde kalır; kullanıcıya genel mesaj gider.
  console.error(err.message);
  res.status(500).json({ error: { message: "Server error" } });
});

export default app;
