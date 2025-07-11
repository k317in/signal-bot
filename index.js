require("dotenv").config();
const dayjs = require("dayjs");
const {
  getRows,
  appendRow,
  updatePayment,
  removeRow,
} = require("./google");

const SHEET = dayjs().day() <= 3 ? "Tuesday" : "Friday";

async function handleCommand(command, sender = "User") {
  const [action, ...rest] = command.trim().split(" ");
  const name = rest.join(" ") || sender;
  const now = dayjs().format("YYYY-MM-DD HH:mm");

  switch (action.toLowerCase()) {
    case "join":
      const rows = await getRows(SHEET);
      if (rows.find((r) => r[0].toLowerCase() === name.toLowerCase())) {
        console.log(`${name} 已經報名過`);
        return;
      }
      await appendRow(SHEET, [name, sender, now, "", "", ""]);
      console.log(`${name} 報名成功`);
      break;

    case "leave":
      const removed = await removeRow(SHEET, name);
      console.log(removed ? `${name} 已退出` : `${name} 不在名單內`);
      break;

    case "paid":
      const updatedPaid = await updatePayment(SHEET, name, true, sender, now);
      console.log(updatedPaid ? `${name} 已標記為已付款` : `${name} 不在名單內`);
      break;

    case "unpaid":
      const updatedUnpaid = await updatePayment(SHEET, name, false);
      console.log(updatedUnpaid ? `${name} 付款記錄已清除` : `${name} 不在名單內`);
      break;

    case "list":
      const list = await getRows(SHEET);
      if (!list.length) {
        console.log("未有人報名");
        return;
      }
      console.log(`📋 ${SHEET} 名單：`);
      list.forEach((r, i) =>
        console.log(`${i + 1}. ${r[0]} ${r[3] === "✅" ? "(已付款)" : ""}`)
      );
      break;

    default:
      console.log("無效指令");
  }
}

// ⬇ 測試指令：你可用 node index.js 執行以下內容
handleCommand("join Kelvin", "Kelvin");
handleCommand("paid Kelvin", "Kelvin");
handleCommand("list");
