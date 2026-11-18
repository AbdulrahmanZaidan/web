import mongoose from "mongoose";
import { Event } from "../models/event-model.js";

// İstemcinin gönderebileceği alanlar; _id, createdAt gibi alanlar sunucuya aittir.
const ALLOWED_FIELDS = ["title", "category", "capacity", "date", "time", "location", "description"];

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
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: { message: "Event not found" } });
    }
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: { message: "Event not found" } });
    }
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
    const data = Object.fromEntries(
      ALLOWED_FIELDS.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]),
    );
    // Doğrulamayı schema yapar (required, enum, minlength...).
    const event = await Event.create(data);
    res.status(201).json(event);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
}
