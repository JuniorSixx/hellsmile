const authRoutes = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorLogger = require('./middleware/errorLogger');
const WhatsAppService = require('./services/whatsapp');

console.log('Starting server...');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/hellsmile', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const app = express();

// Security middleware
app.use(helmet());
app.use(morgan('combined'));

// CORS configuration with more permissive settings for development
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all routes
app.use(limiter);

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);

// User Schema
const userSchema = new mongoose.Schema({
  nome: String,
  email: String,
  telefone: String,
  dataCadastro: { type: Date, default: Date.now },
  dataExpiracao: { type: Date },
  ativo: { type: Boolean, default: true },
  appointmentConfirmed: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    accessToken: process.env.GMAIL_ACCESS_TOKEN
  }
});

// Routes
app.post('/api/teste-gratis', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    const { nome, email, telefone } = req.body;

    // Create trial period (7 days)
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + 7);

    // Save user
    const user = new User({
      nome,
      email,
      telefone,
      dataExpiracao
    });
    await user.save();

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Bem-vindo ao HellSmile!',
      html: `
        <h1>Bem-vindo ao HellSmile, ${nome}!</h1>
        <p>Seu período de teste gratuito começou!</p>
        <p>Você tem acesso a todas as funcionalidades até ${dataExpiracao.toLocaleDateString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'Cadastro realizado com sucesso!',
      expirationDate: dataExpiracao
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar cadastro' });
  }
});

// WhatsApp webhook endpoint
app.post('/api/whatsapp/webhook', async (req, res) => {
  try {
    const { message, sender } = req.body;
    
    if (message === '1') {
      // Confirmation received
      await User.updateOne(
        { telefone: sender },
        { $set: { appointmentConfirmed: true } }
      );
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(errorLogger);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS enabled for:', ['http://localhost:5500', 'http://127.0.0.1:5500']);
});
