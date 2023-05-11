import axios from 'axios'
import qs from 'querystring'
import np from 'nprogress'
import 'nprogress/nprogress.css'
import {message} from 'antd'

const myAxios = axios.create(
    {
        timeout:4000
    }
)
// Add a request interceptor
myAxios.interceptors.request.use(function (config) {
    np.start()
    //统一处理将所有post参数都改为urlencoded形式
    if(config.method.toLowerCase() === "post" && config.data instanceof Object){
        config.data = qs.stringify(config.data)
    }
    return config;
  });

// Add a response interceptor
myAxios.interceptors.response.use(function (response){
    np.done()
    // console.log("$$$", response.data);
    return response.data;
  }, function (error) {//网络中断,url错误等原因
    np.done()
    message.error(error.message)
    return new Promise(()=>{})
});
export default myAxios