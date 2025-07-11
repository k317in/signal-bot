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

app.get('/qr', (req, res) => {
  const qrDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAYAAAC/f8GkAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB+ULEAQiDZTGzdgAABKNSURBVHhe7d3BjFRVFd/597z3mZ4JWQlWqCUWQIlSoxJplIkkIQalKTFVDlwkkZr9RCIpyUkCOSrgakCCqAqTxYhXDcXGhkvUsAioQSmgZopJlImjMvbf/n9s7d3Heju9v7u2XbS+6eJe83OOMt+7uueec97977vP+zBgYMCAgICAgICAgICAgICAgICAgICAgMCAgICAgICAgICAgICAgICAgICAgIBgYy4X90gh7EIsjI8wI+gMEwgLVb3GC6jzXFrm+4zu/nS62l7sm2SPdLNjz33+/3Ht4G0gRIzIDPmCmiX7SLNMUk82Hk5RV0ULIQwI8th6pz1FyImPjNHFJEpTr11Zq/Dj/CbN8xt8dkPZH+8SbXUVsLieO/BnM1KFcRGVAK2mwqtgrkSXy0qrK8rf4Hpy7X0gqU4iLWgtUcn46domGbwGlVkk05HyCNAwqiRmpVyhmIXU6nB6Rm3RMm/m4prQVRJJ8QZ6JhUug1Jm5ueXSvul1bNR6sh0YJanqQTVNKKAYvVF6KgZb9aU6akknTlEn8BG6XzNykA4ePkMxGKSEpynObiLaT1HpDJM23iWXyRGHU4cZwdKaIkPD3PMiLclpIMRap8Uy4HZLD3OEPerUZ0KjE+qSJ+PSuWDkrzC3lQk9ZSDi+5HNtQ2kGV1ciLHcWSCMfLHteqXyVts7JPzMKR3oKPx2goLC1Bo3CqlAQlLe0dTQX8UlJ3YnMp8SkXV0Dg4QKPUOTbnco1CZySHy17CYw4JKqJeuPSX4uQxZpIpbF0lurZGX9S9S0sYgZrTJ0VC+CGTYgkBZmcHHX70dkIB1lWIAPwcnYDV9xP1wtifCcMGsePKMW1RJXUF3cJQZ9Sd3AR7p/qkXRAcTXNQpsXAJk8WcYKJEHYZe6XPwPnTJu2gW7zMjXDJ8mDEePcEy5jniuDCET/M8oXYkvz4PzkyGuk9H2LlH1QPUMptC0RrUBMs0hUEhNiGnQRJiq8jZIJhonGyptXTG6iuJdDuApMp0AlClIrRwE8Z7JShA26RhL7NKaVsxLQOnzOo03nLg7+IhorQbkxDZItkFbgSUqa0ANM0y6UqlITCx+mmpjVUYgOFj1NQ6sQInzEtQRJCPU5QvyduSNWSaRQDXGcG6Un7J0Y787f+wgeZfpDJZOhZsRKkmws9UYcTGUEkdbK3cbDvQG/KvBwDSU6pIqTz7t+/O0wMXXB3b+LblXljy0tqamodHQfTHpRlkpSe0NNaH6TwgWMLMcaL7QnTqFArVDShhEdUFWP6rMboSyjSClc2dc1oBIGYUZyYfTMSwMDHwABMG++P4zYnJTXAB4AAAAASUVORK5CYII=";
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
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
