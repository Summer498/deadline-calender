import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { year, month, day } = req.query;

  const now = new Date;

  // 与えられた日付 (月は0始まりなので-1)
  const target = Date.UTC(Number(year), Number(month) - 1, Number(day))
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())

  const toDate = (ms: number) => Math.floor(ms / (1000 * 60 * 60 * 24));
  const diffDays = toDate(target) - toDate(today);

  function getBGColor(diff: number) {
    if (diff < 0) { return "#80FF80"; }
    if (diff === 0) { return "yellow"; }
    if (diff > 0) { return "#cbcbcb"; }
    return "#000";
  }

  function getColor(diff: number) {
    if (diff < 0) { return "#fff"; }
    if (diff === 0) { return "#000"; }
    if (diff > 0) { return "#000"; }
    return "#000";
  }

  const base_crypto = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟⰀⰁⰂⰃⰄⰅⰆⰇⰈⰉⰊⰋⰌⰍⰎⰏⰐⰑⰒⰓⰔⰕⰖⰗⴰⴱⴲⴳⴴⴵⴶⴷⴸⴹⴺⴻⴼⴽⴾⴿⵀⵁⵂⵃⵄⵅⵆⵇαβγδεζηθικλμνξοπρστυφχψω"
  function getCrypto(n: number) {
    let ret = "";
    while (n) {
      ret += base_crypto[n % 10];
      n = Math.floor(n / 10);
    }
    return ret.split("").reverse().join("");
  }

  const crypto = `${getCrypto(now.getFullYear())} ${getCrypto(now.getMonth())} ${getCrypto(now.getDate())} ${getCrypto(now.getHours())} ${getCrypto(now.getMinutes())}`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(
    [
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="143" height="126">`,
      `<foreignObject x="0" y="0" width="143" height="126">`,
      `<html xmlns="http://www.w3.org/1999/xhtml">`,
      `<style>`,
      `* {background-color: ${getBGColor(diffDays)}; color: ${getColor(diffDays)}}`,
      `foreignObject {font-weight: bold;}`,
      `.year {font-size: 32px;line-height: 34px;text-align: center;margin: 3px 0 9px 0;letter-spacing: 3px;}`,
      `.md {font-size: 32px;text-align: center;margin: 0;letter-spacing: 2px;line-height: 13px;}`,
      `span {font-size: 10px;}`,
      `.count {font-size: 51px;text-align: center;letter-spacing: -4px;margin: 0;}`,
      `.crypto {font-size: 10px;text-align: center;margin: 0;}`,
      //      `@media (prefers-color-scheme: dark) {p,* {color: white}}`,
      `</style>`,
      `<div>`,
      `<p class="year">${year}</p>`,
      `<p class="md">${month}-${day}</p>`,
      `<p class="count">${Math.abs(diffDays)}<span>${diffDays < 0 ? "日前" : diffDays > 0 ? "日後" : "日"}</span></p>`,
      `<p class="crypto">${crypto}</p>`,
      `</div>`,
      `</html>`,
      `</foreignObject>`,
      `</svg>`,
    ].join("")
  );
}
