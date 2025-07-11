import { getRows, appendRow, updatePaidStatus, getUnpaidList } from './google.js';

export async function handleCommand(sender, message) {
  const lowerMsg = message.toLowerCase().trim();
  const now = new Date();
  const day = now.getDay() === 2 ? 'Tuesday' : 'Friday';

  if (lowerMsg === 'join') {
    const rows = await getRows(day);
    if (!rows.some(row => row[0] === sender)) {
      await appendRow(day, sender, 'unpaid');
      console.log(`${sender} 報名成功`);
    } else {
      console.log(`${sender} 已經報名過`);
    }
  } else if (lowerMsg === 'leave') {
    console.log(`${sender} 退出報名（功能待開發）`);
  } else if (lowerMsg === 'list') {
    const rows = await getRows(day);
    console.log(`📋 ${day} 名單：\n${rows.map((r, i) => `${i + 1}. ${r[0]} - ${r[1]}`).join('\n')}`);
  } else if (lowerMsg.startsWith('paid')) {
    const name = lowerMsg.split(' ')[1] || sender;
    await updatePaidStatus(day, name, 'paid');
    console.log(`${name} 已標記為已付款`);
  } else if (lowerMsg.startsWith('unpaid')) {
    const name = lowerMsg.split(' ')[1] || sender;
    await updatePaidStatus(day, name, 'unpaid');
    console.log(`${name} 已取消付款標記`);
  } else if (lowerMsg === 'reminder') {
    const unpaid = await getUnpaidList(day);
    console.log(`🔔 提醒以下會員付款：\n${unpaid.join(', ')}`);
  } else {
    console.log(`${sender} 發送了無效指令：${message}`);
  }
}
