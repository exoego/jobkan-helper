'use strict'

const sideMenuGroup = document.querySelector('#sidemenu > div.flex-shrink-0 > div')

const newTimeOffRequest = document.createElement('a')
const timeOffRequestListLink = document.querySelector("#menu_order > a[href*='/employee/holiday']")
newTimeOffRequest.href = 'https://ssl.jobcan.jp/employee/holiday/new'
newTimeOffRequest.append(`+ ${timeOffRequestListLink.innerText}`)
newTimeOffRequest.classList.add('list-group-item', 'menu-btn', 'py-3', 'text-end', 'text-right')

if (location.pathname === '/employee/holiday/new') {
  newTimeOffRequest.classList.add('active')
}

sideMenuGroup.appendChild(newTimeOffRequest)
