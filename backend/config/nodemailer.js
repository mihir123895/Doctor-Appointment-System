// utils/emailTransporter.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.SMTP_USER, // your Brevo SMTP login
    pass: process.env.SMTP_PASS, // your Brevo SMTP key
  },
});

export default transporter;
