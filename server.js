const app = require('./app');
const { connectToDatabase } = require('./config/databaseConnection');

async function startServer() {
  await connectToDatabase();

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
