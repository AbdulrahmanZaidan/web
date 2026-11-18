import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database.js";
import { Event } from "./models/event-model.js";
import { seedEvents } from "./data/seed-events.js";

try {
  await connectDatabase();
  // Önce sil, sonra ekle: kaç kez çalışırsa çalışsın sonuç 6 kayıttır.
  await Event.deleteMany({});
  const created = await Event.insertMany(seedEvents);
  console.log(`${created.length} etkinlik eklendi`);
} catch (err) {
  console.error(`Seed başarısız: ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
