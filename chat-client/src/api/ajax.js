//return promises
import axios from 'axios'
import { Toast } from 'antd-mobile'
const baseUrl = ''
// const baseUrl = 'http://localhost:4000'


axios.interceptors.request.use(config => {
    Toast.loading('loading...', 1)
    return config
})
axios.interceptors.response.use(config => {
    Toast.hide()
    return config
})

export default function ajax(url, data={}, type='GET') {

  url = baseUrl + url
  if(type==='GET') { 
    // data: {username: tom, password: 123}
    // paramStr: username=tom&password=123
    let paramStr = ''
    Object.keys(data).forEach(key => {
      paramStr += key + '=' + data[key] + '&'
    })
    if(paramStr) {
      paramStr = paramStr.substring(0, paramStr.length-1)
    }

    return axios.get(url + '?' + paramStr)
  } else {

    return axios.post(url, data)
  }
}