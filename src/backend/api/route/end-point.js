const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from src directory
app.use(express.static(path.join(__dirname, '../../')));

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'pisalchen8@gmail.com',
    pass: process.env.EMAIL_PASS || 'hehn hbgr axcz ymsn'
  }
});

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'pisalchen8@gmail.com',
    to: process.env.EMAIL_USER || 'pisalchen8@gmail.com',
    replyTo: email,
    subject: `New message from ${name} — Portfolio`,
    html: `<p><strong>From:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email error:', error);
      res.status(500).json({ success: false, error: 'Email failed to send' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    }
  });
});

// Root route — serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'), (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading portfolio');
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', server: 'Portfolio backend running' });
});

// 404 fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(404).send('Not found');
    }
  });
});

const server = app.listen(PORT, () => {
  console.log(`\n✨ Portfolio backend listening on http://localhost:${PORT}`);
  console.log(`📧 Email transporter configured for: ${process.env.EMAIL_USER || 'pisalchen8@gmail.com'}`);
  console.log(`📂 Serving files from: ${path.join(__dirname, '../../')}`);
});

// Handle errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});