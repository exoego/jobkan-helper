'use strict'

async function fetchAttendanceTable (url) {
  const attendanceFetchResponse = await fetch(url)
  const attendancePageText = await attendanceFetchResponse.text()
  const attendancePageDom = new DOMParser().parseFromString(attendancePageText, 'text/html')
  return attendancePageDom.querySelector('#search-result > div.row > div:nth-child(4) > div.card.jbc-card-bordered > div.card-body > table')
}

async function fetchRemainingHolidays (holidayOptions_) {
  const attendanceTable = await fetchAttendanceTable('https://ssl.jobcan.jp/employee/attendance')
  const options = Array
    .from(holidayOptions_)
    .map(e => e.innerText.replace(/\(.*/, ''))
  const holidayOptions = [...new Set(options)]

  const holidays = Array.from(attendanceTable.querySelectorAll('tr')).map(row => {
    const holiday = row.querySelector('th').innerText.replace('※', '').replace(/・.+/, '')
    const remaining = row.querySelector('td').innerText
    const index = holidayOptions.indexOf(holiday)
    // 元のドロップダウン選択肢の順に並べる。ドロップダウンにないものは末尾
    const order = index === -1 ? holidayOptions.length : index
    return { holiday, remaining, order }
  }).sort((left, right) => {
    return left.order - right.order
  })
  return holidays
}

function buildRemainingHolidaysTable (holidays) {
  return '<table>' +
  holidays.map(holiday => {
    const cellTextColor =
        parseFloat(holiday.remaining) > 0
          ? 'rgb(240, 240, 240)'
          : 'rgb(140, 140, 140)'

    return `<tr><th>${holiday.holiday}</th><td style="color: ${cellTextColor}">${holiday.remaining}</td>`
  }).join('\n') +
  '</table>'
}

(async () => {
  const popup = document.createElement('div')
  popup.style = `
   background: rgba(30, 30, 30, 0.75);
   display: block;
   line-height: 1em;
   border-radius: 8px;
   position: fixed;
   top: 500px;
   left: 270px;
   padding: 12px;
   z-index: 99999;
`
  const text = document.createElement('div')
  text.style = `
   font-size: 14px;
   line-height: 1.4em;
   color: rgb(240, 240, 240);
`
  text.innerHTML = 'loading...'

  popup.append(text)

  try {
    const holidayOptions = document.querySelectorAll('#holiday_id option')
    const holidays = await fetchRemainingHolidays(holidayOptions)

    holidayOptions.forEach(option => {
      holidays.forEach(holiday => {
        if (option.innerText.includes(holiday.holiday) && holiday.remaining === '0.00') {
          option.disabled = true
        }
      })
    })

    text.innerHTML = buildRemainingHolidaysTable(holidays)
  } catch (e) {
    console.error(e)
    text.innerHTML = '😱 エラーが発生しました。<br>jobkan-helper にご報告いただけると助かります'
  }

  document.body.appendChild(popup)
})()
