const app = require('./src/app');
const connectDB = require('./src/config/dbConfig');
require('dotenv').config();

const PORT = process.env.PORT | 4000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
    })
}).catch((err) => {
    console.error('Failed to start the server: ', err);
    process.exit(1);
})