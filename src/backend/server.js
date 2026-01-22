const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: ['gmail', 'hotmail', 'yahoo'], // or 'hotmail', 'yahoo', etc.
  auth: {
    user: 'pisalchen8@gmail.com',
    pass: 'hehn hbgr axcz ymsn'
  }
});