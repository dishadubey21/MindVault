const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const morganLogger = require('./middlewares/morganLogger');
const errorHandler = require('./middlewares/errorHandler');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const AppError = require('./utils/appError');
const ERROR_CODES = require('./constants/errorCodes');

const app = express();

// 1. Establish HTTP Security Headers
app.use(helmet());

// 2. Enable Request Logger Middleware
app.use(morganLogger);

// 3. Configure Cross-Origin Resource Sharing (CORS)
const whitelist = [process.env.CLIENT_URL || 'http://localhost:5173'];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new AppError('CORS Policy: Request origin blocked.', 403, ERROR_CODES.FORBIDDEN));
      }
    },
    credentials: true, // Required to permit cookies exchange
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 4. Parse incoming Request Payloads (JSON & URL-encoded)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Parse Cookie Headers and sign with secret
app.use(cookieParser(process.env.COOKIE_SECRET || 'fallback_cookie_secret'));

// 6. Mount System Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);

// 7. Handle Unmatched Routes (Produces 404 NOT_FOUND AppError)
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Cannot find matching endpoint ${req.method} ${req.originalUrl} on this server.`,
      404,
      ERROR_CODES.NOT_FOUND
    )
  );
});

// 8. Register Centralized Express Global Error Handler
app.use(errorHandler);

module.exports = app;
