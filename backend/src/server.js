const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

connectDB();

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;