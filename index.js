import express from 'express';
import dotenv from 'dotenv';
import { handleCommand } from './bot.js';

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
