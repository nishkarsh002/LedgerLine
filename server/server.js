import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/index.js';
import errorHandler from './middlewares/errorMiddleware.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import planRoutes from './routes/planRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import itrRoutes from './routes/itrRoutes.js';

// Passport config
import './config/passport.js';

// Connect to database
connectDB();

const app = express();

// Trust proxy - Required for Vercel/proxied environments to get correct IP
app.set('trust proxy', 1);

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Set security headers with relaxed COOP for Firebase Auth popups
app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enable CORS
const allowedOrigins = [
    'http://localhost:5173',
    'https://taxproject-stg.vercel.app',
    'https://taxproject-api.vercel.app',
    'https://ledgerline.vercel.app' // Adding potential production domain if exists
];

const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.indexOf(origin) !== -1 || 
                         origin.endsWith('.vercel.app'); // More flexible for Vercel preview/stg domains
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
});
app.use(limiter);

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/itr', itrRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Root Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
