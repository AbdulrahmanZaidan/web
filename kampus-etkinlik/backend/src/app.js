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

// JSON ayrıştırma hataları da REST sözleşmesindeki biçimde döner.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status >= 400 && err.status < 500 ? err.status : 500;
  const message = err.type === "entity.parse.failed"
    ? "Invalid JSON body"
    : status === 500 ? "Internal server error" : "Invalid request";
  res.status(status).json({ error: { message } });
});

export default app;
