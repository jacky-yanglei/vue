import {
  netWlanGet
} from '../../api/network-check-api'
import {
  devListGet
} from '../../api/speed-manage-api'

let defaultWifiSsid = null
let wifiSsid = null
let network = null

function getDevList() {
  return devListGet().then(res => {
    for (let i = 0; i < res.dev_list.length; i++) {
      if (Number.parseInt(res.dev_list[i].self) === 1) {
        network = Number.parseInt(res.dev_list[i].ct)
        break
      }
    }
    return Promise.resolve(true)
  })
    .catch(e => {
      return Promise.reject(e)
    })
}

function getNetWlan() {
  let apiData = {
    ifname: 'wlan0'
  }
  return netWlanGet(apiData).then(res => {
    defaultWifiSsid = res.wlan0.defaultssid
    wifiSsid = res.wlan0.ssid
  })
    .catch(e => {
      return Promise.reject(e)
    })
}

export default function getNetTypeAndWifiSsidService() {
  const temPromise = new Promise((resolve, reject) => {
    getNetWlan().then(res => {
      getDevList().then(res => {
        resolve({
          defaultWifiSsid,
          wifiSsid,
          network
        })
      }).catch((e) => {
        reject(e)
      })
    }).catch((e) => {
      reject(e)
    })
  })
  return temPromise
}
