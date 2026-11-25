import mongoose from "mongoose";
import { formatDate, parseDate } from "../utils/date.js";

// Kurallar schema'da tutulur; controller ayrıca if kontrolü yapmaz.
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["Seminer", "Atölye", "Söyleşi", "Yarışma"],
    },
    capacity: { type: Number, min: 0, default: 0 },
    // Yazarken "GG-AA-YYYY" → Date, okurken Date → "GG-AA-YYYY".
    date: { type: Date, required: true, set: parseDate, get: formatDate },
    time: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, maxlength: 500, default: "" },
  },
  // getters: yanıtta tarih biçimlenir; id: false: sanal "id" alanı eklenmez.
  { timestamps: true, toJSON: { getters: true }, id: false },
);

// Model adı "Event" → MongoDB'de collection adı "events" olur.
export const Event = mongoose.model("Event", eventSchema);
