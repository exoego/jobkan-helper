'use strict';

// h:m のような勤務時間を分に変換
function timeToMinutes(time) {
    const sign = time.startsWith("-") ? -1 : 1;
    const [minute, hour] = time.match(/^-?(\d+):(\d+)$/).reverse();
    const minutes = sign * (parseInt(hour, 10) * 60 + parseInt(minute, 10));
    return minutes;
}

// 1.00 のような休暇など取得日数を分に変換
function daysToMinutes(days) {
    const number = parseFloat(days, 10);
    const minutes = number * 8 * 60; // 1.0 日を8時間とみなす
    return minutes;
}

function minutesToHoursMinutes(allMinutes) {
    const abs = Math.abs(allMinutes);
    const hours = Math.floor(abs / 60);
    const minutes = abs - hours * 60;
    if (hours > 0) {
        return `${hours}時間${minutes}分`;
    } else {
        return `${minutes}分`;
    }
}

const messageBar = document.createElement("div");
messageBar.style = `
   background: rgba(30, 30, 30, 0.75);
   display: block;
   line-height: 1em;
   width: 100%;
   position: fixed;
   bottom: 0;
   padding: 12px;
   z-index: 99999;
`;
const text = document.createElement("div");
text.style = `
   font-size: 50px;
   line-height: 1em;
   color: rgb(240, 240, 240);
`;
messageBar.append(text);

// 所定過不足累計: おそらく月初から当日までと思われるので、これを使う
try {
    const laborHoursMinutes = timeToMinutes(document.querySelector("#search-result > div.row > div:nth-child(3) > div.card > div.card-body > table > tbody > tr:nth-child(14) > td").innerText);

    // 各種休暇すべて合計。とりあえず 1.0日8時間、1.5日→12時間など計算してみます
    const holidaysMinutes = Array
        .from(document.querySelectorAll("#search-result > div.infotpl > table:nth-child(4) > tbody:nth-child(4) > tr > td"))
        .map(e => daysToMinutes(e.innerText))
        .reduce((minute, sum) => minute + sum, 0);

    const overAndShorts = laborHoursMinutes + holidaysMinutes;

    const hourMin = minutesToHoursMinutes(overAndShorts);

    text.innerText = overAndShorts >= 0
        ? `今日まで: ${hourMin} 残業してます`
        : `今日まで: ${hourMin} 不足してるようです`;
} catch (e) {
    console.error(e);
    text.innerText = `😱 エラーが発生しました。jobkan-helper にご報告いただけると助かります`;
}

document.body.appendChild(messageBar);
