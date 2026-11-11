import { randomUUID } from "node:crypto";
import { events } from "../data/events.js";

export function getEvents(req, res) {
  const { category } = req.query;
  const list = category
    ? events.filter((event) => event.category === category)
    : events;
  res.json(list);
}

export function getEventById(req, res) {
  const event = events.find((item) => item.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: { message: "Event not found" } });
  }
  res.json(event);
}

export function createEvent(req, res) {
  const { title, category, date, capacity, time, location, description } = req.body ?? {};
  const required = [title, category, date];
  if (required.some((value) => typeof value !== "string" || !value.trim())) {
    return res.status(400).json({
      error: { message: "title, category and date are required" },
    });
  }

  if ([time, location, description].some((value) => value != null && typeof value !== "string")) {
    return res.status(400).json({
      error: { message: "time, location and description must be strings" },
    });
  }
  const numericCapacity = Number(capacity ?? 0);
  if (!Number.isFinite(numericCapacity) || (capacity != null && !["string", "number"].includes(typeof capacity))) {
    return res.status(400).json({ error: { message: "capacity must be a number" } });
  }

  // Kimlik sunucuda üretilir; istemcinin gönderdiği id kullanılmaz.
  const newEvent = {
    id: `event-${randomUUID()}`,
    title: title.trim(),
    category: category.trim(),
    date: date.trim(),
    capacity: numericCapacity,
    time: time ?? "",
    location: location ?? "",
    description: description ?? "",
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
}
