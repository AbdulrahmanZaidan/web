import mongoose from "mongoose";
import { Event } from "../models/event-model.js";

// İstemcinin gönderebileceği alanlar; _id, createdAt gibi alanlar sunucuya aittir.
const ALLOWED_FIELDS = ["title", "category", "capacity", "date", "time", "location", "description"];
// PATCH ile gönderilirse açıkça 400 dönen alanlar.
const KORUNAN_ALANLAR = ["_id", "createdAt", "updatedAt", "__v"];

// Aynı 404 tek yerde: biçimi yanlış ya da olmayan id.
function notFound(res) {
  return res.status(404).json({ error: { message: "Event not found" } });
}

function pickAllowed(body) {
  return Object.fromEntries(
    ALLOWED_FIELDS.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]),
  );
}

export async function getEvents(req, res, next) {
  try {
    const filter = typeof req.query.category === "string"
      ? { category: req.query.category }
      : {};
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

export async function getEventById(req, res, next) {
  try {
    // Biçimi yanlış id ("yok", "111111") CastError → 500 yerine 404 döner.
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const event = await Event.findById(req.params.id);
    if (!event) return notFound(res);
    res.json(event);
  } catch (err) {
    next(err);
  }
}

export async function createEvent(req, res, next) {
  try {
    const body = req.body;
    // Gövde bir JSON nesnesi değilse (boş, null, dizi) kayıt oluşturulmaz.
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({ error: { message: "Request body must be a JSON object" } });
    }
    // Doğrulamayı schema yapar (required, enum, minlength...).
    const event = await Event.create(pickAllowed(body));
    res.status(201).json(event);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
}

export async function updateEvent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const body = req.body ?? {};
    if (typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({ error: { message: "Request body must be a JSON object" } });
    }
    if (Object.keys(body).length === 0) {
      return res.status(400).json({ error: { message: "Body is empty" } });
    }
    const korunan = Object.keys(body).filter((k) => KORUNAN_ALANLAR.includes(k));
    if (korunan.length > 0) {
      return res.status(400).json({ error: { message: `${korunan.join(", ")} cannot be changed` } });
    }
    // Yalnızca bilinen alanlar yazılır; {"$set": {"createdAt": ...}} ile koruma aşılamaz.
    const data = pickAllowed(body);
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: { message: "No updatable fields in body" } });
    }
    const event = await Event.findByIdAndUpdate(req.params.id, data, {
      returnDocument: "after", // güncellenmiş kaydı döndür
      runValidators: true, // schema kuralları güncellemede de çalışsın
    });
    if (!event) return notFound(res);
    res.json(event);
  } catch (err) {
    // Güncellemede yanlış tip/tarih ValidationError değil doğrudan CastError verir.
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
}
