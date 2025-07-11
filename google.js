import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();
const SHEET_ID = process.env.SHEET_ID;

function getClient() {
  const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString()
  );
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  return google.sheets({ version: 'v4', auth });
}

export async function getRows(day) {
  const client = getClient();
  const res = await client.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${day}!A2:B`
  });
  return res.data.values || [];
}

export async function appendRow(day, name, status) {
  const client = getClient();
  await client.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${day}!A2:B`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[name, status]]
    }
  });
}

export async function updatePaidStatus(day, name, status) {
  const client = getClient();
  const rows = await getRows(day);
  const index = rows.findIndex(row => row[0] === name);
  if (index !== -1) {
    const range = `${day}!B${index + 2}`;
    await client.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[status]]
      }
    });
  }
}

export async function getUnpaidList(day) {
  const rows = await getRows(day);
  return rows.filter(r => r[1] !== 'paid').map(r => r[0]);
}
