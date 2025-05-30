import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { year, month, day } = req.query;

  // 与えられた日付 (月は0始まりなので-1)
  const targetDate = new Date(Number(year), Number(month) - 1, Number(day));

  const now = new Date;
  
  const toDate = (t) => Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()) / (1000 * 60 * 60 * 24);

  const target = Date.UTC(Number(year), Number(month) - 1, Number(day))
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) + (1000 * 60 * 60 * 9);

  const diffDays = toDate(target - today);

  function getColor(diff: number) {
    if (diff > 0) { return "#F0F8FF"; }
    if (diff === 0) { return "yellow"; }
    if (diff < 0) { return "#cbcbcb"; }
    return "#000";
  }

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(
    [
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="143" height="126">`,
      `<foreignObject x="0" y="0" width="143" height="126">`,
      `<html xmlns="http://www.w3.org/1999/xhtml">`,
      `<style>`,
      `* {background-color: ${getColor(diffDays)}}`,
      `foreignObject {font-weight: bold;}`,
      `.year {font-size: 32px;line-height: 34px;text-align: center;margin: 3px 0 9px 0;letter-spacing: 3px;}`,
      `.md {font-size: 32px;text-align: center;margin: 0;letter-spacing: 2px;line-height: 13px;}`,
      `span {font-size: 10px;}`,
      `.count {font-size: 51px;text-align: center;letter-spacing: -4px;margin: 0;}`,
      `@media (prefers-color-scheme: dark) {p,* {color: white}}`,
      `</style>`,
      `<div>`,
      `<p class="year">${year}</p>`,
      `<p class="md">${month}-${day}</p>`,
      `<p class="count">${Math.abs(diffDays)}<span>日</span></p>`,
      `</div>`,
      `</html>`,
      `</foreignObject>`,
      `</svg>`,
    ].join("")
  );
}
