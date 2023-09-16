const connectDB = require('./db/connect.js');
require('dotenv').config();
require('express-async-errors');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// swagger
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
let swaggerDocument;
try {
  swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));
} catch (e) {
  console.log(e);
}

const authRouter = require('./routes/authRoutes.js');
const jobsRouter = require('./routes/jobsRoutes.js');
const notFoundMiddleware = require('./middlewares/not-found.js');
const errorHandlerMiddleware = require('./middlewares/error-handler.js');
const authenticateUser = require('./middlewares/authentication.js');

const express = require('express');
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

app.get('/', (req, res) =>
  res.send('Hello people, please head to api-docs route.')
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
})();
