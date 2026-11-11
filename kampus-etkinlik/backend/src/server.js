import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.PORT || 3000);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error("PORT, 1 ile 65535 arasında bir tam sayı olmalıdır.");
}

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}`);
});
