import express from 'express';
import dotenv from 'dotenv';
import { handleCommand } from './bot.js';
import qrcode from 'qrcode';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});

app.get('/', async (req, res) => {
  const qrText = 'https://signal.org/linkdevice/#your-real-code';
  try {
    const qrDataUrl = await qrcode.toDataURL(qrText);
    res.send(`
      <html>
        <head><title>Signal QR Code</title></head>
        <body style="text-align:center;font-family:sans-serif;">
          <h1>🔗 掃描 QR code 登入 Signal Bot</h1>
          <img src="${qrDataUrl}" />
          <p>請使用 Signal App ➜ 裝置 ➜ 加入新裝置 掃描此碼</p>
        </body>
      </html>
    `);
  } catch (e) {
    console.error("QR code error", e);
    res.status(500).send("QR code error");
  }
});
