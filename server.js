const app = require('./src/app');
const env = require('./src/config/env');

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});