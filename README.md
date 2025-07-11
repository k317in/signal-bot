# Signal Bot

A simple Signal bot using Google Sheets to manage event signups and payments.

## Features
- `join`, `leave`, `list` command support
- Google Sheets integration
- Paid/unpaid status update
- Deployable on Render or any Node.js server

## Setup
1. Clone this repo and run:
   ```bash
   npm install
   ```
2. Create a `.env` file:
   ```env
   BOT_NUMBER=+447XXXXXXX
   SHEET_ID=your_google_sheet_id
   GOOGLE_CREDENTIALS_BASE64=base64_json_here
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Deploy to Render
- Set environment variables:
  - `BOT_NUMBER`
  - `SHEET_ID`
  - `GOOGLE_CREDENTIALS_BASE64`
