
import utils from '../utils.js';
import uaPool from 'random-useragent';
import ProxyAgent from'https-proxy-agent';
import axios from 'axios';




async function get(url, config={}) {
    let headers= {
        'User-Agent': uaPool.getRandom()
    };
    config = {
        ...config,
        headers: headers
    }
    // if (url.startsWith('https')){
    //     url = url.slice(0,5)+url.slice(5)
    // }
    if (process.env.PROXY_POOL_API){
        const proxyJson= await axios.get(process.env.PROXY_POOL_API);
        const proxy = proxyJson.data.proxy;
        config = {
            ...config, 
            proxy: false, // has to be false
            httpsAgent: ProxyAgent(`http://${proxy}`)
        }
    }

    
    return utils.tryUntilSucceed(async ()=>{
        return await axios.get(url, config)
    });
}


export {
    get
}