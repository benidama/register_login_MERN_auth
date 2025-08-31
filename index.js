import express from 'express';
import connectDB from './config/db.js';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';

connectDB();

const app = express();
app.use(express.json());

app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
