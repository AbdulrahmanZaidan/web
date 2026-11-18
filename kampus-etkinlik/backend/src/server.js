import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const PORT = Number(process.env.PORT || 3000);

// Önce veritabanı, sonra sunucu.
try {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error("PORT, 1 ile 65535 arasında bir tam sayı olmalıdır.");
  }
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`API: http://localhost:${PORT}`);
  });
} catch (err) {
  console.error(`Bağlanılamadı: ${err.message}`);
  process.exit(1);
}
