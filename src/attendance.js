'use strict'

// h:m のような勤務時間を分に変換
function timeToMinutes (time) {
  const sign = time.startsWith('-') ? -1 : 1
  const [minute, hour] = time.match(/^-?(\d+):(\d+)$/).reverse()
  const minutes = sign * (parseInt(hour, 10) * 60 + parseInt(minute, 10))
  return minutes
}

// 1.00 のような休暇など取得日数を分に変換
function daysToMinutes (days) {
  const number = parseFloat(days, 10)
  const minutes = number * 8 * 60 // 1.0 日を8時間とみなす
  return minutes
}

function minutesToHoursMinutes (allMinutes) {
  const abs = Math.abs(allMinutes)
  const hours = Math.floor(abs / 60)
  const minutes = abs - hours * 60
  if (hours > 0) {
    return `${hours}時間${minutes}分`
  } else {
    return `${minutes}分`
  }
}

function pastOrFuture (showedYear, showedMonth, cell, index, today) {
  switch (cell.innerText) {
    case '': {
      return { past: 0, future: 0 }
    }
    default: {
      const vacationTitle = cell.getAttribute('data-original-title')

      // 時間休は有休ではないので稼働時間をつけない
      if (vacationTitle.includes('時間休')) {
        return { past: 0, future: 0 }
      }

      // 半休か全休か
      const vacationLength = vacationTitle.includes('0.5') ? 0.5 : 1.0

      // 今日自体は除きたいので、翌日の 0:00とする
      const date = new Date(showedYear, showedMonth - 1, index + 2)
      if (date < today) {
        return { past: vacationLength, future: 0 }
      } else {
        return { past: 0, future: vacationLength }
      }
    }
  }
}

const messageBar = document.createElement('div')
messageBar.style = `
   background: rgba(30, 30, 30, 0.75);
   display: block;
   line-height: 1em;
   width: 100%;
   position: fixed;
   bottom: 0;
   padding: 12px;
   z-index: 99999;
`
const text = document.createElement('div')
text.style = `
   font-size: 50px;
   line-height: 1em;
   color: rgb(240, 240, 240);
`
messageBar.append(text)

try {
  const today = new Date()
  const [, showedYear, showedMonth] = document.querySelector('#search-result > div.row > div:nth-child(1) > div > div.card-body > table > tbody > tr:nth-child(1) > td')
    .innerText.match(/(\d+)\D(\d+)/).map(txt => parseInt(txt, 10))

  // 当月の有休を取得分 past と取得予定の future に仕分ける
  const paidHolidays = Array
    .from(document.querySelectorAll('#search-result > div.table-responsive.text-nowrap > table > tbody td:nth-child(11) > div'))
    .map((el, index) => pastOrFuture(showedYear, showedMonth, el, index, today))
    .reduce((last, current) => {
      return { past: last.past + current.past, future: last.future + current.future }
    }, { past: 0, future: 0 })

  // 所定過不足累計: 【昨日時点の実労働時間】-【昨日時点までに経過した所定労働日数】×【1日分の所定労働時間】
  // @see https://jobcan.zendesk.com/hc/ja/articles/360000600182-%E6%89%80%E5%AE%9A%E5%8A%B4%E5%83%8D%E6%99%82%E9%96%93%E3%81%AE%E9%81%8E%E4%B8%8D%E8%B6%B3%E6%99%82%E9%96%93%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%AF%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%81%8B-
  const laborHoursMinutes = Array
    .from(document.querySelectorAll('#search-result > div.row > div:nth-child(3) > div.card > div.card-body > table > tbody > tr'))
    .reduce((acc, e) => {
      acc[e.querySelector('th').innerText] = timeToMinutes(e.querySelector('td').innerText)
      return acc
    }, {})['所定過不足累計']

  // 過ぎた有休のみ計算。未来の有休を含めてしまうと「今日まで」の残業時間が多くなってしまうため。
  const actualHolidayMinutes = daysToMinutes(paidHolidays.past)

  const overAndShorts = laborHoursMinutes + actualHolidayMinutes

  const hourMin = minutesToHoursMinutes(overAndShorts)

  text.innerText = overAndShorts >= 0
    ? `今日まで: ${hourMin} 残業してます`
    : `今日まで: ${hourMin} 不足してるようです`
} catch (e) {
  console.error(e)
  text.innerText = '😱 エラーが発生しました。jobkan-helper にご報告いただけると助かります'
}

document.body.appendChild(messageBar)
