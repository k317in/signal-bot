import express from 'express';
import dotenv from 'dotenv';
import { handleCommand } from './bot.js';
import axios from 'axios';
import * as qrcode from 'qrcode';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const SIGNAL_API_URL = process.env.SIGNAL_API_URL;
const BOT_NUMBER = process.env.BOT_NUMBER;

app.use(express.json());
app.use(express.static('public'));

app.post('/webhook', async (req, res) => {
  const { envelope } = req.body;
  if (envelope && envelope.dataMessage && envelope.sourceNumber) {
    const message = envelope.dataMessage.message;
    const sender = envelope.sourceNumber;
    await handleCommand(sender, message);
  }
  res.sendStatus(200);
});

app.get('/qr', async (req, res) => {
  try {
    const response = await axios.post(`${SIGNAL_API_URL}/v2/link`, {
      deviceName: 'Signal Bot Web',
      number: BOT_NUMBER
    });

    const qrText = response.data.qr;
    const qrDataUrl = await qrcode.toDataURL(qrText);

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Signal Bot QR Code</title>
        <style>
          body { font-family: sans-serif; text-align: center; margin-top: 100px; }
          img { width: 300px; height: 300px; }
        </style>
      </head>
      <body>
        <h1>🔗 掃描 QR code 登入 Signal Bot</h1>
        <img src="${qrDataUrl}" alt="QR Code" />
        <p>請使用 Signal App ➜ 裝置 ➜ 加入新裝置 掃描此碼</p>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("QR code error", error);
    res.status(500).send("❌ 無法產生 QR Code");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
