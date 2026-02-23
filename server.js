require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/dbConfig');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and then start the server
connectDB().then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});
