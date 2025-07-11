const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const spreadsheetId = process.env.SHEET_ID;

// 若環境內無 credentials.json，從環境變數建立
const credsPath = path.join(__dirname, "google-credentials.json");
if (!fs.existsSync(credsPath)) {
  const base64 = process.env.GOOGLE_CREDENTIALS_BASE64;
  fs.writeFileSync(credsPath, Buffer.from(base64, "base64"));
}

const keys = require(credsPath);

const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

async function getRows(sheetName) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:F`,
  });
  return res.data.values || [];
}

async function appendRow(sheetName, row) {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:F`,
    valueInputOption: "USER_ENTERED",
    resource: { values: [row] },
  });
}

async function updatePayment(sheetName, name, paid, paidBy, paidTime) {
  const rows = await getRows(sheetName);
  const index = rows.findIndex((r) => r[0].toLowerCase() === name.toLowerCase());
  if (index === -1) return false;

  const range = `${sheetName}!D${index + 2}:F${index + 2}`;
  const values = paid ? [["✅", paidBy, paidTime]] : [["", "", ""]];
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: { values },
  });
  return true;
}

async function removeRow(sheetName, name) {
  const rows = await getRows(sheetName);
  const index = rows.findIndex((r) => r[0].toLowerCase() === name.toLowerCase());
  if (index === -1) return false;

  const requests = [{
    deleteDimension: {
      range: {
        sheetId: sheetName === "Tuesday" ? 0 : 1,
        dimension: "ROWS",
        startIndex: index + 1,
        endIndex: index + 2,
      },
    },
  }];

  await sheets.spreadsheets.batchUpdate({ spreadsheetId, resource: { requests } });
  return true;
}

module.exports = { getRows, appendRow, updatePayment, removeRow };
