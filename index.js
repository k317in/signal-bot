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

app.get('/qrcode.png', async (req, res) => {
  try {
    const qrText = `https://signal.org/linkdevice/#replace-with-real-signal-cli-link`;
    const qrImage = await qrcode.toBuffer(qrText);
    res.type('png');
    res.send(qrImage);
  } catch (error) {
    console.error('QR code generation failed:', error);
    res.sendStatus(500);
  }
});
