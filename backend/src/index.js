import app from './app.js';
import { initDb } from './config/initDb.js';

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
