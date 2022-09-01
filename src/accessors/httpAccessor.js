
import utils from '../utils.js';
import uaPool from 'random-useragent';
import HttpsProxyAgent from'https-proxy-agent';
import HttpProxyAgent from'http-proxy-agent';
import axios from 'axios';

// 请求拦截器
axios.interceptors.request.use(async (c) => {
    c.headers[`user-agent`] = uaPool.getRandom();  
    c.proxy=false;
    if (process.env.HTTP_PROXY) {
      c.httpAgent = await HttpProxyAgent(process.env.HTTP_PROXY)
    }
    if (process.env.HTTPS_PROXY) {
      c.httpsAgent = await HttpsProxyAgent(process.env.HTTPS_PROXY);
    }
    return c
  }, (err) => Promise.reject(err))

async function get(url, config={}) {

    return await utils.tryUntilSucceed(async ()=>{
        return await axios.get(url, config)
    });
}



export {
    get
}